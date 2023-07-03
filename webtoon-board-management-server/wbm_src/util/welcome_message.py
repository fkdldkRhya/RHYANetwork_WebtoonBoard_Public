from pyfiglet import Figlet

import os

import wbm_src.util.remove_resource_folder
import wbm_src.util.project_path
import wbm_src.util.wb_server_info
import wbm_src.util.auth.auth_info


def show_message(my_logger):
    f = Figlet(font='slant')
    print(f.renderText('RHYA_Network'))

    my_logger.debug("Server starting...")
    my_logger.debug(f"[Database] Auth-Info <ID>          : {wbm_src.util.auth.auth_info.DATABASE_ID}")
    my_logger.debug(f"[Database] Auth-Info <PASSWORD>    : {wbm_src.util.auth.auth_info.DATABASE_PASSWORD}")
    my_logger.debug(f"[Database] Auth-Info <HOST>        : {wbm_src.util.auth.auth_info.DATABASE_HOST}:{wbm_src.util.auth.auth_info.DATABASE_PORT}")
    my_logger.debug(f"[Database] Auth-Info <NAME>        : {wbm_src.util.auth.auth_info.DATABASE_NAME}")
    my_logger.debug(f"[Github  ] Github token            : {wbm_src.util.auth.auth_info.GITHUB_TOKEN}")
    my_logger.debug(f"[WBF-Serv] Directory path          : {wbm_src.util.project_path.WEBTOON_BOARD_FRONTEND_PATH}")
    my_logger.debug(f"[WBB-Serv] Stop url                : {wbm_src.util.wb_server_info.WEBTOON_BOARD_FRONTEND_STOP_URL}")
    my_logger.debug(f"[WBB-Serv] Directory path          : {wbm_src.util.project_path.WEBTOON_BOARD_BACKEND_PATH}")
    my_logger.debug(f"[WBB-Serv] Stop url                : {wbm_src.util.wb_server_info.WEBTOON_BOARD_BACKEND_STOP_URL}")
    my_logger.debug(f"[WB      ] Server stop key         : {wbm_src.util.auth.auth_info.SERVER_STOP_KEY}")
    my_logger.debug(
        f"[WBM-Res ] Directory path          : {wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH}")

    my_logger.debug(f"Empty WEM resource directory contents...")
    wbm_src.util.remove_resource_folder.remove()

    my_logger.debug(f"Checking directory...")

    if not os.path.exists(wbm_src.util.project_path.WEBTOON_BOARD_FRONTEND_PATH) \
            or not os.path.isdir(wbm_src.util.project_path.WEBTOON_BOARD_FRONTEND_PATH):
        my_logger.debug(f"Create directory: {wbm_src.util.project_path.WEBTOON_BOARD_FRONTEND_PATH}")
        os.makedirs(wbm_src.util.project_path.WEBTOON_BOARD_FRONTEND_PATH)

    if not os.path.exists(wbm_src.util.project_path.WEBTOON_BOARD_BACKEND_PATH) \
            or not os.path.isdir(wbm_src.util.project_path.WEBTOON_BOARD_BACKEND_PATH):
        my_logger.debug(f"Create directory: {wbm_src.util.project_path.WEBTOON_BOARD_BACKEND_PATH}")
        os.makedirs(wbm_src.util.project_path.WEBTOON_BOARD_BACKEND_PATH)

    if not os.path.exists(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH) \
            or not os.path.isdir(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH):
        my_logger.debug(f"Create directory: {wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH}")
        os.makedirs(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH)
