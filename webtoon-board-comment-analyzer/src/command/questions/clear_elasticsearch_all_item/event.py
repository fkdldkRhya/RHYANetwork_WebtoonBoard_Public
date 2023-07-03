import pymysql

from src import logger
from src.elasticsearch import get_elasticsearch_client, elasticsearch_info

log_manager = logger.LogManager(__name__)


def event(config_data):
    with pymysql.connect(
            user=config_data.DATABASE_USERNAME,
            passwd=config_data.DATABASE_PASSWORD,
            host=config_data.DATABASE_HOST,
            port=config_data.DATABASE_PORT,
            db=config_data.DATABASE_NAME,
            charset='utf8') as conn:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM webtoon_info;")
            conn.commit()

    with get_elasticsearch_client(config_data) as es_client:
        es_client.delete_by_query(
            index=elasticsearch_info.ElasticsearchIndexName.NAVER_WEBTOON_COMMENT.value,
            query={
                "match_all": {}
            }
        )

        log_manager.get_logger().info("All delete webtoon comment info success!")
