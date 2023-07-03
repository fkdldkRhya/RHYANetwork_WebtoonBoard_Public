from __future__ import print_function, unicode_literals

import pandas as pd
from PyInquirer import prompt

from src.command import style
from src.api.backend_api import get_backend_api_headers

from prompt_toolkit.validation import Validator, ValidationError

from tabulate import tabulate

import requests


def event(config_data):
    questions_keyword = [
        {
            'type': 'input',
            'message': 'Please enter a search term:',
            'name': 'naver_webtoon_search_keyword',
            'validate': InputKeywordValueValidator
        }
    ]

    questions_page = [
        {
            'type': 'input',
            'message': 'Please enter the page:',
            'name': 'naver_webtoon_search_keyword',
            'validate': InputPageIndexValueValidator,
        }
    ]

    answers_keyword = list(prompt(questions_keyword, style=style.get_default_style()).values())[0]
    answers_page = int(list(prompt(questions_page, style=style.get_default_style()).values())[0])

    with requests.get(
            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/search?keyword={answers_keyword}&page={answers_page}',
            headers=get_backend_api_headers(config_data)
    ) as response:
        json = response.json()

        title_id = []
        title_name = []
        display_author = []

        max_page = json["data"]["pageInfo"]["totalPages"]

        total_count = json["data"]["pageInfo"]["totalRows"]

        for json_obj in json["data"]["searchList"]:
            if json_obj["titleId"] is not None \
                    and json_obj["titleName"] is not None \
                    and json_obj["displayAuthor"] is not None:
                title_id.append(json_obj["titleId"])
                title_name.append(json_obj["titleName"])
                display_author.append(json_obj["displayAuthor"])

        webtoon_dict = {
            'Title ID': title_id,
            'Title name': title_name,
            'Display author': display_author,
        }

        page_dict = {
            'Current page': [answers_page],
            'Max page': [max_page],
            'Total count': [total_count]
        }

        print(tabulate(pd.DataFrame(webtoon_dict), headers='keys', tablefmt='mixed_grid', showindex=True))
        print(tabulate(pd.DataFrame(page_dict), headers='keys', tablefmt='mixed_grid', showindex=False))


class InputKeywordValueValidator(Validator):
    def validate(self, input_text):
        if len(input_text.text) == 0 or input_text.text.isspace():
            raise ValidationError(
                message='Error! Please enter it again.',
                cursor_position=len(input_text.text))


class InputPageIndexValueValidator(Validator):
    def validate(self, input_text):
        if len(input_text.text) == 0 \
                or input_text.text.isspace()\
                or not input_text.text.isdigit():
            raise ValidationError(
                message='Error! Please enter it again.',
                cursor_position=len(input_text.text))
