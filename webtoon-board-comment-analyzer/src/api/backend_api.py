import requests


def get_backend_api_headers(config):
    headers = {
        'Accept': 'application/json',
        'Authorization': f'{config.BACKEND_API_SERVER_ACCESS_KEY}'
    }

    return headers


def is_backend_api_server_alive(config):
    try:
        with requests.get(
                f'{config.BACKEND_API_SERVER_URL}',
                headers=get_backend_api_headers(config)
        ) as response:
            if response.status_code == 200:
                return True
            else:
                return False
    except Exception as ex:
        print(ex)
        return False
