import logging

from colorlog import ColoredFormatter


class MyLogger:
    def __init__(self, logger_name):
        name = logger_name

        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)

        formatter = ColoredFormatter(
            "%(log_color)s[%(asctime)s  %(levelname)s] %(message)s",
            datefmt=None,
            reset=True,
            log_colors={
                'DEBUG': 'cyan',
                'INFO': 'white,bold',
                'INFOV': 'cyan,bold',
                'WARNING': 'yellow',
                'ERROR': 'red,bold',
                'CRITICAL': 'red,bg_white',
            },
            secondary_log_colors={},
            style='%'
        )
        ch.setFormatter(formatter)

        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.DEBUG)
        self.logger.handlers = []  # No duplicated handlers
        self.logger.propagate = False  # workaround for duplicated logs in ipython
        self.logger.addHandler(ch)

    logger: logging.Logger = None

    def get_logger(self):
        return self.logger
