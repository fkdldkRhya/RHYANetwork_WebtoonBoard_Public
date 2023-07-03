from enum import Enum

from konlpy.tag import Okt


class AnalyzeResult(Enum):
    POSITIVE = 'Positive'
    NEGATIVE = 'Negative'


def analyze(model, text):
    if len(text) < 10:
        okt = Okt()

        all_sum = 0.0

        k_word_result_list = model.predict(okt.morphs(text))

        for f_result in k_word_result_list:
            f_result = f_result * 100

            all_sum += f_result

        full_word_result = model.predict([text])
        full_word_result = full_word_result * 100

        all_sum = all_sum + full_word_result * 5

        result_avg = all_sum / (len(k_word_result_list) + 5)

        result = AnalyticsResult(result_avg,
                                 AnalyzeResult.POSITIVE if result_avg > 50.0 else AnalyzeResult.NEGATIVE)

        return result
    else:
        full_word_result = model.predict([text])
        full_word_result = full_word_result * 100

        result = AnalyticsResult(full_word_result,
                                 AnalyzeResult.POSITIVE if full_word_result > 50.0 else AnalyzeResult.NEGATIVE)

        return result


class AnalyticsResult:
    value: list = None
    value_type: AnalyzeResult = None

    def __init__(self, value, value_type):
        self.value = value
        self.value_type = value_type

    def get_float(self):
        return self.value

    def get_type(self):
        return self.value_type
