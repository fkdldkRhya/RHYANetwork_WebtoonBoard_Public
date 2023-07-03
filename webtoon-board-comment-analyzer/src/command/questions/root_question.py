from enum import Enum


class RootMenuList(Enum):
    NAVER_WEBTOON_SEARCH = 'Naver webtoon search'
    NAVER_WEBTOON_MORE_INFO = 'Naver webtoon more info'
    NAVER_WEBTOON_REGISTERED_ALL_INFO = 'Naver webtoon registered info (All)'
    NAVER_WEBTOON_REGISTERED_INFO = 'Naver webtoon registered info'
    NAVER_WEBTOON_ACCESS_SETTING = 'Naver webtoon access setting'
    NAVER_WEBTOON_ANALYZE = 'Naver webtoon analyze'
    NAVER_WEBTOON_ANALYZE_REQUEST_GET = 'Naver webtoon analyze request get'
    NAVER_WEBTOON_ANALYZE_REQUEST_LIST = 'Naver webtoon analyze request list'
    ELASTICSEARCH_CLEAR_ALL_ITEM = 'Elasticsearch clear all item'
    ANALYZER_MODEL_TEST = 'Analyzer model test'
    EXIT = "Exit program"


def get_root_question():
    choices = []
    for menu in RootMenuList:
        if not menu == RootMenuList.EXIT:
            choices.append(menu.value)

    choices.sort()

    choices.append(RootMenuList.EXIT.value)

    questions = [
        {
            'type': 'list',
            'message': 'Please select an action to proceed.',
            'name': 'Root menu',
            'choices': choices
        }
    ]

    return questions


def parse_root_question(answers):
    for menu in RootMenuList:
        if answers == menu.value:
            return menu

    raise ValueError("Invalid root menu value.")
