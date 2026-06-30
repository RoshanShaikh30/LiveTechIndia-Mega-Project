from datetime import datetime, timedelta

def duration_to_minutes(duration):

    duration_map = {

        "15 mins": 15,
        "30 mins": 30,
        "45 mins": 45,
        "1 hour": 60,
        "1 hour 30 mins": 90

    }

    return duration_map.get(duration, 30)
  
def overlaps(start, end, blocked_periods):

    for period in blocked_periods:

        if start < period["end"] and end > period["start"]:
            return True

    return False
class RoutineEngine:

    def generate_routine(self, user_data):
        
        print(user_data)

        routine = []
        morning_pointer = datetime.strptime("08:00", "%H:%M")
        afternoon_pointer = datetime.strptime("14:00", "%H:%M")
        evening_pointer = datetime.strptime("18:00", "%H:%M")
        night_pointer = datetime.strptime("21:00", "%H:%M")
        
        blocked_periods = []

        for activity, details in user_data.items():

         if "start_time" in details and "end_time" in details:

            blocked_periods.append({

               "title": activity,

               "start": datetime.strptime(
                details["start_time"],
                "%H:%M"
               ),

               "end": datetime.strptime(
                details["end_time"],
                "%H:%M"
               )

          })
  
        for activity, details in user_data.items():
          
            is_fixed = (
             "start_time" in details and
             "end_time" in details )

            
            if is_fixed:
              start = datetime.strptime(
                details["start_time"],
                "%H:%M"
              )
              
              end = datetime.strptime(
                details["end_time"], "%H:%M"
              )
              
              duration = None
              preferred_time = "Fixed"
              
            else:
               duration = details.get("duration", "30 mins")

               preferred_time = details.get(
                "preferred_time",
                "Morning")
            
               duration_minutes = duration_to_minutes(duration)
               
            if not is_fixed:

              if preferred_time == "Morning":

                start = morning_pointer
                end = start + timedelta(minutes=duration_minutes)
                morning_pointer = end

              elif preferred_time == "Afternoon":

                start = afternoon_pointer
                end = start + timedelta(minutes=duration_minutes)
                afternoon_pointer = end

              elif preferred_time == "Evening":

                start = evening_pointer
                end = start + timedelta(minutes=duration_minutes)
                evening_pointer = end

              else:

                start = night_pointer
                end = start + timedelta(minutes=duration_minutes)
                night_pointer = end


            routine.append({

                "title": activity,

                "duration": duration,

                "preferred_time": preferred_time,

                "start": start.strftime("%H:%M"),

                "end": end.strftime("%H:%M"),
                
                "days": details.get(
                 "days",
                    [
                       "Monday",
                       "Tuesday",
                       "Wednesday",
                       "Thursday",
                       "Friday",
                       "Saturday",
                       "Sunday"
                    ]
                 )

            })

        return routine