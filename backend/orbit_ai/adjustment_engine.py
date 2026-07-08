from datetime import datetime, timedelta
import re
from orbit_ai.parser import Parser
from orbit_ai.gemini_service import understand_user_input


WEEK_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]


class AdjustmentEngine:
    def __init__(self):
        self.parser = Parser()

    def adjust_schedule(self, routine, adjustment):
        routine = routine or []
        adjustment = adjustment or {}
        parsed = self._parse_adjustment(
            adjustment.get("text", ""),
            fallback_day=adjustment.get("day"),
        )
        target_day = parsed["day"]
        target_days = parsed["target"].get("days") or [target_day]

        updated = [dict(item) for item in routine]

        if parsed["intent"] == "remove":
            updated, removed_titles = self._remove_items(updated, parsed["activity"], target_days)
            message = (
                f"Remove {removed_titles[0]} from {', '.join(target_days)}?"
                if removed_titles
                else f"No matching {parsed['activity']} item was found for {', '.join(target_days)}."
            )

            return {
                "schedule": updated,
                "parsed_adjustment": {
                    "title": parsed["activity"],
                    "days": target_days,
                    "adjustment": True,
                    "intent": "remove",
                },
                "target": parsed["target"],
                "proposal": {
                    "message": message,
                    "conflicts": [],
                    "moved": [],
                    "removed": removed_titles,
                },
            }
            
        # existing_item = next(
        #     (item 
        #      for item in updated
        #      if self._normalize_title(item.get("title")) == self._normalize_title(parsed["activity"]) 
        #      ), 
        #     None,
        # )
        
        # same_day_existing = (
        #     existing_item 
        #     and target_day in self._item_days(existing_item)
        # )
        
        same_day_existing = next(
    (
        item
        for item in updated
        if (
            self._normalize_title(item.get("title"))
            == self._normalize_title(parsed["activity"])
            and target_day in self._item_days(item)
        )
    ),
    None,
)

        existing_item = same_day_existing or next(
    (
        item
        for item in updated
        if self._normalize_title(item.get("title"))
        == self._normalize_title(parsed["activity"])
    ),
    None,
)
        
        # if (
        #     same_day_existing
        #     and parsed["intent"] == "add"
        #     and not parsed["has_time"]
        #     ):
        #         return {
        #             "schedule": updated,
        #             "parsed_adjustment": existing_item,
        #             "target": parsed["target"],
        #             "proposal": {
        #                 "message": (
        #                     f"{existing_item.get('title')} is already scheduled for {target_day} from {existing_item['start']} to {existing_item['end']}. Add another session anyways?"
        #                     ),
        #                 "conflicts": [],
        #                 "moved": [],
        #                 "duplicate": True,
        #             },
        #         } 
        
        if existing_item:
            if parsed["start"] is None:
                parsed["start"] = self._to_minutes(existing_item.get("start"))
                parsed["end"] = self._to_minutes(existing_item.get("end"))
                
        if (
            same_day_existing
            and parsed["intent"] == "add"
            and not parsed["has_time"]
            ):
                return {
                    "schedule": updated,
                    "parsed_adjustment": existing_item,
                    "target": parsed["target"],
                    "proposal": {
                        "message": (
                            f"{existing_item.get('title')} is already scheduled for {target_day} from {existing_item['start']} to {existing_item['end']}. Add another session anyways?"
                            ),
                        "conflicts": [],
                        "moved": [],
                        "duplicate": True,
                    },
                } 
        
        if parsed["start"] is None:
          parsed["start"] = 9 * 60
          parsed["end"] = 10 * 60


        new_item = {
            "title": parsed["activity"],
            "start": self._format_minutes(parsed["start"]),
            "end": self._format_minutes(parsed["end"]),
            "days": target_days,
            "preferred_time": "Fixed",
            "adjustment": True
        }

        day_items = [
            item for item in updated
            if target_day in self._item_days(item)
        ]

        conflicts = [
            item for item in day_items
            if self._overlaps(
                self._to_minutes(item.get("start") or item.get("time")),
                self._to_minutes(item.get("end")) or self._to_minutes(item.get("start") or item.get("time")) + 60,
                parsed["start"],
                parsed["end"],
            )
        ]

        for conflict in conflicts:
            if self._is_fixed(conflict):
                continue

            duration = self._duration(conflict)
            next_start = parsed["end"]
            next_end = next_start + duration

            while self._has_conflict(updated, conflict, target_day, next_start, next_end, new_item):
                next_start += 30
                next_end = next_start + duration

            conflict["start"] = self._format_minutes(next_start)
            conflict["end"] = self._format_minutes(next_end)

        updated.append(new_item)

        moved_titles = [
            item.get("title", "a flexible activity")
            for item in conflicts
            if not self._is_fixed(item)
        ]
        fixed_conflicts = [
            item.get("title", "another fixed activity")
            for item in conflicts
            if self._is_fixed(item)
        ]

        if moved_titles:
            message = f"Orbit found a conflict. Move {moved_titles[0]} to {conflicts[0]['start']}?"
        elif fixed_conflicts:
            message = f"Orbit found a conflict with {fixed_conflicts[0]}. Add {new_item['title']} anyway?"
        else:
            message = f"Add {new_item['title']} at {new_item['start']}?"

        return {
            "schedule": updated,
            "parsed_adjustment": new_item,
            "target": parsed["target"],
            "proposal": {
                "message": message,
                "conflicts": [item.get("title", "Scheduled item") for item in conflicts],
                "moved": moved_titles,
            },
        }

    def _parse_adjustment(self, text, fallback_day=None):
        # parsed = self.parser.parse(text)
        try:
         parsed = understand_user_input(text)
        except Exception:
         parsed = self.parser.parse(text)
         
        lower = str(text or "").lower()

        target = self._target_day(lower, parsed, fallback_day)
        target_day = target["day"]
        intent = "remove" if self._is_removal(lower) else "add"
        time_range = self._extract_time_range(lower)
        start = time_range[0]
        end = time_range[1]

        if start is None:
            start = self._single_time(lower)
            end = start + 60 if start is not None else None

        if start is None and re.search(r"\b(busy|unavailable)\b", lower):
            start, end = 9 * 60, 17 * 60

        # if start is None:
        #     start, end = 9 * 60, 10 * 60
        if start is None:
            start = None
            end = None

        activity = self._clean_activity(parsed.get("activity") or "Adjustment", intent)
        activity = re.sub(r"\b(today|tomorrow)\b", "", activity, flags=re.IGNORECASE).strip()
        if re.search(r"\b(busy|unavailable)\b", lower):
            activity = "Busy"
        if not activity:
            activity = "Adjustment"
            
        has_time = start is not None

        return {
            "activity": activity.title(),
            "day": target_day,
            "start": start,
            "end": end,
            "has_time": has_time,
            "target": target,
            "intent": intent,
        }

    def _is_removal(self, lower):
        return bool(re.search(
            r"\b(don't\s+have|do\s+not\s+have|cancel|remove|no\s+longer\s+have)\b",
            lower,
        ))

    def _clean_activity(self, activity, intent):
        activity = str(activity or "").strip()

        if intent == "remove":
            activity = re.sub(
                r"^(i\s+)?(?:don't\s+have|do\s+not\s+have|no\s+longer\s+have|longer\s+have)\s+",
                "",
                activity,
                flags=re.IGNORECASE,
            ).strip()
            activity = re.sub(
                r"^(please\s+)?(?:cancel|remove)\s+",
                "",
                activity,
                flags=re.IGNORECASE,
            ).strip()
        else:
            activity = re.sub(
                r"^(i\s*(am|'m)\s+|i\s+have\s+|i\s+want\s+to\s+add\s+|add\s+)",
                "",
                activity,
                flags=re.IGNORECASE,
            ).strip()

        return activity

    def _remove_items(self, routine, activity, target_days):
        removed_titles = []
        updated = []
        normalized_activity = self._normalize_title(activity)

        for item in routine:
            item_days = self._item_days(item)
            title = item.get("title") or item.get("task") or ""
            title_matches = normalized_activity in self._normalize_title(title)
            target_matches = any(day in item_days for day in target_days)

            if not title_matches or not target_matches:
                updated.append(item)
                continue

            removed_titles.append(title or activity)
            remaining_days = [day for day in item_days if day not in target_days]

            if remaining_days:
                next_item = dict(item)
                next_item["days"] = remaining_days
                updated.append(next_item)

        return updated, removed_titles

    def _normalize_title(self, value):
        return re.sub(r"[^a-z0-9]+", " ", str(value or "").lower()).strip()

    def _target_day(self, lower, parsed, fallback_day=None):
        today = datetime.now()

        if re.search(r"\btomorrow\b", lower):
            tomorrow = datetime.now() + timedelta(days=1)
            return {
                "kind": "date",
                "day": tomorrow.strftime("%A"),
                "date": tomorrow.date().isoformat(),
                "recurring": False,
            }

        if re.search(r"\btoday\b", lower):
            return {
                "kind": "date",
                "day": today.strftime("%A"),
                "date": today.date().isoformat(),
                "recurring": False,
            }

        parsed_days = parsed.get("days") or []
        if parsed_days:
            recurring = bool(re.search(r"\b(every|daily|weekdays?|weekends?)\b", lower))
            next_date = self._next_date_for_day(parsed_days[0], today)
            return {
                "kind": "recurring" if recurring else "date",
                "day": parsed_days[0],
                "days": parsed_days,
                "date": None if recurring else next_date,
                "recurring": recurring,
            }

        for day in WEEK_DAYS:
            if day.lower() in lower:
                return {
                    "kind": "date",
                    "day": day,
                    "days": [day],
                    "date": self._next_date_for_day(day, today),
                    "recurring": False,
                }

        return {
            "kind": "default",
            "day": fallback_day or today.strftime("%A"),
            "date": None,
            "recurring": False,
        }

    def _next_date_for_day(self, day, today):
        target_index = WEEK_DAYS.index(day)
        today_index = today.weekday()
        days_ahead = (target_index - today_index) % 7
        target_date = today + timedelta(days=days_ahead)
        return target_date.date().isoformat()

    def _extract_time_range(self, lower):
        parsed = self.parser._extract_time_range(lower)
        if parsed:
            return self._to_minutes(parsed[0]), self._to_minutes(parsed[1])
        return None, None

    def _single_time(self, lower):
        match = re.search(r"\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b", lower)
        if not match:
            return None

        hour = int(match.group(1))
        minute = int(match.group(2) or 0)
        meridiem = match.group(3)

        if meridiem == "pm" and hour != 12:
            hour += 12
        if meridiem == "am" and hour == 12:
            hour = 0

        return hour * 60 + minute

    def _item_days(self, item):
        days = item.get("days") or item.get("day") or WEEK_DAYS
        if isinstance(days, str):
            days = [days]
        return days

    def _is_fixed(self, item):
        return item.get("preferred_time") == "Fixed" or item.get("adjustment")

    def _duration(self, item):
        start = self._to_minutes(item.get("start") or item.get("time"))
        end = self._to_minutes(item.get("end"))
        if start is None:
            return 60
        if end is None or end <= start:
            return 60
        return end - start

    def _has_conflict(self, routine, moving_item, day, start, end, new_item):
        blocks = routine + [new_item]
        for item in blocks:
            if item is moving_item or day not in self._item_days(item):
                continue

            item_start = self._to_minutes(item.get("start") or item.get("time"))
            if item_start is None:
                continue

            item_end = self._to_minutes(item.get("end")) or item_start + 60
            if self._overlaps(start, end, item_start, item_end):
                return True

        return False

    def _overlaps(self, start, end, other_start, other_end):
        if start is None or end is None or other_start is None or other_end is None:
            return False
        return start < other_end and end > other_start

    def _to_minutes(self, value):
        if not value:
            return None

        try:
            parsed = datetime.strptime(str(value), "%H:%M")
            return parsed.hour * 60 + parsed.minute
        except ValueError:
            return None

    def _format_minutes(self, minutes):
        minutes = minutes % (24 * 60)
        return f"{minutes // 60:02d}:{minutes % 60:02d}"
