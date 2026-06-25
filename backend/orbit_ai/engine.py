from orbit_ai.question_engine import QuestionEngine
from orbit_ai.routine_engine import RoutineEngine
from orbit_ai.adjustment_engine import AdjustmentEngine


class OrbitAI:
    """
    Main AI brain for Orbit.
    Every AI-related decision starts here.
    """

    def __init__(self):

        self.question_engine = QuestionEngine()
        self.routine_engine = RoutineEngine()
        self.adjustment_engine = AdjustmentEngine()

    def analyze_user(self, user_data):
        """
        Analyze onboarding responses.
        """

        return {
            "questions": self.question_engine.generate_questions(user_data)
        }

    def generate_routine(self, user_data):

        return self.routine_engine.generate_routine(user_data)

    def adjust_schedule(self, routine, adjustment):

        return self.adjustment_engine.adjust_schedule(
            routine,
            adjustment
        )