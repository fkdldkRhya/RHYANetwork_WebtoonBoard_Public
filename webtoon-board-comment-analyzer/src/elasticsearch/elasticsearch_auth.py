from elasticsearch import Elasticsearch


def get_elasticsearch_client(config_data) -> Elasticsearch:
    esc = Elasticsearch(f'{config_data.ELASTICSEARCH_SCHEME}://'
                        f'{config_data.ELASTICSEARCH_HOST}:'
                        f'{config_data.ELASTICSEARCH_PORT}',
                        basic_auth=(
                            str(config_data.ELASTICSEARCH_USERNAME),
                            str(config_data.ELASTICSEARCH_PASSWORD)
                        ))
    return esc
