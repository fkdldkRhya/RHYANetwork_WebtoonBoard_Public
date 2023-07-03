import time

from http import HTTPStatus

import wbm_src.core.webtoon_board_cl_cd_task
import wbm_src.util.remove_resource_folder
import wbm_src.core.webtoon_board_server_status_manager
import wbm_src.util.my_logger
import wbm_src.util.json_result
import wbm_src.core.webtoon_board_repo_downloader
import wbm_src.util.auth.auth_info
import wbm_src.util.auth.access_key_checker
import wbm_src.util.zip_decompress
import wbm_src.util.project_path
import wbm_src.util.welcome_message

# Flask import
from flask import Flask, request

# Git pull master repo task is running check variable
is_git_pull_master_repo_task_running = False
# Variable init
server_status_manager = wbm_src.core.webtoon_board_server_status_manager.ServerStatusManager()
my_logger = wbm_src.util.my_logger.MyLogger(__name__).get_logger()
app = Flask(__name__)


# Show welcome message
wbm_src.util.welcome_message.show_message(my_logger)


# Default start server
my_logger.info("Stopping front-end and back-end server...")
server_status_manager.stop_front_end_server()
server_status_manager.stop_back_end_server()
my_logger.info("Waiting for 15 seconds...")
time.sleep(15)
my_logger.info("Starting front-end and back-end server...")
server_status_manager.start_front_end_server()
server_status_manager.start_back_end_server()


# Check access key
@app.before_request
def before_request():
    token = request.headers.get("Authorization")

    if token is None or not wbm_src.util.auth.access_key_checker.checker(token):
        return wbm_src.util.json_result.get_json_result(
            False,
            HTTPStatus.UNAUTHORIZED.value,
            "The access key in the Authorization header is missing or invalid.",
            None
        )


# Git pull master repo
@app.route('/git_pull_request', methods=["GET"])
def git_master_source_pull():
    global is_git_pull_master_repo_task_running

    try:
        if is_git_pull_master_repo_task_running:
            return wbm_src.util.json_result.get_json_result(
                False,
                HTTPStatus.SERVICE_UNAVAILABLE.value,
                "The git pull master repo task is already running.",
                None
            )

        is_git_pull_master_repo_task_running = True

        if wbm_src.core.webtoon_board_cl_cd_task.cl_cd_task(server_status_manager):
            is_git_pull_master_repo_task_running = False

            return wbm_src.util.json_result.get_json_result(
                True,
                HTTPStatus.OK.value,
                "The git pull master repo task is complete.",
                None
            )
    except Exception as ex:
        my_logger.error(ex)

        is_git_pull_master_repo_task_running = False

        return wbm_src.util.json_result.get_json_result(
            False,
            HTTPStatus.INTERNAL_SERVER_ERROR.value,
            "An error occurred while pulling the master repo.",
            None
        )

    is_git_pull_master_repo_task_running = False

    return wbm_src.util.json_result.get_json_result(
        False,
        HTTPStatus.INTERNAL_SERVER_ERROR,
        "Unknown error occurred.",
        None
    )


@app.route('/all_start', methods=["GET"])
def all_start():
    server_status_manager.start_front_end_server()
    server_status_manager.start_back_end_server()

    return wbm_src.util.json_result.get_json_result(
        True,
        HTTPStatus.OK.value,
        None,
        None
    )


@app.route('/all_stop', methods=["GET"])
def all_stop():
    server_status_manager.stop_back_end_server()
    server_status_manager.stop_front_end_server()

    return wbm_src.util.json_result.get_json_result(
        True,
        HTTPStatus.OK.value,
        None,
        None
    )


@app.route('/front_start', methods=["GET"])
def front_start():
    server_status_manager.start_front_end_server()

    return wbm_src.util.json_result.get_json_result(
        True,
        HTTPStatus.OK.value,
        None,
        None
    )


@app.route('/back_start', methods=["GET"])
def back_start():
    server_status_manager.start_back_end_server()

    return wbm_src.util.json_result.get_json_result(
        True,
        HTTPStatus.OK.value,
        None,
        None
    )


@app.route('/front_stop', methods=["GET"])
def front_stop():
    server_status_manager.stop_front_end_server()

    return wbm_src.util.json_result.get_json_result(
        True,
        HTTPStatus.OK.value,
        None,
        None
    )


@app.route('/back_stop', methods=["GET"])
def back_stop():
    server_status_manager.stop_back_end_server()

    return wbm_src.util.json_result.get_json_result(
        True,
        HTTPStatus.OK.value,
        None,
        None
    )


# Start server
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
