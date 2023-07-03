import wbm_src.util.database_connection


def checker(input_key):
    is_success = False

    conn = wbm_src.util.database_connection.get_database_connection()
    with conn:
        with conn.cursor() as cur:
            cur.execute("SELECT (management_server_api_key) FROM service_config")
            result = cur.fetchall()

            for data in result:
                if input_key == data[0]:
                    is_success = True
                    break

    return is_success
