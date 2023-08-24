#
# RHYA.Network webtoon board project - Webtoon comment analyzer
#
# Author: RHYA.Network (CHOI SIHUN / sihun.choi@email.rhya-network.kro.kr)
# Copyright (c) 2023 RHYA.Network. All rights reserved.
#
import os
import sys

import tensorflow as tf

from time import sleep

from src.elasticsearch.elasticsearch_auth import get_elasticsearch_client
from src.api import backend_api
from src import logger, model, config, welcome_message, command

log_manager = logger.LogManager(__name__)


def main():
    # Disable tensorflow logging
    tf.keras.utils.disable_interactive_logging()

    # Console clear
    print('\n' * 150)

    # Show welcome message
    welcome_message.show_welcome_message()

    # Check windows operating system
    if os.name != 'nt':
        log_manager.get_logger().error(
            "This program is only supported on Windows operating systems."
        )
        sys.exit(1)

    # Check python version
    if sys.version_info == (3, 9):
        log_manager.get_logger().warn(
            "The program was produced and tested in Python 3.9."
            " If you use a different version, it may not work properly."
        )

    # Check java installation
    java_home = os.environ.get('JAVA_HOME')
    if java_home is None:
        log_manager.get_logger().error(
            "Please set \'JAVA_HOME\' environment variable."
        )
        sys.exit(1)
    jvm_dll_path = os.path.join(java_home, 'server', 'jvm.dll')
    if java_home.isspace() or not os.path.exists(jvm_dll_path):
        log_manager.get_logger().error(
            f"Not found {jvm_dll_path} file. Please install Java 8 or higher."
        )
        sys.exit(1)

    # Load config
    log_manager.get_logger().info("Loading analyzer config...")
    config_data = config.load(target="config.yaml")
    log_manager.get_logger().info("Config loaded successfully.")

    # Check backend api server connection
    log_manager.get_logger().info("Checking backend api server connection...")
    if not backend_api.is_backend_api_server_alive(config_data):
        log_manager.get_logger().error("Backend api server is not alive.")
        sys.exit(1)

    # Check elasticsearch connection
    with get_elasticsearch_client(config_data) as es_client:
        log_manager.get_logger().info("Checking elasticsearch connection...")
        if not es_client.ping():
            log_manager.get_logger().error("Elasticsearch is not alive.")
            sys.exit(1)

    # Load model
    log_manager.get_logger().info(f"RNN Model path: {config_data.KERAS_MODEL_PATH}")
    log_manager.get_logger().info("Loading analyzer model...")
    if not (os.path.exists(config_data.KERAS_MODEL_PATH) and os.path.isdir(config_data.KERAS_MODEL_PATH)):
        log_manager.get_logger().error("The model does not exist. Please download the model first.")
        sys.exit(1)
    model_data = model.load_model(config_data.KERAS_MODEL_PATH)
    config_data.MODEL = model_data
    log_manager.get_logger().info("Model loaded successfully.")

    # 1.5 seconds delay
    sleep(1.5)

    # Start command loop
    while True:
        command.repl(config_data)
        print()


if __name__ == '__main__':
    main()
