from __future__ import print_function, unicode_literals

import random
import traceback
import sys

from PyInquirer import prompt

from src import logger

import src.command.questions as questions
import src.command.style as style


log_manager = logger.LogManager(__name__)


def repl(config_data):
    try:
        # Root question input
        answers = questions.parse_root_question(
            list(prompt(questions.get_root_question(), style=style.get_default_style()).values())[0]
        )

        # Root question input handling
        events = {
            questions.RootMenuList.NAVER_WEBTOON_SEARCH: questions.naver_webtoon_search,
            questions.RootMenuList.NAVER_WEBTOON_MORE_INFO: questions.naver_webtoon_more_info,
            questions.RootMenuList.NAVER_WEBTOON_REGISTERED_ALL_INFO: questions.naver_webtoon_registered_all_info,
            questions.RootMenuList.NAVER_WEBTOON_REGISTERED_INFO: questions.naver_webtoon_registered_info,
            questions.RootMenuList.NAVER_WEBTOON_ACCESS_SETTING: questions.naver_webtoon_access_setting,
            questions.RootMenuList.ANALYZER_MODEL_TEST: questions.analyzer_model_test,
            questions.RootMenuList.NAVER_WEBTOON_ANALYZE: questions.naver_webtoon_analyze,
            questions.RootMenuList.NAVER_WEBTOON_ANALYZE_REQUEST_GET: questions.naver_webtoon_analyze_request_get,
            questions.RootMenuList.NAVER_WEBTOON_ANALYZE_REQUEST_LIST: questions.naver_webtoon_analyze_request_list,
            questions.RootMenuList.ELASTICSEARCH_CLEAR_ALL_ITEM: questions.clear_elasticsearch_all_item,
            questions.RootMenuList.EXIT: exit_event
        }

        # Execute event
        events[answers](config_data)
    except Exception as ex:
        err_msg = traceback.format_exc()

        log_manager.get_logger().error(f'{ex} --> {err_msg}')


def exit_event(config_data):
    log_manager.get_logger().info(random.choice(list(config_data.EXIT_MESSAGE_LIST)))
    sys.exit(0)
