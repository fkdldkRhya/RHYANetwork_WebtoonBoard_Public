import pandas as pd
import requests
from PyInquirer import prompt
from prompt_toolkit.validation import Validator, ValidationError
from tabulate import tabulate

from src.api.backend_api import get_backend_api_headers
from src.command import style


def event(config_data):
    questions_webtoon_id = [
        {
            'type': 'input',
            'message': 'Please enter webtoon id:',
            'name': 'Sub menu',
            'validate': InputWebtoonIdValueValidator
        }
    ]

    answers_webtoon_id = int(list(prompt(questions_webtoon_id, style=style.get_default_style()).values())[0])

    with requests.get(
            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/get-db?webtoonId={answers_webtoon_id}',
            headers=get_backend_api_headers(config_data)
    ) as response:
        json = response.json()
        json = json["data"]

        webtoon_id = json["webtoonId"]

        with requests.get(
                f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/info?webtoonId={webtoon_id}',
                headers=get_backend_api_headers(config_data)
        ) as response_sub:
            webtoon_name = response_sub.json()["data"]["titleName"]

        webtoon_provider = json["provider"]
        article_start = json["articleStart"]
        article_end = json["articleEnd"]
        comment_type = json["commentTarget"]
        comment_max_check_type = json["maxType"]
        comment_max_check_size = json["maxSize"]
        is_access = int(json["isAccess"])

    webtoon_info_dict = [
        ['Title ID', webtoon_id],
        ['Title Name', webtoon_name],
        ['Provider', webtoon_provider],
        ['Article Start', article_start],
        ['Article End', article_end],
        ['Comment Type', comment_type],
        ['Comment Max Check Type', comment_max_check_type],
        ['Comment Max Check Size', comment_max_check_size],
        ['Current Access Setting', 'Enable' if is_access == 0 else 'Disable']
    ]

    print(tabulate(pd.DataFrame(webtoon_info_dict), tablefmt='mixed_grid', showindex=False))


class InputWebtoonIdValueValidator(Validator):
    def validate(self, input_text):
        if len(input_text.text) == 0 \
                or input_text.text.isspace()\
                or not input_text.text.isdigit():
            raise ValidationError(
                message='Error! Please enter it again.',
                cursor_position=len(input_text.text))
