class ConfigData:
    # Elasticsearch config
    ELASTICSEARCH_SCHEME = None
    ELASTICSEARCH_HOST = None
    ELASTICSEARCH_PORT = None
    ELASTICSEARCH_USERNAME = None
    ELASTICSEARCH_PASSWORD = None

    # Database config
    DATABASE_HOST = None
    DATABASE_PORT = None
    DATABASE_USERNAME = None
    DATABASE_PASSWORD = None
    DATABASE_NAME = None

    # Github config
    GITHUB_TOKEN = None

    # BACKEND api server config
    BACKEND_API_SERVER_URL = None
    BACKEND_API_SERVER_ACCESS_KEY = None

    # Keras model path
    KERAS_MODEL_PATH = None

    # Exit message list
    EXIT_MESSAGE_LIST = None

    #
    # =============================
    # Loaded RNN model
    # =============================
    #
    MODEL = None
