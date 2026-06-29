class RoutineEngine:

    def generate_routine(self, user_data):

        routine = []

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