from __future__ import print_function, unicode_literals

import pandas as pd
from PyInquirer import prompt

from src.command import style
from src.api.backend_api import get_backend_api_headers

from prompt_toolkit.validation import Validator, ValidationError

from tabulate import tabulate

import requests


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
        thumbnail_badge_list = list(json["thumbnailBadgeList"])
        age_type = json["age"]["type"]
        age_description = json["age"]["description"]
        finished = bool(json["finished"])
        rest = bool(json["rest"])
        publish_description = json["publishDescription"]
        favorite_count = int(json["favoriteCount"])
        publish_day_of_week_list = list(json["publishDayOfWeekList"])
        curation_tag_list_tag_name = []

        for author_writer_obj in json["author"]["writers"]:
            author_writer.append(author_writer_obj["name"])

        for author_painters_obj in json["author"]["painters"]:
            author_painters.append(author_painters_obj["name"])

        for author_origin_authors_obj in json["author"]["originAuthors"]:
            author_origin_authors.append(author_origin_authors_obj["name"])

        for curation_tag_list_tag_name_obj in json["curationTagList"]:
            curation_tag_list_tag_name.append(curation_tag_list_tag_name_obj["tagName"])

        webtoon_default_info_dict = [
            ['Title ID', title_id],
            ['Title Name', title_name],
            ['Author Writer', '\n'.join(author_writer)],
            ['Author Painters', '\n'.join(author_painters)],
            ['Author Origin Authors', '\n'.join(author_origin_authors)],
            ['Thumbnail Badge List', '\n'.join(thumbnail_badge_list)],
            ['Age Type', age_type],
            ['Age Description', age_description],
            ['Finished', finished],
            ['Rest', rest],
            ['Publish Description', publish_description],
            ['Favorite Count', favorite_count],
            ['Publish Day of Week List', '\n'.join(publish_day_of_week_list)],
            ['Curation Tag List Tag Name', '\n'.join(curation_tag_list_tag_name)]
        ]

        print(tabulate(pd.DataFrame(webtoon_default_info_dict), tablefmt='mixed_grid', showindex=False))


class InputWebtoonIdValueValidator(Validator):
    def validate(self, input_text):
        if len(input_text.text) == 0 \
                or input_text.text.isspace()\
                or not input_text.text.isdigit():
            raise ValidationError(
                message='Error! Please enter it again.',
                cursor_position=len(input_text.text))
