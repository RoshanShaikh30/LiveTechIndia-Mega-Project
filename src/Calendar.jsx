import {
  FaBell,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaDumbbell,
  FaFire,
  FaHome,
  FaLightbulb,
  FaMoon,
  FaRegCalendarCheck,
  FaRegClock,
  FaSun,
  FaUtensils
} from "react-icons/fa";
import "./App.css";

function Calendar() {
  const onboardingData = (() => {
    try {
      return JSON.parse(localStorage.getItem("orbitOnboarding")) || {};
    } catch {
      return {};
    }
  })();

  const userGoals = onboardingData.goals || [];
  const userHabits = onboardingData.habits || [];
  const userCommitments = onboardingData.commitments || [];
  const userObstacles = onboardingData.habitObstacles || [];
  const userHelp = onboardingData.orbitHelp || [];
  const userStruggles = onboardingData.priorityStruggles || [];
  const focusGoal = userGoals[0] || "Your top goal";
  const secondaryGoal = userGoals[1] || "Focused work";
  const habitFocus = userHabits[0] || "Your selected habit";
  const commitmentFocus = userCommitments[0] || "Flexible block";
  const obstacle = userObstacles[0] || userStruggles[0] || "your routine changes";
  const helpPreference = userHelp[0] || "smart adjustments";

  const calendarDays = [
    1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28,
    29, 30
  ];

  const routineItems = [
    { time: "7:00 AM", title: "Wake Up", icon: <FaSun />, tone: "sun" },
    { time: "7:30 AM", title: "Morning Routine", icon: <FaHome />, tone: "home" },
    { time: "8:00 AM", title: commitmentFocus, icon: <FaBookOpen />, tone: "study" },
    { time: "1:00 PM", title: "Lunch", icon: <FaUtensils />, tone: "food" },
    { time: "2:00 PM", title: focusGoal, icon: <FaRegClock />, tone: "focus" },
    { time: "5:00 PM", title: habitFocus, icon: <FaDumbbell />, tone: "fitness" },
    { time: "7:00 PM", title: secondaryGoal, icon: <FaBookOpen />, tone: "study" },
    { time: "9:30 PM", title: habitFocus, icon: <FaBookOpen />, tone: "reading" },
    { time: "10:30 PM", title: "Sleep", icon: <FaMoon />, tone: "sleep" }
  ];

  return (
    <div className="calendar-page">
      <aside className="orbit-sidebar">
        <h2>Orbit</h2>

        <nav className="orbit-side-nav">
          <div className="side-nav-item">
            <FaHome />
            <span>Today</span>
          </div>
          <div className="side-nav-item active">
            <FaCalendarAlt />
            <span>Calendar</span>
          </div>
          <div className="side-nav-item">
            <FaRegCalendarCheck />
            <span>Routine</span>
          </div>
          <div className="side-nav-item">
            <FaCheckCircle />
            <span>Habits</span>
          </div>
          <div className="side-nav-item">
            <FaLightbulb />
            <span>Insights</span>
          </div>
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
        <section className="month-panel">
          <div className="calendar-header">
            <div>
              <FaRegCalendarCheck className="calendar-title-icon" />
              <h2>June 2026</h2>
            </div>

            <div className="calendar-controls">
              <button><FaChevronLeft /></button>
              <button><FaChevronRight /></button>
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
                key={day}
                className={`calendar-day ${day === 24 ? "selected" : ""} ${[1, 7, 11, 12, 13, 17, 23, 25].includes(day) ? "has-dot" : ""}`}
              >
                <span>{day}</span>
              </button>
            ))}

            {[1, 2, 3, 4, 5].map((day) => (
              <button key={`next-${day}`} className="calendar-day muted">
                <span>{day}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="daily-panel">
          <div className="daily-header">
            <h3>Wednesday, June 24</h3>
            <button>
              <FaCalendarAlt />
            </button>
          </div>

          <div className="routine-timeline">
            {routineItems.map((item) => (
              <div className="timeline-row" key={`${item.time}-${item.title}`}>
                <span className="timeline-time">{item.time}</span>
                <div className={`routine-card ${item.tone}`}>
                  <span className="routine-icon">{item.icon}</span>
                  <strong>{item.title}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <aside className="orbit-insights">
        <div className="insights-heading">
          <h3>Orbit Insights</h3>
          <FaLightbulb />
        </div>

        <div className="insight-card focus-card">
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
        </div>

        <div className="insight-card">
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
        </div>

        <div className="insight-card">
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
        </div>

        <div className="insight-card suggestion-card">
          <div className="insight-label">
            <FaLightbulb />
            <strong>Orbit Suggestion</strong>
          </div>
          <p>
            You mentioned {obstacle} can get in the way. Orbit can use {helpPreference} to keep {focusGoal} and {habitFocus} easier to follow today.
          </p>
          <div className="suggestion-actions">
            <button>Accept</button>
            <button className="ignore-btn">Ignore</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Calendar;
