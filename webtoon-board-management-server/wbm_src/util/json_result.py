import json
from collections import OrderedDict


def get_json_result(result, state, message, data):
    result_json = OrderedDict()

    result_json["result"] = result
    result_json["state"] = state
    result_json["message"] = message
    result_json["data"] = data

    return json.dumps(result_json, ensure_ascii=False, indent='\t')
