from datetime import datetime, timedelta
class RoutineEngine:

    def generate_routine(self, user_data):

        routine = []
        morning_pointer = datetime.strptime("08:00", "%H:%M")
        afternoon_pointer = datetime.strptime("14:00", "%H:%M")
        evening_pointer = datetime.strptime("18:00", "%H:%M")
        night_pointer = datetime.strptime("21:00", "%H:%M")

        for activity, details in user_data.items():

            duration = details.get("duration", "30 mins")

            preferred_time = details.get(
                "preferred_time",
                "Morning"
            )

            if preferred_time == "Morning":
                start = "08:00"
                end = "08:30"

            elif preferred_time == "Afternoon":
                start = "14:00"
                end = "14:30"

            elif preferred_time == "Evening":
                start = "18:00"
                end = "18:30"

            else:
                start = "21:00"
                end = "21:30"

            routine.append({

                "title": activity,

                "duration": duration,

                "preferred_time": preferred_time,

                "start": start,

                "end": end

            })

        return routine