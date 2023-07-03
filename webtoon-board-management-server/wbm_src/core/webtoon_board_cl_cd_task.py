import os
import os
import shutil
import subprocess

import wbm_src.core.webtoon_board_server_status_manager
import wbm_src.util.my_logger
import wbm_src.core.webtoon_board_repo_downloader
import wbm_src.util.zip_decompress
import wbm_src.util.project_path

my_logger = wbm_src.util.my_logger.MyLogger(__name__).get_logger()


def cl_cd_task(server_status_manager):
    wbf_copy_target_folder = os.path.join("webtoon-board-frontend-server")
    wbb_copy_target_folder = os.path.join("webtoon-board-backend-server")

    zip_file_name = "webtoon_board_master.zip"
    zip_file_path = os.path.join(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH, zip_file_name)

    wbm_src.util.remove_resource_folder.remove()

    if not os.path.exists(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH) \
            or not os.path.isdir(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH):
        my_logger.debug(f"Create directory: {wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH}")
        os.makedirs(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH)

    wbm_src.core.webtoon_board_repo_downloader.download_webtoon_board_repo(
        os.path.join(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH, zip_file_name),
        wbm_src.util.auth.auth_info.GITHUB_TOKEN
    )

    wbm_src.util.zip_decompress.unzipping(zip_file_path,
                                          wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH)

    for name in os.listdir(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH):
        if name.__contains__("fkdldkRhya-RHYANetwork_WebtoonBoard") \
                and os.path.isdir(os.path.join(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH, name)):
            root_path = os.path.join(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH, name)
            wbf_copy_target_folder_path = os.path.join(root_path, wbf_copy_target_folder)
            wbb_copy_target_folder_path = os.path.join(root_path, wbb_copy_target_folder)

            server_status_manager.stop_front_end_server()
            server_status_manager.stop_back_end_server()

            shutil.rmtree(wbm_src.util.project_path.WEBTOON_BOARD_FRONTEND_PATH)
            shutil.copytree(wbf_copy_target_folder_path, wbm_src.util.project_path.WEBTOON_BOARD_FRONTEND_PATH)

            shutil.rmtree(wbm_src.util.project_path.WEBTOON_BOARD_BACKEND_PATH)
            shutil.copytree(wbb_copy_target_folder_path, wbm_src.util.project_path.WEBTOON_BOARD_BACKEND_PATH)

            text_file_path = os.path.join(wbm_src.util.project_path.WEBTOON_BOARD_FRONTEND_PATH, ".env")
            new_text_content = []
            with open(text_file_path, 'r', encoding="UTF-8") as f:
                lines = f.readlines()
                for i, l in enumerate(lines):
                    line = l
                    if line.__contains__("NEXT_PUBLIC_WBF_USE_BACK_ADDRESS="):
                        line = 'NEXT_PUBLIC_WBF_USE_BACK_ADDRESS="public"\n'

                    new_text_content.append(line)

            with open(text_file_path, 'w', encoding="UTF-8") as f:
                f.write(''.join(new_text_content))

            subprocess.run(f'cd "{wbm_src.util.project_path.WEBTOON_BOARD_FRONTEND_PATH}" && yarn', shell=True)
            subprocess.run(f'cd "{wbm_src.util.project_path.WEBTOON_BOARD_BACKEND_PATH}" && yarn', shell=True)

            server_status_manager.start_front_end_server()
            server_status_manager.start_back_end_server()

            return True
    return False
