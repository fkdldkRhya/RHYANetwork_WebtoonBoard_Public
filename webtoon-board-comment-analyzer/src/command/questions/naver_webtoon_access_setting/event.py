from typing import Final

import pandas as pd
import requests
from PyInquirer import prompt
from prompt_toolkit.validation import Validator, ValidationError
from tabulate import tabulate

from src import logger
from src.api.backend_api import get_backend_api_headers
from src.command import style

log_manager = logger.LogManager(__name__)


def event(config_data):
    Enable: Final = 'Enable'
    Disable: Final = 'Disable'
    EXIT: Final = 'Exit'

    questions_webtoon_id = [
        {
            'type': 'input',
            'message': 'Please enter webtoon id:',
            'name': 'Sub menu',
            'validate': InputWebtoonIdValueValidator
        }
    ]

    questions_access_setting = [
        {
            'type': 'list',
            'message': 'Please select the following action.',
            'name': 'Sub menu',
            'choices': [
                Enable,
                Disable,
                EXIT
            ]
        }
    ]

    answers_webtoon_id = int(list(prompt(questions_webtoon_id, style=style.get_default_style()).values())[0])

    with requests.get(
            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/info?webtoonId={answers_webtoon_id}',
            headers=get_backend_api_headers(config_data)
    ) as response:
        json = response.json()
        json = json["data"]

        title_id = json["titleId"]
        title_name = json["titleName"]

    with requests.get(
            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/get-db?webtoonId={answers_webtoon_id}',
            headers=get_backend_api_headers(config_data)
    ) as response:
        json = response.json()
        json = json["data"]

        now_is_access = json["isAccess"]

    webtoon_info_dict = [
        ['Title ID', title_id],
        ['Title Name', title_name],
        ['Current Access Setting', 'Enable' if now_is_access == 0 else 'Disable']
    ]

    if now_is_access == EXIT:
        return

    print(tabulate(pd.DataFrame(webtoon_info_dict), tablefmt='mixed_grid', showindex=False))

    select_item = str(list(prompt(questions_access_setting, style=style.get_default_style()).values())[0])

    send_data = {
        'webtoonId': answers_webtoon_id,
        'webtoonInfo': {
            'isAccess': 0 if select_item == Enable else 1
        }
    }

    with requests.post(
            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/edit',
            headers=get_backend_api_headers(config_data),
            json=send_data
    ) as response:
        json = response.json()

        if json["result"] == "SUCCESS":
            log_manager.get_logger().info("Success to edit webtoon access setting.")
        else:
            log_manager.get_logger().error(f"Failed to edit webtoon access setting. ({json})")


class InputWebtoonIdValueValidator(Validator):
    def validate(self, input_text):
        if len(input_text.text) == 0 \
                or input_text.text.isspace()\
                or not input_text.text.isdigit():
            raise ValidationError(
                message='Error! Please enter it again.',
                cursor_position=len(input_text.text))
