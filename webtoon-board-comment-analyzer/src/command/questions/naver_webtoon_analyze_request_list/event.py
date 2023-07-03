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
    with requests.get(
            f'{config_data.BACKEND_API_SERVER_URL}/naver-webtoon/anlayze-request-get-all',
            headers=get_backend_api_headers(config_data)
    ) as response:
        json = response.json()
        json = json["data"]

        requestUserId = []
        webtoonId = []
        provider = []
        articleStart = []
        articleEnd = []
        commentTarget = []
        maxType = []
        maxSize = []

        for json_obj in list(json):
            requestUserId.append(json_obj["requestUserId"])
            webtoonId.append(json_obj["webtoonId"])
            provider.append(json_obj["provider"])
            articleStart.append(json_obj["articleStart"])
            articleEnd.append(json_obj["articleEnd"])
            commentTarget.append(json_obj["commentTarget"])
            maxType.append(json_obj["maxType"])
            maxSize.append(json_obj["maxSize"])

        request_dict = {
            'Request User ID': requestUserId,
            'Webtoon ID': webtoonId,
            'Provider': provider,
            'Article Start': articleStart,
            'Article End': articleEnd,
            'Comment Target': commentTarget,
            'Max Type': maxType,
            'Max Size': maxSize
        }

        print(tabulate(pd.DataFrame(request_dict), headers='keys', tablefmt='mixed_grid', showindex=True))
