import { useMemo, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaLightbulb,
  FaRegCalendarCheck,
  FaSyncAlt,
} from "react-icons/fa";
import "./App.css";

const weekDays = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" }
];

const dayAliases = {
  mon: "monday",
  monday: "monday",
  tue: "tuesday",
  tues: "tuesday",
  tuesday: "tuesday",
  wed: "wednesday",
  wednesday: "wednesday",
  thu: "thursday",
  thur: "thursday",
  thurs: "thursday",
  thursday: "thursday",
  fri: "friday",
  friday: "friday",
  sat: "saturday",
  saturday: "saturday",
  sun: "sunday",
  sunday: "sunday"
};

const parseTimeToMinutes = (time) => {
  if (!time) return null;

  const normalizedTime = String(time).trim();
  const match = normalizedTime.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const WATER_MAX_GLASSES = 8;

const getDateKey = (date) => date.toISOString().slice(0, 10);

const getDefaultHabitProgress = (dateKey) => ({
  date: dateKey,
  waterCount: 0,
  healthyEating: {
    breakfast: false,
    lunch: false,
    dinner: false
  },
  reading: false,
  mindfulness: {
    meditation: false,
    yoga: false,
    deepBreathing: false
  },
  exercise: {
    walk: false,
    workout: false,
    stretching: false
  }
});

const loadHabitProgress = (dateKey) => {
  const defaultProgress = getDefaultHabitProgress(dateKey);

  try {
    const savedProgress = JSON.parse(localStorage.getItem("orbitHabitProgress"));

    if (savedProgress?.date === dateKey) {
      return {
        ...defaultProgress,
        ...savedProgress,
        healthyEating: {
          ...defaultProgress.healthyEating,
          ...savedProgress.healthyEating
        },
        mindfulness: {
          ...defaultProgress.mindfulness,
          ...savedProgress.mindfulness
        },
        exercise: {
          ...defaultProgress.exercise,
          ...savedProgress.exercise
        }
      };
    }
  } catch {
    return defaultProgress;
  }

  const savedWaterCount = Number(localStorage.getItem("orbitWaterCount")) || 0;

  return {
    ...defaultProgress,
    waterCount: Math.min(Math.max(savedWaterCount, 0), WATER_MAX_GLASSES)
  };
};

const normalizeRoutineDays = (item) => {
  const rawDays = item.days || item.day || item.weekdays || item.weekday;
  if (!rawDays) return weekDays.map((day) => day.key);

  const dayValues = Array.isArray(rawDays) ? rawDays : String(rawDays).split(/[,/]/);
  const normalizedDays = dayValues
    .map((day) => dayAliases[String(day).trim().toLowerCase()])
    .filter(Boolean);

  return normalizedDays.length > 0 ? normalizedDays : weekDays.map((day) => day.key);
};

const getDayName = (date) => (
  date.toLocaleString("en-US", { weekday: "long" })
);

const getDayKey = (date) => getDayName(date).toLowerCase();

const itemBelongsToDay = (item, dayKey) => normalizeRoutineDays(item).includes(dayKey);

const compareScheduleItems = (first, second) => {
  const firstStart = parseTimeToMinutes(first.start || first.start_time || first.time) ?? 0;
  const secondStart = parseTimeToMinutes(second.start || second.start_time || second.time) ?? 0;
  return firstStart - secondStart;
};

const normalizePlanPreference = (preference) => {
  if (preference === "Never Change Without Permission") {
    return "Never Change Automatically";
  }

  return preference || "Only Suggest Changes";
};

function WeeklyTimetable({ routine }) {
  const timetableItems = useMemo(() => (
    (routine || [])
      .map((item, index) => {
        const startMinutes = parseTimeToMinutes(item.start || item.start_time || item.time);
        if (startMinutes === null) return null;

        const parsedEndMinutes = parseTimeToMinutes(item.end || item.end_time);
        const endMinutes = parsedEndMinutes === null ? startMinutes + 60 : parsedEndMinutes;

        return {
          id: `${item.title}-${startMinutes}-${index}`,
          title: item.title || item.task || "Routine activity",
          startMinutes,
          endMinutes,
          days: normalizeRoutineDays(item)
        };
      })
      .filter(Boolean)
  ), [routine]);

  const timeSlots = useMemo(() => {
    if (timetableItems.length === 0) {
      return Array.from({ length: 15 }, (_, index) => 8 * 60 + index * 60);
    }

    const earliest = Math.min(...timetableItems.map((item) => item.startMinutes));
    const latest = Math.max(...timetableItems.map((item) => item.endMinutes));
    const start = Math.max(0, Math.floor(earliest / 60) * 60);
    const end = Math.min(24 * 60, Math.ceil(latest / 60) * 60);
    const slotCount = Math.max(1, Math.ceil((end - start) / 60));

    return Array.from({ length: slotCount }, (_, index) => start + index * 60);
  }, [timetableItems]);

  const getItemsForCell = (dayKey, slotStart) => {
    const slotEnd = slotStart + 60;
    return timetableItems.filter((item) => (
      item.days.includes(dayKey) &&
      item.startMinutes >= slotStart &&
      item.startMinutes < slotEnd
    ));
  };

  return (
    <section 
    id = "orbit-timetable"
    className="weekly-timetable-panel">
      <div className="timetable-header">
        <div>
          <FaRegCalendarCheck className="calendar-title-icon" />
          <div>
            <h3>Weekly Timetable</h3>
            <p>Your generated routine, arranged across the week.</p>
          </div>
        </div>
      </div>

      <div className="timetable-scroll">
        <div className="weekly-timetable">
          <div className="timetable-heading time-heading">Time</div>
          {weekDays.map((day) => (
            <div className="timetable-heading" key={day.key}>
              <span>{day.short}</span>
            </div>
          ))}

          {timeSlots.map((slot) => (
            <div className="timetable-row" key={slot}>
              <div className="timetable-time">{formatTime(slot)}</div>
              {weekDays.map((day) => {
                const cellItems = getItemsForCell(day.key, slot);

                return (
                  <div className="timetable-cell" key={`${day.key}-${slot}`}>
                    {cellItems.map((item) => (
                      <div className="timetable-activity" key={`${day.key}-${item.id}`}>
                        <span>{`${formatTime(item.startMinutes)}-${formatTime(item.endMinutes)}`}</span>
                        <strong>{item.title}</strong>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {timetableItems.length === 0 && (
          <div className="empty-timetable-note">
            Generate your Orbit routine to fill this weekly timetable.
          </div>
        )}
      </div>
    </section>
  );
}

function Calendar( { routine, setRoutine } ) {
  const today = new Date();
  const todayKey = getDateKey(today);
  const [activePage, setActivePage] = useState("Calendar");
  const [selectedDate, setSelectedDate] = useState(today);
  const [scheduleChange, setScheduleChange] = useState("");
  const [adjustmentScope, setAdjustmentScope] = useState("");
  const [adjustmentMessage, setAdjustmentMessage] = useState("");
  const [pendingProposal, setPendingProposal] = useState(null);
  const [orbitSuggestion, setOrbitSuggestion] = useState(null);
  const [dismissedSuggestionId, setDismissedSuggestionId] = useState("");
  const [sleepHours, setSleepHours] = useState(8);
  const [sleepMood, setSleepMood] = useState("");
  const [dailySchedules, setDailySchedules] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orbitDailySchedules")) || {};
    } catch {
      return {};
    }
  });
  const [scheduleAdjustments, setScheduleAdjustments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orbitScheduleAdjustments")) || [];
    } catch {
      return [];
    }
  });
  const [habitProgress, setHabitProgress] = useState(() => loadHabitProgress(todayKey));

  const saveHabitProgress = (updater) => {
    setHabitProgress((currentProgress) => {
      const baseProgress = currentProgress.date === todayKey
        ? currentProgress
        : getDefaultHabitProgress(todayKey);
      const nextProgress = updater(baseProgress);

      localStorage.setItem(
        "orbitHabitProgress",
        JSON.stringify(nextProgress)
      );
      localStorage.setItem(
        "orbitWaterCount",
        String(nextProgress.waterCount)
      );

      return nextProgress;
    });
  };

const updateWaterCount = (change) => {
  saveHabitProgress((currentProgress) => ({
    ...currentProgress,
    waterCount: Math.min(
      Math.max(currentProgress.waterCount + change, 0),
      WATER_MAX_GLASSES
    )
  }));
};

const resetWaterCount = () => {
  saveHabitProgress((currentProgress) => ({
    ...currentProgress,
    waterCount: 0
  }));
};

const toggleHabitChecklistItem = (habitName, itemName) => {
  saveHabitProgress((currentProgress) => ({
    ...currentProgress,
    [habitName]: {
      ...currentProgress[habitName],
      [itemName]: !currentProgress[habitName][itemName]
    }
  }));
};

const toggleReadingComplete = () => {
  saveHabitProgress((currentProgress) => ({
    ...currentProgress,
    reading: !currentProgress.reading
  }));
};

  const onboardingData = (() => {
    try {
      return JSON.parse(localStorage.getItem("orbitOnboarding")) || {};
    } catch {
      return {};
    }
  })();

  const userGoals = onboardingData.goals || [];
  const userHabits = onboardingData.habits || [];
  console.log(userHabits);
  const userObstacles = onboardingData.habitObstacles || [];
  const userHelp = onboardingData.orbitHelp || [];
  const userStruggles = onboardingData.priorityStruggles || [];
  const focusGoal = userGoals[0] || "Your top goal";
  const habitFocus = userHabits[0] || "Your selected habit";
  const obstacle = userObstacles[0] || userStruggles[0] || "your routine changes";
  const helpPreference = userHelp[0] || "smart adjustments";
  const waterCount = habitProgress.waterCount;
  const healthyEatingComplete = Object.values(habitProgress.healthyEating).every(Boolean);
  const mindfulnessComplete = Object.values(habitProgress.mindfulness).some(Boolean);
  const exerciseComplete = Object.values(habitProgress.exercise).some(Boolean);

  const monthName = selectedDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });
  const selectedDateTitle = selectedDate.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
  const selectedDateKey = selectedDate.toISOString().slice(0, 10);
  const selectedDayName = getDayName(selectedDate);
  const selectedDayKey = getDayKey(selectedDate);
  const planChangePreference = normalizePlanPreference(onboardingData.planChangePreference);
  const activeRoutine = dailySchedules[selectedDateKey] || routine || [];
  const selectedDaySchedule = activeRoutine
    .filter((item) => itemBelongsToDay(item, selectedDayKey))
    .sort(compareScheduleItems);
  const allHabitsComplete = userHabits.length > 0 && [
    !userHabits.includes("Healthy Eating") || healthyEatingComplete,
    !userHabits.includes("Drink More Water") || waterCount >= WATER_MAX_GLASSES,
    !userHabits.includes("Mindfulness") || mindfulnessComplete,
    !userHabits.includes("Reading") || habitProgress.reading,
    !userHabits.includes("Exercise") || exerciseComplete
  ].every(Boolean);

  const getCalendarCells = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const previousMonthDays = new Date(year, month, 0).getDate();
    const cells = [];

    for (let index = firstWeekday - 1; index >= 0; index -= 1) {
      cells.push({
        day: previousMonthDays - index,
        muted: true,
        date: new Date(year, month - 1, previousMonthDays - index)
      });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({
        day,
        muted: false,
        date: new Date(year, month, day)
      });
    }

    const nextMonthDayCount = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= nextMonthDayCount; day += 1) {
      cells.push({
        day,
        muted: true,
        date: new Date(year, month + 1, day)
      });
    }

    return cells;
  };

  const calendarDays = getCalendarCells(selectedDate);
  const highlightedDays = [1, 7, 11, 12, 13, 17, 23, 25];

  const isSameDate = (firstDate, secondDate) =>
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate();

  const changeMonth = (direction) => {
    setSelectedDate((currentDate) => {
      const currentDay = currentDate.getDate();
      const targetYear = currentDate.getFullYear();
      const targetMonth = currentDate.getMonth() + direction;
      const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      return new Date(
        targetYear,
        targetMonth,
        Math.min(currentDay, daysInTargetMonth)
      );
    });
  };

  const saveAdjustmentHistory = (scope) => {
    if (!scheduleChange.trim()) return;

    const nextAdjustment = {
      id: Date.now(),
      date: selectedDateKey,
      text: scheduleChange.trim(),
      scope
    };
    const updatedAdjustments = [
      nextAdjustment,
      ...scheduleAdjustments
    ];

    setAdjustmentScope(scope);
    setScheduleAdjustments(updatedAdjustments);
    localStorage.setItem(
      "orbitScheduleAdjustments",
      JSON.stringify(updatedAdjustments)
    );

    return nextAdjustment;
  };

  const applySchedule = (nextSchedule, scope, dateKey = selectedDateKey) => {
    if (scope === "future") {
      setRoutine(nextSchedule);
      return;
    }

    const updatedDailySchedules = {
      ...dailySchedules,
      [dateKey]: nextSchedule
    };

    setDailySchedules(updatedDailySchedules);
    localStorage.setItem("orbitDailySchedules", JSON.stringify(updatedDailySchedules));
  };

  const requestScheduleAdjustment = async (scope) => {
    const savedAdjustment = saveAdjustmentHistory(scope);
    if (!savedAdjustment) return;

    setPendingProposal(null);
    setAdjustmentMessage("");

    if (planChangePreference === "Never Change Automatically") {
      setAdjustmentMessage("Adjustment saved. Your schedule was not changed.");
      setScheduleChange("");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/orbit/adjust-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          routine: scope === "future" ? routine : activeRoutine,
          adjustment: {
            text: savedAdjustment.text,
            scope,
            day: selectedDayName,
            date: selectedDateKey
          }
        })
      });

      const data = await response.json();
      const target = data.target || {};
      const proposal = {
        id: savedAdjustment.id,
        scope,
        dateKey: target.date || selectedDateKey,
        schedule: data.schedule || activeRoutine,
        message: data.proposal?.message || "Orbit found a schedule change.",
        target
      };

      if (planChangePreference === "Automatically Adjust") {
        applySchedule(proposal.schedule, proposal.scope, proposal.dateKey);
        setAdjustmentMessage("Schedule updated.");
      } else if (planChangePreference === "Ask Before Changing") {
        setPendingProposal(proposal);
        setAdjustmentMessage("Orbit found a possible schedule change.");
      } else {
        setOrbitSuggestion({
          ...proposal,
          type: "adjustment",
          message: proposal.message
        });
        setAdjustmentMessage("Orbit added one suggestion. Your schedule was not changed.");
      }
    } catch (error) {
      console.error(error);
      setAdjustmentMessage("Adjustment saved. Orbit could not update the schedule right now.");
    }

    setScheduleChange("");
  };

  const acceptProposal = (proposal) => {
    applySchedule(proposal.schedule, proposal.scope, proposal.dateKey);
    setPendingProposal(null);
    setOrbitSuggestion(null);
    setAdjustmentMessage("Schedule updated.");
  };

  const ignoreProposal = () => {
    setPendingProposal(null);
    setAdjustmentMessage("Proposal ignored. Your schedule was not changed.");
  };

  const moveExerciseToTomorrow = () => {
    const exerciseItem = selectedDaySchedule.find((item) => (
      String(item.title || "").toLowerCase().includes("exercise")
    ));

    if (!exerciseItem) {
      setOrbitSuggestion(null);
      return;
    }

    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = getDateKey(tomorrow);
    const tomorrowDay = getDayName(tomorrow);
    const updatedToday = selectedDaySchedule.filter(
      (item) => !( 
        item.title === exerciseItem.title &&
        item.start === exerciseItem.start &&
        item.end === exerciseItem.end)
    );

    // const updatedTomorrow = [
    //   ...(dailySchedules[tomorrowKey] || []),
    //   {
    //     ...exerciseItem,
    //     days: [tomorrowDay]
    //   }
    // ];

    const tomorrowSchedule = dailySchedules[tomorrowKey] || [];

    const alreadyHasExercise = tomorrowSchedule.some(
     (item) =>
       String(item.title || "").toLowerCase().includes("exercise")
     );

    const updatedTomorrow = alreadyHasExercise
  ? tomorrowSchedule
  : [
      ...tomorrowSchedule,
      {
        ...exerciseItem,
        days: [tomorrowDay],
      },
    ];

    const updatedDailySchedules = {
      ...dailySchedules,
      [selectedDateKey]: updatedToday,
      [tomorrowKey]: updatedTomorrow
    };

    setDailySchedules(updatedDailySchedules);
    localStorage.setItem("orbitDailySchedules", JSON.stringify(updatedDailySchedules));
    setOrbitSuggestion(null);
    setDismissedSuggestionId("sleep-exercise");
    setAdjustmentMessage("Exercise moved to tomorrow.");
  };

  const acceptSuggestion = () => {
    const suggestion = orbitSuggestion || visibleSuggestion;
    if (!suggestion) return;

    if (suggestion.type === "adjustment") {
      acceptProposal(suggestion);
      return;
    }

    if (suggestion.action === "move-exercise") {
      moveExerciseToTomorrow();
      return;
    }
    setDismissedSuggestionId(suggestion.id);
    setOrbitSuggestion(null);
  };

  const ignoreSuggestion = () => {
    if (orbitSuggestion?.id) {
      setDismissedSuggestionId(orbitSuggestion.id);
    }
    setOrbitSuggestion(null);
  };

  const generatedSuggestion = useMemo(() => {
    const exerciseToday = selectedDaySchedule.some((item) => (
      String(item.title || "").toLowerCase().includes("exercise")
    ));

    if (userHabits.includes("Better Sleep") && sleepHours < 8 && exerciseToday) {
      return {
        id: "sleep-exercise",
        message: "You slept less than your goal. Consider moving Exercise to tomorrow.",
        action: "move-exercise"
      };
    }

    if (allHabitsComplete) {
      return {
        id: "habits-complete",
        message: "You completed all today's habits. Great consistency."
      };
    }

    const projectPostpones = scheduleAdjustments.filter((adjustment) => (
      /project/i.test(adjustment.text) && /postpone|move|later|tomorrow/i.test(adjustment.text)
    ));

    if (projectPostpones.length >= 2) {
      return {
        id: "project-catch-up",
        message: "You've postponed Project multiple times. Consider scheduling a catch-up block."
      };
    }

    if (userHabits.includes("Drink More Water") && waterCount < 3) {
      return {
        id: "water-check",
        message: "Your water tracker is low today. Consider adding a short water break."
      };
    }

    return {
      id: "routine-support",
      message: `Orbit can use ${helpPreference} to keep ${focusGoal} and ${habitFocus} easier to follow today.`
    };
  }, [
    allHabitsComplete,
    focusGoal,
    habitFocus,
    helpPreference,
    scheduleAdjustments,
    selectedDaySchedule,
    sleepHours,
    userHabits,
    waterCount
  ]);

  const visibleSuggestion = orbitSuggestion || (
    generatedSuggestion.id === dismissedSuggestionId ? null : generatedSuggestion
  );

  const sideNavItems = [
    { label: "Today", icon: <FaHome /> },
    { label: "Calendar", icon: <FaCalendarAlt /> },
    // { label: "Routine", icon: <FaRegCalendarCheck /> },
    { label: "Habits", icon: <FaCheckCircle /> }
  ];

  return (
    <div className="calendar-page">
      <aside className="orbit-sidebar">
        <h2>Orbit</h2>

        <nav className="orbit-side-nav">
          {sideNavItems.map((item) => (
            <button
              key={item.label}
              className={`side-nav-item ${activePage === item.label ? "active" : ""}`}
              onClick={() => setActivePage(item.label)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="profile-card">
          <div className="profile-avatar">R</div>
          <div>
            <strong>Rosie</strong>
            <span>View Profile</span>
          </div>
        </div>
      </aside>

      <main className="calendar-main">
        {activePage === "Calendar" ? (
          <>
          
            {/* <section className="month-panel">
              <div className="calendar-header">
                <div>
                  <FaRegCalendarCheck className="calendar-title-icon" />
                  <h2>{monthName}</h2>
                </div>

                <div className="calendar-controls">
                  <button onClick={() => changeMonth(-1)}><FaChevronLeft /></button>
                  <button onClick={() => changeMonth(1)}><FaChevronRight /></button>
                </div>
              </div>

              <div className="weekday-row">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              <div className="month-grid">
                {calendarDays.map((day) => (
                  <button
                    key={`${day.date.getFullYear()}-${day.date.getMonth()}-${day.day}`}
                    className={`calendar-day ${isSameDate(day.date, selectedDate) ? "selected" : ""} ${highlightedDays.includes(day.day) && !day.muted ? "has-dot" : ""} ${day.muted ? "muted" : ""}`}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <span>{day.day}</span>
                  </button>
                ))}
              </div>
            </section> */}

            <WeeklyTimetable routine={routine} />
          </>
        ) : (
          <section className="calendar-placeholder-panel">
            {activePage === "Habits" ? (
  <div className="orbit-habits-page">

    <div className="habits-header">
      <h2>🌱 Your Habits</h2>
      <p>
        These are the habits Orbit is helping you stay consistent with.
      </p>
    </div>

    <div className="habits-grid">

      {userHabits.includes("Healthy Eating") && (
        <div className={`habit-tracker-card ${healthyEatingComplete ? "habit-complete" : ""}`}>
          <h3>🍎 Healthy Eating</h3>
         <div className="habit-checklist">
          <label className="habit-check-option">
            <input
              type="checkbox"
              checked={habitProgress.healthyEating.breakfast}
              onChange={() => toggleHabitChecklistItem("healthyEating", "breakfast")}
            />
            <span>Breakfast</span>
          </label>
          <label className="habit-check-option">
            <input
              type="checkbox"
              checked={habitProgress.healthyEating.lunch}
              onChange={() => toggleHabitChecklistItem("healthyEating", "lunch")}
            />
            <span>Lunch</span>
          </label>
          <label className="habit-check-option">
            <input
              type="checkbox"
              checked={habitProgress.healthyEating.dinner}
              onChange={() => toggleHabitChecklistItem("healthyEating", "dinner")}
            />
            <span>Dinner</span>
          </label>
          </div>
          {healthyEatingComplete && (
            <p className="habit-complete-note">Today's Healthy Eating habit is complete.</p>
          )}
        </div>
      )}

      {userHabits.includes("Drink More Water") && (
        <div className="habit-tracker-card">
          <h3>💧 Drink More Water</h3>

          <div className="water-counter">

             {Array.from({ length: 8 }).map((_, index) => (
              <span key={index}>
               {index < waterCount ? "💧" : "○"}
              </span>
             ))}

          </div>

          <p> {waterCount} / {WATER_MAX_GLASSES} Glasses </p>

          <div className="water-actions">
            <button
              className="habit-action-btn"
              onClick={() => updateWaterCount(1)}
              disabled={waterCount >= WATER_MAX_GLASSES}
            >
              +
            </button>
            <button
              className="habit-action-btn"
              onClick={() => updateWaterCount(-1)}
              disabled={waterCount <= 0}
            >
              −
            </button>
            <button className="habit-action-btn" onClick={resetWaterCount}>
              Reset
            </button>
          </div>
        </div>
      )}

      {userHabits.includes("Mindfulness") && (
        <div className={`habit-tracker-card ${mindfulnessComplete ? "habit-complete" : ""}`}>
          <h3>🧘 Mindfulness</h3>

          <div className="habit-checklist">
            <label className="habit-check-option">
              <input
                type="checkbox"
                checked={habitProgress.mindfulness.meditation}
                onChange={() => toggleHabitChecklistItem("mindfulness", "meditation")}
              />
              <span>Meditation</span>
            </label>
            <label className="habit-check-option">
              <input
                type="checkbox"
                checked={habitProgress.mindfulness.yoga}
                onChange={() => toggleHabitChecklistItem("mindfulness", "yoga")}
              />
              <span>Yoga</span>
            </label>
            <label className="habit-check-option">
              <input
                type="checkbox"
                checked={habitProgress.mindfulness.deepBreathing}
                onChange={() => toggleHabitChecklistItem("mindfulness", "deepBreathing")}
              />
              <span>Deep Breathing</span>
            </label>
          </div>
          {mindfulnessComplete && (
            <p className="habit-complete-note">Today's Mindfulness habit is complete.</p>
          )}
        </div>
      )}

       {userHabits.includes("Reading") && (
        <div className={`habit-tracker-card ${habitProgress.reading ? "habit-complete" : ""}`}>
          <h3>📚 Reading</h3>

          <label className="habit-check-option">
            <input
              type="checkbox"
              checked={habitProgress.reading}
              onChange={toggleReadingComplete}
            />
            <span>Reading complete today</span>
          </label>
        </div>
      )} 

      {userHabits.includes("Exercise") && (
        <div className={`habit-tracker-card ${exerciseComplete ? "habit-complete" : ""}`}>
          <h3>🏃 Exercise</h3>

          <div className="habit-checklist">
            <label className="habit-check-option">
              <input
                type="checkbox"
                checked={habitProgress.exercise.walk}
                onChange={() => toggleHabitChecklistItem("exercise", "walk")}
              />
              <span>Walk</span>
            </label>
            <label className="habit-check-option">
              <input
                type="checkbox"
                checked={habitProgress.exercise.workout}
                onChange={() => toggleHabitChecklistItem("exercise", "workout")}
              />
              <span>Workout</span>
            </label>
            <label className="habit-check-option">
              <input
                type="checkbox"
                checked={habitProgress.exercise.stretching}
                onChange={() => toggleHabitChecklistItem("exercise", "stretching")}
              />
              <span>Stretching</span>
            </label>
          </div>
          {exerciseComplete && (
            <p className="habit-complete-note">Today's Exercise habit is complete.</p>
          )}
        </div>
      )}

      {userHabits.includes("Better Sleep") && (
      <div className="habit-tracker-card">
        <h3>🌙 Better Sleep</h3>

    <p className="habit-label">How many hours did you sleep?</p>

    <div className="sleep-hours-control">
      <button onClick={() => setSleepHours(Math.max(0, sleepHours - 0.5))}>
         −
      </button>

      <span>{sleepHours} hrs  </span>

      <button onClick={() => setSleepHours(Math.min(12, sleepHours + 0.5))}>
        +
      </button>
    </div>

    <p className="habit-label">How do you feel today?</p>

    <div className="sleep-mood-options">
      {["😴 Tired", "🙂 Okay", "⚡ Energized"].map((mood) => (
        <button
          key={mood}
          className={sleepMood === mood ? "selected" : ""}
          onClick={() => setSleepMood(mood)}
        >
          {mood}
        </button>
      ))}
    </div>

    <div className="sleep-summary">
      <p><strong>Sleep Goal:</strong> 8 hrs</p>
      <br></br>
      <p><strong> Today's Sleep:</strong> {sleepHours} hrs</p>
    </div>
  </div>
)}

      {/* {userHabits.includes("Better Sleep") && (
        <div className="habit-tracker-card">
          <h3>🌙 Better Sleep</h3>

          <p>
            Sleep Goal
          </p>

          <strong>
            {onboardingData.sleepTime || "--:--"}
          </strong>

          <p>
            Wake Time
          </p>

          <strong>
            {onboardingData.wakeTime || "--:--"}
          </strong>

        </div>
      )} */}

    </div>

  </div>
) : (
  <div className="placeholder-card">
    <h3>{activePage}</h3>
    {activePage === "Today" && (
      <>
        <p>{`Your selected day is ${selectedDateTitle}.`}</p>
        <div className="today-schedule-list">
          {selectedDaySchedule.length > 0 ? (
            selectedDaySchedule.map((item, index) => (
              <div className="insight-row" key={`${item.title}-${item.start}-${index}`}>
                <span className="small-icon reminder"><FaRegCalendarCheck /></span>
                <div>
                  <h4>{item.title || item.task || "Routine activity"}</h4>
                  <p>{item.start || item.time || "--:--"} - {item.end || "--:--"}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No schedule items for this day yet.</p>
          )}
        </div>
      </>
    )}
    {/* {activePage === "Routine" && "Routine details will appear here as Orbit grows."} */}
  </div>
)}
            {/* <div className="placeholder-card">
              <h3>{activePage}</h3>
              <p>
                {activePage === "Today" && `Your selected day is ${selectedDateTitle}.`}
                {activePage === "Routine" && "Routine details will appear here as Orbit grows."}
                {activePage === "Habits" && "Habit tracking will appear here as Orbit grows."}
              </p>
            </div> */}
          </section>
        )}
      </main>

      

      <aside className="orbit-insights">
        <div className="insights-heading">
          <h3>Orbit Insights</h3>
          <FaLightbulb />
        </div>

        <div className="insight-card schedule-adjust-card">
          <div className="insight-label">
            <FaSyncAlt />
            <strong>What changed?</strong>
          </div>
          <textarea
            placeholder="I have coaching at 6 PM today."
            value={scheduleChange}
            onChange={(e) => setScheduleChange(e.target.value)}
          />
          <div className="adjustment-actions">
            <button
              className={adjustmentScope === "today" ? "active" : ""}
              onClick={() => requestScheduleAdjustment("today")}
            >
              Adjust Today Only
            </button>
            <button
              className={adjustmentScope === "future" ? "active" : ""}
              onClick={() => requestScheduleAdjustment("future")}
            >
              Adjust Future Schedule
            </button>
          </div>
          {pendingProposal && (
            <div className="adjustment-proposal">
              <p className="adjustment-note">{pendingProposal.message}</p>
              <div className="suggestion-actions">
                <button onClick={() => acceptProposal(pendingProposal)}>Accept</button>
                <button className="ignore-btn" onClick={ignoreProposal}>Ignore</button>
              </div>
            </div>
          )}
          {adjustmentMessage && (
            <p className="adjustment-note">
              {adjustmentMessage}
            </p>
          )}
          {scheduleAdjustments.length > 0 && (
            <p className="adjustment-note">
              Last saved as {scheduleAdjustments[0].scope === "today" ? "today only" : "future schedule"}.
            </p>
          )}
        </div>

        {/* <div className="insight-card focus-card">
          <div className="insight-label">
            <FaRegCalendarCheck />
            <strong>Today's Focus</strong>
          </div>
          <div className="focus-content">
            <div className="focus-target">O</div>
            <div>
              <h4>{focusGoal}</h4>
              <p>{onboardingData.dailyTime || "A realistic focus block"} at 2:00 PM</p>
            </div>
          </div>
        </div> */}

        {/* <div className="insight-card">
          <div className="insight-label">
            <FaBell />
            <strong>Reminders</strong>
          </div>
          <div className="insight-row">
            <span className="small-icon reminder"><FaBell /></span>
            <div>
              <h4>{focusGoal} check-in</h4>
              <p>{onboardingData.deadlineType ? "Aligned with your goal timeline" : "Review your progress today"}</p>
            </div>
          </div>
        </div> */}

        {/* <div className="insight-card">
          <div className="insight-label">
            <FaFire />
            <strong>Habit Streaks</strong>
          </div>
          <div className="insight-row">
            <span className="small-icon streak"><FaFire /></span>
            <div>
              <h4>{habitFocus}</h4>
              <p>{onboardingData.habitFrequency || "Habit streak"} plan</p>
              <div className="streak-dots">
                <span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div> */}

        {visibleSuggestion && (
          <div className="insight-card suggestion-card">
            <div className="insight-label">
              <FaLightbulb />
              <strong>Orbit Suggestion</strong>
            </div>
            <p>{visibleSuggestion.message}</p>
            <div className="suggestion-actions">
              <button onClick={acceptSuggestion}>Accept</button>
              <button className="ignore-btn" onClick={ignoreSuggestion}>Ignore</button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default Calendar;
