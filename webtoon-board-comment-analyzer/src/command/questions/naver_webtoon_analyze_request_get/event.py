import pandas as pd
import requests
from PyInquirer import prompt
from konlpy.tag import Okt
from prompt_toolkit.validation import Validator, ValidationError
from tabulate import tabulate
from tqdm import tqdm

import src.analyzer
from src import logger
from src.analyzer.analyzer_core import analyze, AnalyticsResult
from src.api.backend_api import get_backend_api_headers
from src.command import style
from src.command.questions.naver_webtoon_analyze import AnalyzeResult
from src.elasticsearch import get_elasticsearch_client, elasticsearch_info, naver_webtoon_comment_object_key


log_manager = logger.LogManager(__name__)


def event(config_data):
    ARTICLE = 'ARTICLE'
    ALL = 'ALL'

    questions_user_id = [
        {
            'type': 'input',
            'message': 'Please enter user id:',
            'name': 'Sub menu',
            'validate': InputUserIntIdValueValidator
        }
    ]

    questions_is_access = [
        {
            'type': 'confirm',
            'message': 'Do you want to make the data accessible?',
            'name': 'Sub menu'
        }
    ]

    questions_anaylze_yes_or_no = [
        {
            'type': 'confirm',
            'message': 'Are you sure you want to proceed?',
            'name': 'Sub menu'
        }
    ]

    answers_user_id = int(list(prompt(questions_user_id, style=style.get_default_style()).values())[0])

    with requests.get(
            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/anlayze-request-get?id={answers_user_id}',
            headers=get_backend_api_headers(config_data)
    ) as response:
        json = response.json()
        json = json["data"]

        answers_webtoon_id = int(json["webtoonId"])
        answers_start_article = int(json["articleStart"])
        answers_end_article = int(json["articleEnd"])
        answers_comment_target = json["commentTarget"]
        answers_max_target = json["maxType"]
        answers_max_value = int(json["maxSize"])

    if answers_comment_target == 'DATE':
        answers_comment_target = "NEW"
    else:
        answers_comment_target = "BEST"

    is_exit_webtoon_info = False

    with requests.get(
            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/exist?webtoonId={answers_webtoon_id}',
            headers=get_backend_api_headers(config_data)
    ) as response:
        json = response.json()
        if bool(json["data"]):
            log_manager.get_logger().warn(f'The webtoon information you are trying to analyze is already registered.'
                                          f' (Webtoon ID: {answers_webtoon_id})')
            log_manager.get_logger().warn('For webtoons that are already registered,'
                                          ' the Elasticsearch data is initialized.')

            is_exit_webtoon_info = True

    with requests.get(
            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/info?webtoonId={answers_webtoon_id}',
            headers=get_backend_api_headers(config_data)
    ) as response:
        json = response.json()
        json = json["data"]

        title_id = json["titleId"]
        title_name = json["titleName"]
        author_writer = []
        author_painters = []
        author_origin_authors = []

        for author_writer_obj in json["author"]["writers"]:
            author_writer.append(author_writer_obj["name"])

        for author_painters_obj in json["author"]["painters"]:
            author_painters.append(author_painters_obj["name"])

        for author_origin_authors_obj in json["author"]["originAuthors"]:
            author_origin_authors.append(author_origin_authors_obj["name"])

    with requests.get(
            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/article?webtoonId={answers_webtoon_id}',
            headers=get_backend_api_headers(config_data)
    ) as response:
        json = response.json()
        json = json["data"]

        total_count = json["totalCount"]
        finished = json["finished"]

    webtoon_default_info_dict = [
        ['Title ID', title_id],
        ['Title Name', title_name],
        ['Author Writer', '\n'.join(author_writer)],
        ['Author Painters', '\n'.join(author_painters)],
        ['Author Origin Authors', '\n'.join(author_origin_authors)],
        ['Total Article Count', total_count],
        ['Finished', finished]
    ]

    print(tabulate(pd.DataFrame(webtoon_default_info_dict), tablefmt='mixed_grid', showindex=False))

    is_access = bool(list(prompt(questions_is_access, style=style.get_default_style()).values())[0])

    webtoon_default_info_dict = [
        ['Article Start Index', answers_start_article],
        ['Article End Index', answers_end_article],
        ['Comment Target', answers_comment_target],
        ['Max Target', answers_max_target],
        ['Max Value', answers_max_value],
        ['Is Access', 'Accessible' if is_access else 'Inaccessible'],
    ]

    print(tabulate(pd.DataFrame(webtoon_default_info_dict), tablefmt='mixed_grid', showindex=False))

    if bool(list(prompt(questions_anaylze_yes_or_no, style=style.get_default_style()).values())[0]):
        log_manager.get_logger().info("Comment analysis started!")
    else:
        log_manager.get_logger().info("Analyze request canceled.")
        return

    if answers_start_article <= 0 or answers_end_article <= 0:
        log_manager.get_logger().warn("Article index must be greater than 0.")
        return
    if answers_start_article > answers_end_article:
        log_manager.get_logger().warn("Article start index must be less than article end index.")
        return
    if answers_start_article > total_count or answers_end_article > total_count:
        log_manager.get_logger().warn("Article end index must be less than total count.")
        return
    if answers_max_value <= 0:
        log_manager.get_logger().warn("Max value must be greater than 0.")
        return
    okt = Okt()

    error_count = 0
    analyze_result = []
    total_statistics = {}

    if answers_max_target == ARTICLE:
        for article_index in range(answers_start_article, answers_end_article + 1):
            current_page = 1
            analyze_count = 0

            with requests.get(
                    f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/comment'
                    f'?webtoonId={answers_webtoon_id}'
                    f'&article={article_index}'
                    f'&type={answers_comment_target}'
                    f'&page={current_page}',
                    headers=get_backend_api_headers(config_data)
            ) as response:
                json = response.json()
                json = json["data"]["result"]

                total_pages = json["pageModel"]["totalPages"]

            with tqdm(total=total_pages) as pbar:
                while True:
                    with requests.get(
                            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/comment'
                            f'?webtoonId={answers_webtoon_id}'
                            f'&article={article_index}'
                            f'&type={answers_comment_target}'
                            f'&page={current_page}',
                            headers=get_backend_api_headers(config_data)
                    ) as response:
                        json = response.json()
                        json = json["data"]["result"]

                        total_pages = json["pageModel"]["totalPages"]

                        for comment_obj in json["commentList"]:
                            try:
                                comment_id = int(comment_obj["commentNo"])
                                profile_user_id = comment_obj["profileUserId"]
                                masked_user_id = comment_obj["maskedUserId"]
                                masked_user_name = comment_obj["maskedUserName"]
                                user_name = comment_obj["userName"]
                                reg_time = comment_obj["regTime"]
                                best = bool(comment_obj["best"])
                                content = comment_obj["contents"]
                                result = analyze(config_data.MODEL, content)

                                for word in list(okt.phrases(content)):
                                    if word in total_statistics:
                                        total_statistics[word] += 1
                                    else:
                                        total_statistics[word] = 1

                                analyze_result.append(
                                    AnalyzeResult(
                                        comment_id,
                                        result,
                                        profile_user_id,
                                        masked_user_id,
                                        masked_user_name,
                                        user_name,
                                        reg_time,
                                        article_index,
                                        best,
                                        content
                                    )
                                )

                                analyze_count += 1

                                if analyze_count >= answers_max_value:
                                    break
                            except:
                                error_count += 1

                    if analyze_count >= answers_max_value:
                        break

                    if current_page >= total_pages:
                        break

                    current_page += 1
                    pbar.update(1)
    elif answers_max_target == ALL:
        analyze_count = 0

        for article_index in range(answers_start_article, answers_end_article + 1):
            current_page = 1

            with tqdm(total=answers_max_value) as pbar:
                while True:
                    with requests.get(
                            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/comment'
                            f'?webtoonId={answers_webtoon_id}'
                            f'&article={article_index}'
                            f'&type={answers_comment_target}'
                            f'&page={current_page}',
                            headers=get_backend_api_headers(config_data)
                    ) as response:
                        json = response.json()
                        json = json["data"]["result"]

                        total_pages = json["pageModel"]["totalPages"]

                        for comment_obj in json["commentList"]:
                            try:
                                comment_id = int(comment_obj["commentNo"])
                                profile_user_id = comment_obj["profileUserId"]
                                masked_user_id = comment_obj["maskedUserId"]
                                masked_user_name = comment_obj["maskedUserName"]
                                user_name = comment_obj["userName"]
                                reg_time = comment_obj["regTime"]
                                best = bool(comment_obj["best"])
                                content = comment_obj["contents"]
                                result = analyze(config_data.MODEL, content)

                                for word in list(okt.phrases(content)):
                                    if word in total_statistics:
                                        total_statistics[word] += 1
                                    else:
                                        total_statistics[word] = 1

                                analyze_result.append(
                                    AnalyzeResult(
                                        comment_id,
                                        result,
                                        profile_user_id,
                                        masked_user_id,
                                        masked_user_name,
                                        user_name,
                                        reg_time,
                                        article_index,
                                        best,
                                        content
                                    )
                                )

                                analyze_count += 1
                                pbar.update(1)

                                if analyze_count >= answers_max_value:
                                    break
                            except:
                                error_count += 1

                    if analyze_count >= answers_max_value:
                        break

                    if current_page >= total_pages:
                        break

                    current_page += 1

            if analyze_count >= answers_max_value:
                break

    log_manager.get_logger().info(f"Comment analysis finished!")
    if error_count > 0:
        log_manager.get_logger().warn(f"Comment analyze error count: {error_count}")

    if answers_comment_target == 'NEW':
        answers_comment_target = "DATE"
    else:
        answers_comment_target = "BEST"

    log_manager.get_logger().info("Writing analyze result to database...")
    with requests.get(
            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/add'
            f'?webtoonId={answers_webtoon_id}'
            f'&articleStart={answers_start_article}'
            f'&articleEnd={answers_end_article}'
            f'&commentTargetType={answers_comment_target}'
            f'&commentMaxCountType={answers_max_target}'
            f'&maxSize={answers_max_value}',
            f'&isAccess={0 if is_access else 1}',
            headers=get_backend_api_headers(config_data)
    ) as response:
        json = response.json()

        if json["result"] == 'SUCCESS':
            log_manager.get_logger().info("Write analyze result to database success!")
        else:
            log_manager.get_logger().error("Write analyze result to database failed!")
            return

    log_manager.get_logger().info("Sorting word frequency count...")
    sorted_dict = list(sorted(total_statistics.items(), key=lambda item: item[1], reverse=True))

    sorted_array = []

    index_checker = 0

    for i in sorted_dict:
        if index_checker >= 100:
            break

        sorted_array.append({"word": i[0], "count": i[1]})
        index_checker += 1

    with requests.post(
            f'{config_data.BACKEND_API_SERVER_URL}/comment-word-frequency/save',
            headers=get_backend_api_headers(config_data),
            json={
                "webtoonId": answers_webtoon_id,
                "webtoonProvider": "NAVER",
                "frequency": sorted_array
            }
    ) as response:
        json = response.json()

        if json["result"] == 'SUCCESS':
            log_manager.get_logger().info("Write word frequency count to database success!")
        else:
            log_manager.get_logger().error("Write word frequency count to database failed!")
            return

    error_count = 0

    with get_elasticsearch_client(config_data) as es_client:
        if is_exit_webtoon_info:
            log_manager.get_logger().warn("All delete webtoon comment info...")
            es_client.delete_by_query(
                index=elasticsearch_info.ElasticsearchIndexName.NAVER_WEBTOON_COMMENT.value,
                query={
                    "match": {
                        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.WEBTOON_ID.value:
                            int(answers_webtoon_id),
                    }
                }
            )

            log_manager.get_logger().info("All delete webtoon comment info success!")

        log_manager.get_logger().info("Writing analyze result to elasticsearch...")

        with tqdm(total=len(analyze_result)) as pbar:
            for analyze_result_obj in analyze_result:
                try:
                    es_client.index(
                        index=elasticsearch_info.ElasticsearchIndexName.NAVER_WEBTOON_COMMENT.value,
                        id=str(analyze_result_obj.comment_id),
                        document=elasticsearch_object_parser(
                            webtoon_id=answers_webtoon_id,
                            obj=analyze_result_obj
                        ),
                    )
                except:
                    error_count += 1

                pbar.update(1)

        if error_count > 0:
            log_manager.get_logger().warn(f"Elasticsearch input error count: {error_count}")

        with requests.get(
                f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/anlayze-request-remove-for-admin?id={answers_user_id}',
                headers=get_backend_api_headers(config_data)
        ) as response:
            json = response.json()
            json = json["result"]

            if not json == 'SUCCESS':
                log_manager.get_logger().error("Remove analyze request result to database failed!")
            else:
                log_manager.get_logger().info("Remove analyze request result to database success!")

        log_manager.get_logger().info("Writing analyze result to elasticsearch success!")
        log_manager.get_logger().info("All process finished!")


def elasticsearch_object_parser(webtoon_id, obj: AnalyzeResult):
    return {
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.WEBTOON_ID.value: webtoon_id,
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.COMMENT_ID.value: obj.comment_id,
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.ARTICLE.value: obj.article_index,
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.BEST.value: obj.best,
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.WRITE_DATE.value: obj.reg_time,
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.PROFILE_USER_ID.value: obj.profile_user_id,
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.MASKED_USER_ID.value: obj.masked_user_id,
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.MASKED_USER_NAME.value: obj.masked_user_name,
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.USER_NAME.value: obj.user_name,
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.COMMENT_TEXT.value: obj.content,
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.COMMENT_DOUBLE.value:
            float(obj.analyzer_result.value[0]),
        naver_webtoon_comment_object_key.NaverWebtoonCommentObjectKey.COMMENT_RESULT.value:
            True if obj.analyzer_result.value_type == src.analyzer.AnalyzeResult.POSITIVE else False,
    }


class InputUserIntIdValueValidator(Validator):
    def validate(self, input_text):
        if len(input_text.text) == 0 \
                or input_text.text.isspace()\
                or not input_text.text.isdigit():
            raise ValidationError(
                message='Error! Please enter it again.',
                cursor_position=len(input_text.text))
