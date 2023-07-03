import pandas as pd
from PyInquirer import prompt
from prompt_toolkit.validation import Validator, ValidationError
from tabulate import tabulate

from src import logger
from src.analyzer.analyzer_core import analyze
from src.command import style

log_manager = logger.LogManager(__name__)


def event(config_data):
    questions_text = [
        {
            'type': 'input',
            'message': 'Please enter what you want to analyze:',
            'name': 'Sub menu',
            'validate': InputTextValueValidator
        }
    ]

    answers_text = str(list(prompt(questions_text, style=style.get_default_style()).values())[0])

    if answers_text.isdigit() or answers_text.isspace():
        log_manager.get_logger().warn(f'Data \'{answers_text}\' may have inaccurate analysis results.')

    log_manager.get_logger().info("Start analyzing...")
    model_result = analyze(config_data.MODEL, answers_text)
    log_manager.get_logger().info("Analysis completed.")

    anaylzer_info = [
        ['Value Description (MAX)', 'Positive'],
        ['Value Description (MIN)', 'Negative'],
        ['Analysis Results (Float)', str(model_result.value)],
        ['Analysis Results (Text)', str(model_result.value_type.value)],
    ]

    print(tabulate(pd.DataFrame(anaylzer_info), tablefmt='mixed_grid', showindex=False))


class InputTextValueValidator(Validator):
    def validate(self, input_text):
        if len(input_text.text) == 0 \
                or input_text.text.isspace():
            raise ValidationError(
                message='Error! Please enter it again.',
                cursor_position=len(input_text.text))
