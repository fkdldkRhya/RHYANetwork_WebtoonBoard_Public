import wbm_src.util.auth.auth_info

import pymysql


def get_database_connection():
    return pymysql.connect(
        host=wbm_src.util.auth.auth_info.DATABASE_HOST,
        port=wbm_src.util.auth.auth_info.DATABASE_PORT,
        user=wbm_src.util.auth.auth_info.DATABASE_ID,
        password=wbm_src.util.auth.auth_info.DATABASE_PASSWORD,
        database=wbm_src.util.auth.auth_info.DATABASE_NAME,
        charset='utf8'
    )
