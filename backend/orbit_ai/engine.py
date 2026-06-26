from orbit_ai.question_engine import QuestionEngine
from orbit_ai.routine_engine import RoutineEngine
from orbit_ai.adjustment_engine import AdjustmentEngine


class OrbitAI:

    def __init__(self):

        self.question_engine = QuestionEngine()
        self.routine_engine = RoutineEngine()
        self.adjustment_engine = AdjustmentEngine()

    def analyze_user(self, user_data):

        print("\n===== ORBIT AI ANALYSIS =====")

        questions = self.question_engine.analyze_user(user_data)

        if questions:

         print("Follow-up Questions Needed:")

        return {
            "status": "needs_more_information",
            "questions": questions
        }

        print("Enough information received.")

        routine = self.routine_engine.generate_routine(user_data)

        return {
        "status": "ready",
        "routine": routine
        }








    # def find_missing_information(self, user_data):

    #     missing = []

    #     commitments = user_data.get("fixedCommitments", [])
    #     habits = user_data.get("habits", [])
    #     goals = user_data.get("goals", [])

    #     if "Coaching" in commitments:
    #         missing.append("coaching_time")
    #         missing.append("coaching_duration")

    #     if "Reading" in habits:
    #         missing.append("reading_duration")

    #     if "Study" in goals:
    #         missing.append("study_session")

    #     return missing