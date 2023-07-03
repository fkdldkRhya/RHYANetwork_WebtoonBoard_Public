import os
import shutil

import wbm_src.util.project_path


def remove():
    if os.path.exists(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH) \
            and os.path.isdir(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH):
        shutil.rmtree(wbm_src.util.project_path.WEBTOON_BOARD_MANAGEMENT_RES_PATH)