import yaml

from .config_data import ConfigData


def load(target):
    with open(target, encoding='UTF-8') as f:
        _cfg = yaml.load(f, Loader=yaml.FullLoader)

    ROOT = _cfg['webtoon_board_comment_analyzer']

    ELASTICSEARCH_CONFIG_ROOT = ROOT['elasticsearch_credentials']
    DATABASE_CONFIG_ROOT = ROOT['mariadb_credentials']
    GITHUB_CONFIG_ROOT = ROOT['github_credentials']
    BACKEND_SERVER_CONFIG_ROOT = ROOT['backend_api_server_credentials']
    KERAS_MODEL_CONFIG_ROOT = ROOT['ksa_keras_model']
    EXIT_MESSAGE_CONFIG_ROOT = ROOT['exit_message']

    config = ConfigData()

    config.DATABASE_HOST = DATABASE_CONFIG_ROOT['host']
    config.DATABASE_PORT = DATABASE_CONFIG_ROOT['port']
    config.DATABASE_NAME = DATABASE_CONFIG_ROOT['database']
    config.DATABASE_USERNAME = DATABASE_CONFIG_ROOT['username']
    config.DATABASE_PASSWORD = DATABASE_CONFIG_ROOT['password']

    config.ELASTICSEARCH_SCHEME = ELASTICSEARCH_CONFIG_ROOT['scheme']
    config.ELASTICSEARCH_HOST = ELASTICSEARCH_CONFIG_ROOT['host']
    config.ELASTICSEARCH_PORT = ELASTICSEARCH_CONFIG_ROOT['port']
    config.ELASTICSEARCH_USERNAME = ELASTICSEARCH_CONFIG_ROOT['username']
    config.ELASTICSEARCH_PASSWORD = ELASTICSEARCH_CONFIG_ROOT['password']

    config.GITHUB_TOKEN = GITHUB_CONFIG_ROOT['token']

    config.BACKEND_API_SERVER_URL = BACKEND_SERVER_CONFIG_ROOT['url']
    config.BACKEND_API_SERVER_ACCESS_KEY = BACKEND_SERVER_CONFIG_ROOT['access_key']

    config.KERAS_MODEL_PATH = KERAS_MODEL_CONFIG_ROOT['target']

    config.EXIT_MESSAGE_LIST = list(EXIT_MESSAGE_CONFIG_ROOT)

    return config
