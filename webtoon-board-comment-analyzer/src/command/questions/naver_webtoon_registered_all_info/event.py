from __future__ import print_function, unicode_literals

from typing import Final

import pandas as pd
from PyInquirer import prompt
from tabulate import tabulate
from tqdm import tqdm

from src.command import style
from src.api.backend_api import get_backend_api_headers

import requests


def event(config_data):
    LIMIT: Final = 10
    offset = 0

    NEXT_PAGE: Final = 'Next page'
    PREVIOUS_PAGE: Final = 'Previous page'
    EXIT: Final = 'Exit'

    questions_page_status = [
        {
            'type': 'list',
            'message': 'Please select the following action.',
            'name': 'Sub menu',
            'choices': [
                NEXT_PAGE,
                PREVIOUS_PAGE,
                EXIT
            ]
        }
    ]

    while True:
        with requests.get(
                f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/get-all-db?isUseOffset=true&limit={LIMIT}&offset={offset}',
                headers=get_backend_api_headers(config_data)
        ) as response:
            json = response.json()
            json = json["data"]

            get_full_count = json["fullCount"]
            now_page = offset

            webtoon_id = []
            webtoon_name = []
            webtoon_provider = []
            article_start = []
            article_end = []
            comment_type = []
            comment_max_check_type = []
            comment_max_check_size = []
            is_access = []

            total_entity = json["array"]

            with tqdm(total=len(total_entity)) as pbar:
                for json_obj in total_entity:
                    now_webtoon_id = json_obj["webtoonId"]

                    webtoon_id.append(now_webtoon_id)

                    with requests.get(
                            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/info?webtoonId={now_webtoon_id}',
                            headers=get_backend_api_headers(config_data)
                    ) as response_sub:
                        this_webtoon_name = response_sub.json()["data"]["titleName"]

                    webtoon_name.append(this_webtoon_name)
                    webtoon_provider.append(json_obj["provider"])
                    article_start.append(json_obj["articleStart"])
                    article_end.append(json_obj["articleEnd"])
                    comment_type.append(json_obj["commentTarget"])
                    comment_max_check_type.append(json_obj["maxType"])
                    comment_max_check_size.append(json_obj["maxSize"])
                    is_access.append(json_obj["isAccess"])

                    pbar.update(1)

            webtoon_dict = {
                'ID': webtoon_id,
                'Name': webtoon_name,
                'Provider': webtoon_provider,
                'Start': article_start,
                'End': article_end,
                'Target': comment_type,
                'Max Type': comment_max_check_type,
                'Max Size': comment_max_check_size,
                'Is Access': is_access
            }

            webtoon_page_info_dict = [
                ['Now Page Index', (now_page / LIMIT) + 1],
                ['Get Full Item Count', get_full_count],
                ['Show Item Count', LIMIT],
            ]

            print(tabulate(pd.DataFrame(webtoon_dict), headers='keys', tablefmt='mixed_grid', showindex=True))
            print(tabulate(pd.DataFrame(webtoon_page_info_dict), tablefmt='mixed_grid', showindex=False))

            select_item = str(list(prompt(questions_page_status, style=style.get_default_style()).values())[0])

            if select_item == NEXT_PAGE and now_page * LIMIT < get_full_count:
                offset += LIMIT
            elif select_item == PREVIOUS_PAGE and offset > 0:
                offset -= LIMIT
            elif select_item == EXIT:
                break
