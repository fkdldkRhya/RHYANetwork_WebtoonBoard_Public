import src.analyzer.analyzer_core as analyzer_core


class AnalyzeResult:
    comment_id: int = None
    analyzer_result: analyzer_core.AnalyticsResult = None
    profile_user_id: str = None
    masked_user_id: str = None
    masked_user_name: str = None
    user_name: str = None
    reg_time: str = None
    article_index: int = None
    best: bool = False
    content: str = None

    def __init__(self,
                 comment_id: int,
                 analyzer_result: analyzer_core.AnalyticsResult,
                 profile_user_id: str,
                 masked_user_id: str,
                 masked_user_name: str,
                 user_name: str,
                 reg_time: str,
                 article_index: int,
                 best: bool,
                 content: str):
        self.comment_id = comment_id
        self.analyzer_result = analyzer_result
        self.profile_user_id = profile_user_id
        self.masked_user_id = masked_user_id
        self.masked_user_name = masked_user_name
        self.user_name = user_name
        self.reg_time = reg_time
        self.article_index = article_index
        self.best = best
        self.content = content
