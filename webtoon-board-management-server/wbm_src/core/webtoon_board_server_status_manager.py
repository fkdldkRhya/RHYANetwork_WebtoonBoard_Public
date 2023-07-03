import subprocess
import requests

from multiprocessing import Process

import wbm_src.util.wb_server_info
import wbm_src.util.auth.auth_info
import wbm_src.util.my_logger
import wbm_src.util.project_path


def run_front_end_server():
    subprocess.run(
        f'cd "{wbm_src.util.project_path.WEBTOON_BOARD_FRONTEND_PATH}" && yarn build && yarn start',
        shell=True,
        capture_output=False)


def run_back_end_server():
    subprocess.run(
        f'cd "{wbm_src.util.project_path.WEBTOON_BOARD_BACKEND_PATH}" && yarn build && yarn start',
        shell=True,
        capture_output=False)


class ServerStatusManager:
    my_logger = wbm_src.util.my_logger.MyLogger(__name__).get_logger()

    front_end_server_thread: Process = None
    back_end_server_thread: Process = None

    def stop_front_end_server(self):
        try:
            wbm_src.util.my_logger.MyLogger(__name__).get_logger().info("Stopping front-end server...")

            requests.get(wbm_src.util.wb_server_info.WEBTOON_BOARD_FRONTEND_STOP_URL, headers={
                "Authorization": wbm_src.util.auth.auth_info.SERVER_STOP_KEY
            })

            if self.front_end_server_thread is not None:
                self.front_end_server_thread.terminate()
                self.front_end_server_thread.kill()
                self.front_end_server_thread.close()
        except Exception as ex:
            wbm_src.util.my_logger.MyLogger(__name__).get_logger().error(ex)

    def start_front_end_server(self):
        self.my_logger.info("Starting front-end server...")
        self.front_end_server_thread = Process(target=run_front_end_server)

        self.front_end_server_thread.start()

    def stop_back_end_server(self):
        try:
            wbm_src.util.my_logger.MyLogger(__name__).get_logger().info("Stopping back-end server...")

            requests.get(wbm_src.util.wb_server_info.WEBTOON_BOARD_BACKEND_STOP_URL, headers={
                "Authorization": wbm_src.util.auth.auth_info.SERVER_STOP_KEY
            })

            if self.back_end_server_thread is not None:
                self.back_end_server_thread.terminate()
                self.back_end_server_thread.kill()
                self.back_end_server_thread.close()
        except Exception as ex:
            wbm_src.util.my_logger.MyLogger(__name__).get_logger().error(ex)

    def start_back_end_server(self):
        self.my_logger.info("Starting back-end server...")
        self.back_end_server_thread = Process(target=run_back_end_server)

        self.back_end_server_thread.start()
