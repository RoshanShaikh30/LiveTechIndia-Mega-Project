import {
  FaUserGraduate,
  FaBriefcase,
  FaLaptopCode,
  FaHome,
  FaEllipsisH,
  FaSun,
  FaCloudSun,
  FaMoon,
  FaGraduationCap,
  FaCalendarAlt,
  FaCheckCircle,
  FaUsers,
  FaBolt,
  FaBook,
  FaTint,
  FaDumbbell,
  FaRocket,
  FaSeedling,
  FaPlus,
  FaBrain,
  FaClock,
  FaStopwatch,
  FaRegClock,
  FaHourglassHalf,
  FaInfinity,
  FaCalendarWeek,
  FaCalendarCheck,
  FaCalendarDay,
  FaBookOpen,
  FaSpa,
  FaAppleAlt,
  FaTimes,
  FaBatteryHalf,
  FaBell,
  FaTasks,
  FaShieldAlt,
  FaSyncAlt,
  FaQuestionCircle,
  FaLightbulb,
  FaMagic
} from "react-icons/fa";
import "./App.css";
import OrbitQuestionModal from "./OrbitQuestionModal";
import { useEffect, useMemo, useState } from "react";

function RoutineBuilder({ onComplete }) {
  const [habitIntent, setHabitIntent] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [step, setStep] = useState(1);
  const [otherRole, setOtherRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [scheduleType, setScheduleType] = useState("");
  const [productiveHours, setProductiveHours] = useState([]);
  const [freeDays, setFreeDays] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [commitmentInput, setCommitmentInput] = useState("");
  const [customCommitments, setCustomCommitments] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [otherGoal, setOtherGoal] = useState("");
  const [customGoals, setCustomGoals] = useState([]);
  const [goalPriority, setGoalPriority] = useState({});
  const [dailyTime, setDailyTime] = useState("");
  const [deadlineType, setDeadlineType] = useState("");
  const [customDeadline, setCustomDeadline] = useState("");
  const [successVision, setSuccessVision] = useState("");
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [habitInput, setHabitInput] = useState("");
  const [customHabits, setCustomHabits] = useState([]);
  const [habitFrequency, setHabitFrequency] = useState("");
  const [habitObstacles, setHabitObstacles] = useState([]);
  const [habitObstacleInput, setHabitObstacleInput] = useState("");
  const [customHabitObstacles, setCustomHabitObstacles] = useState([]);
  const [orbitHelp, setOrbitHelp] = useState([]);
  const [orbitHelpInput, setOrbitHelpInput] = useState("");
  const [customOrbitHelp, setCustomOrbitHelp] = useState([]);
  const [priorityStruggles, setPriorityStruggles] = useState([]);
  const [priorityStruggleInput, setPriorityStruggleInput] = useState("");
  const [customPriorityStruggles, setCustomPriorityStruggles] = useState([]);
  const [routineStructure, setRoutineStructure] = useState("");
  const [planChangePreference, setPlanChangePreference] = useState("");
  const [priorityNotes, setPriorityNotes] = useState("");
  // const [saved, setSaved] = useState(false);
  const [successSaved, setSuccessSaved] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [groupedQuestions, setGroupedQuestions] = useState([]);

  console.log("Role:", selectedRole);
  console.log("Schedule Type:", scheduleType);
  console.log("Productive Hours:", productiveHours);
  console.log("Free Days:", freeDays);
  console.log("Commitments:", commitments);

  const toggleProductiveHour = (hour) => {
  if (productiveHours.includes(hour)) {
    setProductiveHours(
      productiveHours.filter(item => item !== hour)
    );
  } else {
    setProductiveHours([
      ...productiveHours,
      hour
    ]);
  }

};

const generateOrbit = async () => {

  const onboardingData = JSON.parse(
    localStorage.getItem("orbitOnboarding")
  );

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/orbit/analyze",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(onboardingData)

      }
    );

    const data = await response.json();

    console.log(data);

    if (data.status === "needs_more_information") {

      setGroupedQuestions(data.questions);

      setShowQuestionModal(true);

      return;

    }

    onComplete();

  }

  catch (error) {

    console.error(error);

  }

};

// const generateOrbit = () => {
//   const routine = [
//     {
//       time: "7:00 AM",
//       task: "Wake Up"
//     },
//     {
//       time: "8:00 AM",
//       task: "Morning Routine"
//     }
//   ];

//   localStorage.setItem(
//     "orbitRoutine",
//     JSON.stringify(routine)
//   );
//   onComplete();
// };

const toggleFreeDay = (day) => {
  if (freeDays.includes(day)) {
    setFreeDays(
      freeDays.filter(item => item !== day)
    );
  } else {
    setFreeDays([
      ...freeDays,
      day
    ]);
  }

};

const toggleCommitment = (commitment) => {

  if (commitments.includes(commitment)) {
    setCommitments(
      commitments.filter(item => item !== commitment)
    );
    if (commitment === "Other") {
      setCustomCommitments([]);
      setCommitmentInput("");
    }
  }

  else {
    setCommitments([
      ...commitments,
      commitment
    ]);
  }
};

const saveCustomRole = () => {
  if (!otherRole.trim()) return;
  setCustomRole(otherRole.trim());
  setOtherRole("");
};

const addCustomCommitment = () => {
  if (!commitmentInput.trim()) return;
  setCustomCommitments([
    ...customCommitments,
    commitmentInput.trim()
  ]);
  setCommitmentInput("");
};

const toggleGoal = (goal) => {

  if (selectedGoals.includes(goal)) {
    setSelectedGoals(
      selectedGoals.filter(item => item !== goal)
    );
  } else {
    setSelectedGoals([
      ...selectedGoals,
      goal
    ]);
  }
};

const addCustomGoal = () => {
  if (!otherGoal.trim()) return;
  setCustomGoals([
    ...customGoals,
    otherGoal.trim()
  ]);
  setOtherGoal("");
};

const handlePriorityChange = (goal, priority) => {
  setGoalPriority({
    ...goalPriority,
    [goal]: priority
  });
};

const allGoals = useMemo(() => [
  ...selectedGoals.filter(goal => goal !== "Other"),
  ...customGoals
], [selectedGoals, customGoals]);

const allHabitChoices = useMemo(() => [
  ...selectedHabits.filter(habit => habit !== "Other"),
  ...customHabits
], [selectedHabits, customHabits]);

const allCommitments = useMemo(() => [
  ...commitments.filter(commitment => commitment !== "Other"),
  ...customCommitments
], [commitments, customCommitments]);

useEffect(() => {
  const orbitOnboarding = {
    role: selectedRole === "Other" ? customRole : selectedRole,
    scheduleType,
    productiveHours,
    freeDays,
    commitments: allCommitments,
    goals: allGoals,
    goalPriority,
    dailyTime,
    deadlineType,
    customDeadline,
    successVision,
    habits: allHabitChoices,
    habitIntent,
    habitFrequency,
    habitObstacles: [
      ...habitObstacles.filter(obstacle => obstacle !== "Other"),
      ...customHabitObstacles
    ],
    orbitHelp: [
      ...orbitHelp.filter(help => help !== "Other"),
      ...customOrbitHelp
    ],
    priorityStruggles: [
      ...priorityStruggles.filter(struggle => struggle !== "Other"),
      ...customPriorityStruggles
    ],
    routineStructure,
    planChangePreference,
    priorityNotes
  };

  localStorage.setItem("orbitOnboarding", JSON.stringify(orbitOnboarding));
}, [
  selectedRole,
  otherRole,
  customRole,
  scheduleType,
  productiveHours,
  freeDays,
  allCommitments,
  allGoals,
  goalPriority,
  dailyTime,
  deadlineType,
  customDeadline,
  successVision,
  allHabitChoices,
  habitIntent,
  habitFrequency,
  habitObstacles,
  customHabitObstacles,
  orbitHelp,
  customOrbitHelp,
  priorityStruggles,
  customPriorityStruggles,
  routineStructure,
  planChangePreference,
  priorityNotes
]);

const toggleHabit = (habit) => {

  if (selectedHabits.includes(habit)) {
    const updatedHabits =
      selectedHabits.filter(item => item !== habit);

    setSelectedHabits(updatedHabits);
    if (habit === "Other") {
      setCustomHabits([]);
      setHabitInput("");
    }
  } else {
    setSelectedHabits([
      ...selectedHabits,
      habit
    ]);
  }
};

const addCustomHabit = () => {
  if (habitInput.trim() === "") return;
  setCustomHabits([
    ...customHabits,
    habitInput.trim()
  ]);
  setHabitInput("");
};

const toggleHabitIntent = (intent) => {

  if (habitIntent.includes(intent)) {
    setHabitIntent(
      habitIntent.filter(item => item !== intent)
    );
  } else {
    setHabitIntent([
      ...habitIntent,
      intent
    ]);
  }
};

const toggleHabitObstacle = (obstacle) => {

  if (habitObstacles.includes(obstacle)) {
    setHabitObstacles(
      habitObstacles.filter(item => item !== obstacle)
    );
    if (obstacle === "Other") {
      setCustomHabitObstacles([]);
      setHabitObstacleInput("");
    }
  } else {
    setHabitObstacles([
      ...habitObstacles,
      obstacle
    ]);
  }
};

const addCustomHabitObstacle = () => {
  if (!habitObstacleInput.trim()) return;
  setCustomHabitObstacles([
    ...customHabitObstacles,
    habitObstacleInput.trim()
  ]);
  setHabitObstacleInput("");
};

const toggleOrbitHelp = (help) => {

  if (orbitHelp.includes(help)) {
    setOrbitHelp(
      orbitHelp.filter(item => item !== help)
    );
    if (help === "Other") {
      setCustomOrbitHelp([]);
      setOrbitHelpInput("");
    }
  } else {
    setOrbitHelp([
      ...orbitHelp,
      help
    ]);
  }
};

const addCustomOrbitHelp = () => {
  if (!orbitHelpInput.trim()) return;
  setCustomOrbitHelp([
    ...customOrbitHelp,
    orbitHelpInput.trim()
  ]);
  setOrbitHelpInput("");
};

const togglePriorityStruggle = (struggle) => {

  if (priorityStruggles.includes(struggle)) {
    setPriorityStruggles(
      priorityStruggles.filter(item => item !== struggle)
    );
    if (struggle === "Other") {
      setCustomPriorityStruggles([]);
      setPriorityStruggleInput("");
    }
  } else {
    setPriorityStruggles([
      ...priorityStruggles,
      struggle
    ]);
  }
};

const addCustomPriorityStruggle = () => {
  if (!priorityStruggleInput.trim()) return;
  setCustomPriorityStruggles([
    ...customPriorityStruggles,
    priorityStruggleInput.trim()
  ]);
  setPriorityStruggleInput("");
};

  return (
    <div className="routine-builder">
      <h2 className="build-your-orbit">Build Your Orbit</h2>
      {/* <p>Current Step: {step}</p> -> js for checking if step works */}
      <p>
        Tell Orbit about your schedule, goals, and habits so it can create a routine that adapts to your life.
      </p>

    <div className="onboarding-wrapper">
     {step === 1 && (
      <div className="onboarding-card">

       <div className="section-header">

        <div className="step-circle">

        </div>

        <div>
         <b> <h3>About You</h3> </b>
         <p>Which option best describes you?</p>
        </div>

       </div> {/* section header ends here. */}

       <div className="choice-grid">

        <div className={`choice-card ${selectedRole === "Student" ? "selected" : ""}`}
        onClick={() => setSelectedRole("Student")}>
          <div className="icon-circle">
           <FaUserGraduate className="choice-icon" />
          </div>
          <h4>Student</h4>
          <p>I'm currently studying.</p>
        </div>

        <div className={`choice-card ${selectedRole === "Working Professional" ? "selected" : ""}`}
        onClick={() => setSelectedRole("Working Professional")}>
          <div className="icon-circle">
           <FaBriefcase className="choice-icon" />
          </div>
          <h4>Working Professional</h4>
          <p>I have a full-time or part-time job.</p>
        </div>

        <div className={`choice-card ${selectedRole === "Freelancer" ? "selected" : ""}`}
        onClick={() => setSelectedRole("Freelancer")}>
          <div className="icon-circle">
           <FaLaptopCode className="choice-icon" />
          </div>
          <h4>Freelancer</h4>
          <p> I work independently. </p>
        </div>

       <div className={`choice-card ${selectedRole === "Homemaker" ? "selected" : ""}`}
        onClick={() => setSelectedRole("Homemaker")}>
          <div className="icon-circle">
            <FaHome className="choice-icon"/>
          </div>
          <h4>Homemaker</h4>
          <p>I manage my home and family.</p>
       </div>

       <div className={`choice-card other-card ${selectedRole === "Other" ? "selected" : ""}`}
  onClick={() => setSelectedRole("Other")}>

    <div className="icon-circle">
      <FaEllipsisH className="choice-icon" />
    </div>

         <h4>Other</h4>
         {/* <p> Something else! (You can tell us) </p> */}

         {selectedRole === "Other" && (
          <div className="other-save-box" onClick={(e) => e.stopPropagation()}>
           <input 
           type="text"
           placeholder="Tell us what best describes you..."
           value={otherRole}
           onChange={(e) => setOtherRole(e.target.value)}
           className="other-input"
           />
           <button className="add-goal-btn" onClick={saveCustomRole}>
            Save
           </button>
          </div>
         )}

         {selectedRole === "Other" && customRole && (
          <div className="custom-habit-list role-custom-list">
           <div className="goal-chip">{customRole}</div>
          </div>
         )}

       </div>

      </div> {/* choice grid ends here. */}

      {/* {selectedRole === "Other" && (
        <input
          type="text"
          placeholder="Tell us what best describes you..."
          value={otherRole}
          onChange={(e) => setOtherRole(e.target.value)}
          className="other-input"
        />
      )} */}

     </div> /* onboarding card ends here. */
     )}

     {step === 2 && (

      <div className="onboarding-card">
       <h3>Basic Schedule</h3>
       <p> Tell Orbit about your daily schedule so we can build a routine that fits your life!</p>
        
       <div className="section-divider"></div>

       <div className="schedule-section">
       <div className="schedule-header-row">
       <div className="schedule-question">
        <h4> 1. How is your weekly schedule? </h4>
        <p>This helps us understand how to plan your schedule.</p>
       </div>
        <div className="schedule-type-grid">

          <div className={`schedule-option ${scheduleType === "same" ? "selected" : ""  }`}
          onClick = {() => setScheduleType("same" )} >
            {scheduleType === "same" && (
            <FaCheckCircle className="check-icon" />
            )}
            <FaSun className="schedule-icon"/>
            <div>
            <h5> Mostly Same Every Day</h5>
            <p> My wake and sleep times are similar each day.</p>
            </div>
          </div>

          <div className={`schedule-option ${scheduleType === "different" ? "selected" : "" }`}
          onClick = {() => setScheduleType("different")}>
            {scheduleType === "different" && (
            <FaCheckCircle className="check-icon" />
            )}
            <FaCalendarAlt className="schedule-icon"/>
            <div>
            <h5>Different Across the Week</h5>
            <p>My schedule changes on different days.</p>
            </div>
          </div>

         </div>
         </div>
        </div>

        {scheduleType === "same" && (
         <>
         <h4> 2. Wake Up & Sleep Time </h4>
         <div className="time-section">

           <div className="input-group">
             <label>Wake Up Time</label>
             <input type="time" />
           </div>

           <div className="input-group">
             <label>Sleep Time</label>
             <input type="time" />
            </div>

          </div>
          </>
        )}

        {scheduleType === "different" && (
         <div className="weekly-schedule">
           <h4>2. Wake Up & Sleep Time (Per Day)</h4>
           <div className="day-row">
             <span>Mon</span>
             <input type="time" />
             <input type="time" />
           </div>

           <div className="day-row">
             <span>Tue</span>
             <input type="time" />
             <input type="time" />
            </div>

            <div className="day-row">
              <span>Wed</span>
              <input type="time" />
              <input type="time" />
            </div>

            <div className="day-row">
              <span>Thu</span>
              <input type="time" />
              <input type="time" />
            </div>

            <div className="day-row">
             <span>Fri</span>
             <input type="time" />
             <input type="time" />
            </div>

            <div className="day-row">
              <span>Sat</span>
              <input type="time"/>
              <input type="time" />
            </div>

            <div className="day-row">
              <span>Sun</span>
              <input type="time"/>
              <input type="time" />
            </div>

          </div>
        )}

        <div className="section-divider"> </div>
        <div className="two-column-section">
         <div className="column-card"> 
        <h4>3. When are you most productive?</h4>
        <div className="multi-card-grid">

         <div
    className={`multi-card ${
      productiveHours.includes("Morning") ? "selected" : ""
    }`}
    onClick={() => toggleProductiveHour("Morning")}>
      <FaSun className="productive-icon morning" />
      <span>Morning</span>
      </div>

         <div
    className={`multi-card ${
      productiveHours.includes("Afternoon") ? "selected" : ""
    }`}
    onClick={() => toggleProductiveHour("Afternoon")}>
      <FaSun className="productive-icon afternoon" />
      <span>Afternoon</span>
      </div>

         <div
    className={`multi-card ${
      productiveHours.includes("Evening") ? "selected" : ""
    }`}
    onClick={() => toggleProductiveHour("Evening")}>
      <FaCloudSun className="productive-icon evening" />
      <span>Evening</span>
    </div>

         <div
    className={`multi-card ${
      productiveHours.includes("Night") ? "selected" : ""
    }`}
    onClick={() => toggleProductiveHour("Night")}>
      <FaMoon className="productive-icon night"/>
      <span>Night</span>
      </div>

        </div>
        </div>
       
     
        {/* <div className="section-divider"> </div> */}
      <div className="column-card">

        <h4>4. Which days are usually free?</h4>

        <div className="days-grid">
         <div className="days-row">
         <div
    className={`day-pill ${freeDays.includes("Mon") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Mon")}>Mon</div>
          <div
    className={`day-pill ${freeDays.includes("Tue") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Tue")}>Tue</div>
         <div
    className={`day-pill ${freeDays.includes("Wed") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Wed")}>Wed</div>
         <div
    className={`day-pill ${freeDays.includes("Thu") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Thu")}>Thu</div>
         </div>
         <div className="days-row">
         <div
    className={`day-pill ${freeDays.includes("Fri") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Fri")}>Fri</div>
         <div
    className={`day-pill ${freeDays.includes("Sat") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Sat")}>Sat</div>
         <div
    className={`day-pill ${freeDays.includes("Sun") ? "selected" : ""}`}
    onClick={() => toggleFreeDay("Sun")}>Sun</div>
    </div>

        </div>
      </div>
      </div>

        <div className="section-divider"> </div> 

        <h4>5.Fixed Commitments!</h4>

        <div className="commitment-grid">

         <div
    className={`multi-card ${
      commitments.includes("College") ? "selected" : ""
    }`}
    onClick={() => toggleCommitment("College")}>
      <FaGraduationCap className="commitment-icon" />
      <span>College</span>
      </div>

         <div
    className={`multi-card ${
      commitments.includes("Job") ? "selected" : ""
    }`}
    onClick={() => toggleCommitment("Job")}>
      <FaBriefcase className="commitment-icon" />
      <span>Job</span>
      </div>

         <div
    className={`multi-card ${
      commitments.includes("Coaching") ? "selected" : ""
    }`}
    onClick={() => toggleCommitment("Coaching")}>
      <FaBook className="commitment-icon"/>
      <span> Coaching </span>
      </div>

         <div
    className={`multi-card ${
      commitments.includes("Family") ? "selected" : ""
    }`}
    onClick={() => toggleCommitment("Family")}>
      <FaUsers className="commitment-icon" />
      <span>Family</span>
    </div>

         <div
    className={`multi-card ${
      commitments.includes("Other") ? "selected" : ""
    }`}
    onClick={() => toggleCommitment("Other")}>
      <FaEllipsisH className="commitment-icon"/>
      <span>Other</span>
    </div>

        </div>
        {commitments.includes("Other") && (
        <div className="other-goal-box">
          <input
            type="text"
            placeholder="Tell Orbit about your commitment..."
            value={commitmentInput}
            onChange={(e) => setCommitmentInput(e.target.value)}
          />
          <button className="add-goal-btn" onClick={addCustomCommitment}>
            Add
          </button>
        </div>
         )}

        {commitments.includes("Other") &&
         customCommitments.length > 0 && (
          <div className="custom-habit-list">
            {customCommitments.map((commitment, index) => (
              <div key={index} className="goal-chip">
                {commitment}
              </div>
            ))}
          </div>
        )}


      </div> /*basic schedule onboardin card ends here */
      )}

      {step === 3 && (
       <div className="onboarding-card">

         <h3>Goals</h3>
         <p> Help Orbit understand what matters to you so it can build a routine that moves you closer to your goals. </p>

        <div className="section-divider"></div>
        <div className="schedule-header-row">
        <div className="schedule-question">
         <h4>1. What are you currently working toward?</h4>
         <p>Select all that apply.</p>
        </div>

        <div className="goal-grid">
          <div className={`goal-card ${selectedGoals.includes("Study") ? "selected" : ""}`}
           onClick={() => toggleGoal("Study")}>
            <FaBook className="goal-icon"/>
            <span>Study</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Fitness") ? "selected" : ""}`}
           onClick={() => toggleGoal("Fitness")}>
             <FaDumbbell className="goal-icon"/>
             <span>Fitness</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Skill Learning") ? "selected" : ""}`}
          onClick={() => toggleGoal("Skill Learning")}>
            <FaLaptopCode className="goal-icon"/>
            <span>Skill Learning</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Reading") ? "selected" : ""}`}
          onClick={() => toggleGoal("Reading")}>
           <FaBook className="goal-icon"/>
           <span>Reading</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Project") ? "selected" : ""}`}
          onClick={() => toggleGoal("Project")}>
           <FaRocket className="goal-icon"/>
           <span>Project</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Career") ? "selected" : ""}`}
          onClick={() => toggleGoal("Career")}>
           <FaBriefcase className="goal-icon"/>
           <span>Career</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Personal Growth") ? "selected" : ""}`}
          onClick={() => toggleGoal("Personal Growth")}>
           <FaSeedling className="goal-icon"/>
           <span>Personal Growth</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Mental Health") ? "selected" : ""}`}
          onClick={() => toggleGoal("Mental Health")}>
            <FaBrain className="goal-icon"/>
            <span>Mental Health</span>
          </div>

          <div className={`goal-card ${selectedGoals.includes("Other") ? "selected" : ""}`}
          onClick={() => toggleGoal("Other")}>
           <FaPlus className="goal-icon"/>
           <span>Other</span>
          </div>

        </div>
        </div>

        {selectedGoals.includes("Other") && (
         <div className="custom-goal-section">
          <div className="custom-goal-input-row">
           <input type="text" className="other-input"
             placeholder="Add a custom goal..."
             value={otherGoal}
             onChange={(e) => setOtherGoal(e.target.value)}/>

           <button className="add-goal-btn" onClick={addCustomGoal}>
           Add</button>

          </div>

          {customGoals.length > 0 && (
           <div className="custom-goals-list">
            {customGoals.map((goal, index) => (
             <div key={index} className="goal-chip">
              {goal}
             </div>
          ))}
           </div>
        )}
         </div>
       )}

       {allGoals.length > 1 && (
        <div className="priority-section">
        <div className="section-divider"></div>
        <div className="priority-box">
         <h4>Help Orbit understand what matters most</h4>
         <p>Rank your selected goals by importance.</p>

        {allGoals.map((goal) => (
         <div key={goal} className="priority-row">
         <div className="priority-goal">
           <span>{goal}</span>
         </div> 
         <select value={goalPriority[goal] || ""}
          onChange={(e) =>
          handlePriorityChange(goal, e.target.value)
        }>
           <option value="">Select</option>
           <option value="Highest">Highest</option>
           <option value="High">High</option>
           <option value="Medium">Medium</option>
           <option value="Low">Low</option>
          </select>

         </div>
        ))}

        <p className="priority-note">Highest priority goals will receive more focus in your routine.</p>

         </div>
         </div>
       )}
        
        <div className="section-divider"></div>

    <div className="goal-section-row">
       <div className="goal-question">
        <h4>2. How much time can you dedicate daily?</h4>
        <p> Be realistic. This helps Orbit build a realistic schedule! </p>
       </div>

        <div className="time-commitment-grid">

         <div className={`time-card ${dailyTime === "Less than 30 mins" ? "selected" : ""}`}
         onClick={() => setDailyTime("Less than 30 mins")}>
          <FaStopwatch className="time-icon"/>
          <span>Less than 30 mins</span>
         </div>

         <div className={`time-card ${dailyTime === "30 mins - 1 hr" ? "selected" : ""}`}
         onClick={() => setDailyTime("30 mins - 1 hr")}>
          <FaClock className="time-icon" />
          <span>30 mins - 1 hr</span>
         </div>

         <div className={`time-card ${dailyTime === "1 - 2 hrs" ? "selected" : ""}`}
         onClick={() => setDailyTime("1 - 2 hrs")}>
          <FaRegClock className="time-icon" />
          <span>1 - 2 hrs</span>
         </div>

         <div className={`time-card ${dailyTime === "2 - 4 hrs" ? "selected" : ""}`}
         onClick={() => setDailyTime("2 - 4 hrs")}>
          <FaHourglassHalf className="time-icon" />
          <span>2 - 4 hrs</span>
         </div>

         <div className={`time-card ${dailyTime === "4+ hrs" ? "selected" : ""}`}
         onClick={() => setDailyTime("4+ hrs")}>
          <FaRocket className="time-icon" />
          <span>4+ hrs</span>
         </div>

        </div> 
        </div>

        {/* {selectedGoals.includes("Other") && (
         <input type="text" className="other-input"
         placeholder="Tell Orbit about your goal..."
         value={otherGoal}
         onChange={(e) => setOtherGoal(e.target.value)}/>
        )} */}

        <div className="section-divider"></div>

       <div className="goal-section-row">

         <div className="schedule-question">
           <h4>3. Do you have a deadline for these goals?</h4>
           <p>
            This helps Orbit plan better around your timeline.
           </p>
         </div>

         <div className="deadline-grid">

           <div className={`deadline-card ${deadlineType === "none" ? "selected" : ""
           }`}
           onClick={() => setDeadlineType("none")}>
             <FaInfinity className="deadline-icon" />
             <span>No deadline</span>
           </div>

         <div className={`deadline-card ${deadlineType === "week" ? "selected" : ""
          }`}
          onClick={() => setDeadlineType("week")}>
            <FaCalendarWeek className="deadline-icon week" />
            <span>Within a week</span>
          </div>

         <div
          className={`deadline-card ${
          deadlineType === "month" ? "selected" : ""
         }`}
        onClick={() => setDeadlineType("month")}>
          <FaCalendarCheck className="deadline-icon month" />
          <span>Within a month</span>
        </div>

    <div
      className={`deadline-card ${
        deadlineType === "threeMonths" ? "selected" : ""
      }`}
      onClick={() => setDeadlineType("threeMonths")}
    >
      <FaCalendarAlt className="deadline-icon three-months" />
      <span>Within 3 months</span>
    </div>

    <div
      className={`deadline-card ${
        deadlineType === "custom" ? "selected" : ""
      }`}
      onClick={() => setDeadlineType("custom")}
    >
      <FaCalendarDay className="deadline-icon custom" />
      <span>Custom date</span>

      {deadlineType === "custom" && (
        <input
          type="date"
          value={customDeadline}
          onChange={(e) => setCustomDeadline(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="custom-date-input"
        />
      )}
    </div>

    </div>

   </div>

   <div className="section-divider"></div>

<div className="goal-section-row">

  <div className="schedule-question">
    <h4>4. What would success look like?</h4>

    <p>
      Imagine a few months from now. What would make you feel like you've achieved these goals?
    </p>
  </div>

  <div className="success-section">

    <textarea
      className="success-textarea"
      placeholder="Example: Score above 85% in exams, get fit and healthy, build my portfolio website..."
      value={successVision}
      onChange={(e) => setSuccessVision(e.target.value)}
      maxLength={300}
    />

    <div className="character-count">
      {successVision.length}/300

      <button
  className="save-btn"
  onClick={() => {
    localStorage.setItem(
      "orbitSuccessVision",
      successVision
    );
    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
    }, 2000);
  }}>
  {successSaved ? "✓ Saved" : "Save"}
</button>
    </div>

  </div>

</div>

       </div>
      ) } {/* goals onboarding card ends here. */}

      {step === 4 && (
        <div className="onboarding-card">

         <h3>Let's talk about your habits</h3>

         <p>Help Orbit understand the habits you already have and the ones you'd like to build.
         </p>

        <div className="section-divider"></div>

        <div className="goal-section-row">

  <div className="schedule-question">
    <h4>1. What habits would you like to focus on?</h4>
    <p>Select all that apply.</p>
  </div>

  <div className="habit-grid">

    <div
      className={`habit-card ${
        selectedHabits.includes("Study Consistently")
          ? "selected"
          : ""
      }`}
      onClick={() => toggleHabit("Study Consistently")}
    >
      <FaBook className="habit-icon study" />
      <span>Study Consistently</span>
    </div>

    <div
      className={`habit-card ${
        selectedHabits.includes("Drink More Water")
          ? "selected"
          : ""
      }`}
      onClick={() => toggleHabit("Drink More Water")}
    >
      <FaTint className="habit-icon water" />
      <span>Drink More Water</span>
    </div>

    <div
      className={`habit-card ${
        selectedHabits.includes("Exercise")
          ? "selected"
          : ""
      }`}
      onClick={() => toggleHabit("Exercise")}
    >
      <FaDumbbell className="habit-icon exercise" />
      <span>Exercise</span>
    </div>

    <div
      className={`habit-card ${
        selectedHabits.includes("Better Sleep")
          ? "selected"
          : ""
      }`}
      onClick={() => toggleHabit("Better Sleep")}
    >
      <FaMoon className="habit-icon sleep" />
      <span>Better Sleep</span>
    </div>

    <div
      className={`habit-card ${
        selectedHabits.includes("Reading")
          ? "selected"
          : ""
      }`}
      onClick={() => toggleHabit("Reading")}
    >
      <FaBookOpen className="habit-icon reading" />
      <span>Reading</span>
    </div>

    <div
      className={`habit-card ${
        selectedHabits.includes("Mindfulness")
          ? "selected"
          : ""
      }`}
      onClick={() => toggleHabit("Mindfulness")}
    >
      <FaSpa className="habit-icon mindfulness" />
      <span>Mindfulness</span>
    </div>

    <div
      className={`habit-card ${
        selectedHabits.includes("Healthy Eating")
          ? "selected"
          : ""
      }`}
      onClick={() => toggleHabit("Healthy Eating")}
    >
      <FaAppleAlt className="habit-icon food" />
      <span>Healthy Eating</span>
    </div>

    <div className={`habit-card ${
    selectedHabits.includes("Other")
      ? "selected"
      : ""
    }`}
    onClick={() => toggleHabit("Other")}>
     <FaPlus className="habit-icon" />
     <span>Other</span>
    </div>

  </div>

</div>

{selectedHabits.includes("Other") &&
 customHabits.length > 0 && (
  <div className="custom-habit-list">

    {customHabits.map((habit, index) => (
      <div
        key={index}
        className="goal-chip"
      >
        {habit}
      </div>
    ))}

  </div>
)}

{selectedHabits.includes("Other") && (
<div className="other-goal-box">

  <input
    type="text"
    placeholder="Type a habit..."
    value={habitInput}
    onChange={(e) =>
      setHabitInput(e.target.value)
    }/>

  <button
    className="add-goal-btn"
    onClick={addCustomHabit}
  >
    Add
  </button>

</div>
)}

       <div className="section-divider"></div>

<div className="goal-section-row">

  <div className="schedule-question">
    <h4>2. Are you trying to...</h4>
    <p>Select all that apply.</p>
  </div>

  <div className="habit-intent-grid">

    <div
      className={`intent-card ${
        habitIntent.includes("Build")
          ? "selected"
          : ""
      }`}
      onClick={() => toggleHabitIntent("Build")}
    >
      <FaPlus className="intent-icon" />
      <span>Build a New Habit</span>
    </div>

    <div
      className={`intent-card ${
        habitIntent.includes("Improve")
          ? "selected"
          : ""
      }`}
      onClick={() => toggleHabitIntent("Improve")}
    >
      <FaBolt className="intent-icon" />
      <span>Improve an Existing Habit</span>
    </div>

    <div
      className={`intent-card ${
        habitIntent.includes("Break")
          ? "selected"
          : ""
      }`}
      onClick={() => toggleHabitIntent("Break")}
    >
      <FaTimes className="intent-icon" />
      <span>Break a Bad Habit</span>
    </div>
    </div>
    </div>

       <div className="section-divider"></div>

<div className="goal-section-row">

  <div className="schedule-question">
    <h4>3. How often would you ideally like to do these habits?</h4>
    <p>Choose one option.</p>
  </div>

  <div className="time-commitment-grid">

    <div
      className={`time-card ${habitFrequency === "Every day" ? "selected" : ""}`}
      onClick={() => setHabitFrequency("Every day")}
    >
      <FaCalendarDay className="time-icon" />
      <span>Every day</span>
    </div>

    <div
      className={`time-card ${habitFrequency === "5-6 days/week" ? "selected" : ""}`}
      onClick={() => setHabitFrequency("5-6 days/week")}
    >
      <FaCalendarCheck className="time-icon" />
      <span>5-6 days/week</span>
    </div>

    <div
      className={`time-card ${habitFrequency === "3-4 days/week" ? "selected" : ""}`}
      onClick={() => setHabitFrequency("3-4 days/week")}
    >
      <FaCalendarWeek className="time-icon" />
      <span>3-4 days/week</span>
    </div>

    <div
      className={`time-card ${habitFrequency === "1-2 days/week" ? "selected" : ""}`}
      onClick={() => setHabitFrequency("1-2 days/week")}
    >
      <FaRegClock className="time-icon" />
      <span>1-2 days/week</span>
    </div>

    <div
      className={`time-card ${habitFrequency === "Flexible" ? "selected" : ""}`}
      onClick={() => setHabitFrequency("Flexible")}
    >
      <FaInfinity className="time-icon" />
      <span>Flexible</span>
    </div>

  </div>

</div>

       <div className="section-divider"></div>

<div className="goal-section-row">

  <div className="schedule-question">
    <h4>4. What usually gets in the way?</h4>
    <p>Select all that apply.</p>
  </div>

  <div className="habit-grid compact">

    <div className={`habit-card ${habitObstacles.includes("Lack of Time") ? "selected" : ""}`}
      onClick={() => toggleHabitObstacle("Lack of Time")}>
      <FaClock className="habit-icon" />
      <span>Lack of Time</span>
    </div>

    <div className={`habit-card ${habitObstacles.includes("Low Energy") ? "selected" : ""}`}
      onClick={() => toggleHabitObstacle("Low Energy")}>
      <FaBatteryHalf className="habit-icon" />
      <span>Low Energy</span>
    </div>

    <div className={`habit-card ${habitObstacles.includes("Distractions") ? "selected" : ""}`}
      onClick={() => toggleHabitObstacle("Distractions")}>
      <FaBell className="habit-icon" />
      <span>Distractions</span>
    </div>

    <div className={`habit-card ${habitObstacles.includes("Work / Studies") ? "selected" : ""}`}
      onClick={() => toggleHabitObstacle("Work / Studies")}>
      <FaBook className="habit-icon" />
      <span>Work / Studies</span>
    </div>

    <div className={`habit-card ${habitObstacles.includes("Family Responsibilities") ? "selected" : ""}`}
      onClick={() => toggleHabitObstacle("Family Responsibilities")}>
      <FaUsers className="habit-icon" />
      <span>Family Responsibilities</span>
    </div>

    <div className={`habit-card ${habitObstacles.includes("Forgetting") ? "selected" : ""}`}
      onClick={() => toggleHabitObstacle("Forgetting")}>
      <FaQuestionCircle className="habit-icon" />
      <span>Forgetting</span>
    </div>

    <div className={`habit-card ${habitObstacles.includes("Other") ? "selected" : ""}`}
      onClick={() => toggleHabitObstacle("Other")}>
      <FaPlus className="habit-icon" />
      <span>Other</span>
    </div>

  </div>

</div>

{habitObstacles.includes("Other") && (
<div className="other-goal-box">

  <input
    type="text"
    placeholder="Type what gets in the way..."
    value={habitObstacleInput}
    onChange={(e) => setHabitObstacleInput(e.target.value)}
  />

  <button className="add-goal-btn" onClick={addCustomHabitObstacle}>
    Add
  </button>

</div>
)}

{habitObstacles.includes("Other") &&
 customHabitObstacles.length > 0 && (
  <div className="custom-habit-list">
    {customHabitObstacles.map((obstacle, index) => (
      <div key={index} className="goal-chip">
        {obstacle}
      </div>
    ))}
  </div>
)}

       <div className="section-divider"></div>

<div className="goal-section-row">

  <div className="schedule-question">
    <h4>5. How would you like Orbit to help?</h4>
    <p>Select all that apply.</p>
  </div>

  <div className="habit-grid compact">

    <div className={`habit-card ${orbitHelp.includes("Reminders") ? "selected" : ""}`}
      onClick={() => toggleOrbitHelp("Reminders")}>
      <FaBell className="habit-icon" />
      <span>Reminders</span>
    </div>

    <div className={`habit-card ${orbitHelp.includes("Progress Tracking") ? "selected" : ""}`}
      onClick={() => toggleOrbitHelp("Progress Tracking")}>
      <FaTasks className="habit-icon" />
      <span>Progress Tracking</span>
    </div>

    <div className={`habit-card ${orbitHelp.includes("Daily Goals") ? "selected" : ""}`}
      onClick={() => toggleOrbitHelp("Daily Goals")}>
      <FaCheckCircle className="habit-icon" />
      <span>Daily Goals</span>
    </div>

    <div className={`habit-card ${orbitHelp.includes("Motivation") ? "selected" : ""}`}
      onClick={() => toggleOrbitHelp("Motivation")}>
      <FaBolt className="habit-icon" />
      <span>Motivation</span>
    </div>

    <div className={`habit-card ${orbitHelp.includes("Habit Scheduling") ? "selected" : ""}`}
      onClick={() => toggleOrbitHelp("Habit Scheduling")}>
      <FaCalendarAlt className="habit-icon" />
      <span>Habit Scheduling</span>
    </div>

    <div className={`habit-card ${orbitHelp.includes("Other") ? "selected" : ""}`}
      onClick={() => toggleOrbitHelp("Other")}>
      <FaPlus className="habit-icon" />
      <span>Other</span>
    </div>

  </div>

</div>

{orbitHelp.includes("Other") && (
<div className="other-goal-box">

  <input
    type="text"
    placeholder="Type how Orbit can help..."
    value={orbitHelpInput}
    onChange={(e) => setOrbitHelpInput(e.target.value)}
  />

  <button className="add-goal-btn" onClick={addCustomOrbitHelp}>
    Add
  </button>

</div>
)}

{orbitHelp.includes("Other") &&
 customOrbitHelp.length > 0 && (
  <div className="custom-habit-list">
    {customOrbitHelp.map((help, index) => (
      <div key={index} className="goal-chip">
        {help}
      </div>
    ))}
  </div>
)}

       </div>
      ) } {/* habits onboarding card ends here. */}

      {step === 5 && (
        <div className="onboarding-card priorities-card">
         <div className="priorities-header">
          <h3>Let's set your priorities</h3>
          <p>Help Orbit understand what challenges you face and how you want your routine to adapt.</p>
         </div>

         <div className="priorities-layout">

          <div className="priority-panel struggle-panel">
           <h4>1. What do you struggle with the most?</h4>
           <p>Select all that apply.</p>

           <div className="habit-grid compact">
            <div className={`habit-card ${priorityStruggles.includes("Consistency") ? "selected" : ""}`}
              onClick={() => togglePriorityStruggle("Consistency")}>
              <FaCheckCircle className="habit-icon" />
              <span>Consistency</span>
            </div>

            <div className={`habit-card ${priorityStruggles.includes("Procrastination") ? "selected" : ""}`}
              onClick={() => togglePriorityStruggle("Procrastination")}>
              <FaHourglassHalf className="habit-icon" />
              <span>Procrastination</span>
            </div>

            <div className={`habit-card ${priorityStruggles.includes("Time Management") ? "selected" : ""}`}
              onClick={() => togglePriorityStruggle("Time Management")}>
              <FaClock className="habit-icon" />
              <span>Time Management</span>
            </div>

            <div className={`habit-card ${priorityStruggles.includes("Distractions") ? "selected" : ""}`}
              onClick={() => togglePriorityStruggle("Distractions")}>
              <FaBell className="habit-icon" />
              <span>Distractions</span>
            </div>

            <div className={`habit-card ${priorityStruggles.includes("Burnout") ? "selected" : ""}`}
              onClick={() => togglePriorityStruggle("Burnout")}>
              <FaBatteryHalf className="habit-icon" />
              <span>Burnout</span>
            </div>

            <div className={`habit-card ${priorityStruggles.includes("Motivation") ? "selected" : ""}`}
              onClick={() => togglePriorityStruggle("Motivation")}>
              <FaMagic className="habit-icon" />
              <span>Motivation</span>
            </div>

            <div className={`habit-card ${priorityStruggles.includes("Overcommitment") ? "selected" : ""}`}
              onClick={() => togglePriorityStruggle("Overcommitment")}>
              <FaTasks className="habit-icon" />
              <span>Overcommitment</span>
            </div>

            <div className={`habit-card ${priorityStruggles.includes("Other") ? "selected" : ""}`}
              onClick={() => togglePriorityStruggle("Other")}>
              <FaPlus className="habit-icon" />
              <span>Other</span>
            </div>
           </div>

           {priorityStruggles.includes("Other") && (
            <div className="other-goal-box priority-other-box">
             <input
              type="text"
              placeholder="Type your challenge..."
              value={priorityStruggleInput}
              onChange={(e) => setPriorityStruggleInput(e.target.value)}
             />
             <button className="add-goal-btn" onClick={addCustomPriorityStruggle}>
              Add
             </button>
            </div>
           )}

           {priorityStruggles.includes("Other") &&
            customPriorityStruggles.length > 0 && (
             <div className="custom-habit-list">
              {customPriorityStruggles.map((struggle, index) => (
               <div key={index} className="goal-chip">
                {struggle}
               </div>
              ))}
             </div>
           )}
          </div>

          <div className="priorities-side">
           <div className="priority-panel">
            <h4>2. How structured do you want your routine?</h4>
            <p>Choose one option.</p>

            <div className="priority-option-grid">
             <div className={`priority-choice-card ${routineStructure === "Very Structured" ? "selected" : ""}`}
              onClick={() => setRoutineStructure("Very Structured")}>
              <FaCalendarAlt className="priority-choice-icon" />
              <span>Very Structured</span>
              <p>I want a strict plan to follow.</p>
             </div>

             <div className={`priority-choice-card ${routineStructure === "Balanced" ? "selected" : ""}`}
              onClick={() => setRoutineStructure("Balanced")}>
              <FaShieldAlt className="priority-choice-icon" />
              <span>Balanced</span>
              <p>I want structure with some flexibility.</p>
             </div>

             <div className={`priority-choice-card ${routineStructure === "Flexible" ? "selected" : ""}`}
              onClick={() => setRoutineStructure("Flexible")}>
              <FaInfinity className="priority-choice-icon" />
              <span>Flexible</span>
              <p>I prefer flexibility with general guidance.</p>
             </div>

             <div className={`priority-choice-card ${routineStructure === "Highly Adaptive" ? "selected" : ""}`}
              onClick={() => setRoutineStructure("Highly Adaptive")}>
              <FaMagic className="priority-choice-icon" />
              <span>Highly Adaptive</span>
              <p>I want Orbit to adapt as much as possible.</p>
             </div>
            </div>
           </div>

           <div className="priority-panel">
            <h4>3. What should Orbit do when plans change?</h4>
            <p>Choose one option.</p>

            <div className="priority-option-grid">
             <div className={`priority-choice-card ${planChangePreference === "Automatically Adjust" ? "selected" : ""}`}
              onClick={() => setPlanChangePreference("Automatically Adjust")}>
              <FaSyncAlt className="priority-choice-icon" />
              <span>Automatically Adjust</span>
             </div>

             <div className={`priority-choice-card ${planChangePreference === "Ask Before Changing" ? "selected" : ""}`}
              onClick={() => setPlanChangePreference("Ask Before Changing")}>
              <FaQuestionCircle className="priority-choice-icon" />
              <span>Ask Before Changing</span>
             </div>

             <div className={`priority-choice-card ${planChangePreference === "Only Suggest Changes" ? "selected" : ""}`}
              onClick={() => setPlanChangePreference("Only Suggest Changes")}>
              <FaLightbulb className="priority-choice-icon" />
              <span>Only Suggest Changes</span>
             </div>

             <div className={`priority-choice-card ${planChangePreference === "Never Change Without Permission" ? "selected" : ""}`}
              onClick={() => setPlanChangePreference("Never Change Without Permission")}>
              <FaShieldAlt className="priority-choice-icon" />
              <span>Never Change Without Permission</span>
             </div>
            </div>
           </div>
          </div>

         </div>

         <div className="priority-panel notes-panel">
          <h4>4. Anything else Orbit should know?</h4>
          <p>Optional notes</p>

          <textarea
           className="success-textarea priority-textarea"
           placeholder="Share anything that will help Orbit build a routine that truly works for you..."
           value={priorityNotes}
           onChange={(e) => setPriorityNotes(e.target.value)}
           maxLength={500}
          />

          <div className="textarea-footer">
  <span>{priorityNotes.length}/500</span>

  <button
    className="save-btn"
    onClick={() => {
      localStorage.setItem(
        "orbitPriorityNotes",
        priorityNotes
      );

      setNotesSaved(true);

      setTimeout(() => {
        setNotesSaved(false);
      }, 2000);
    }}
  >
    {notesSaved ? "✓ Saved" : "Save"}
  </button>
</div>

          <button className="generate-orbit-btn" onClick={generateOrbit}>
           <FaMagic />
           Generate My Orbit
          </button>
         </div>
        </div>
      ) } {/* priorities onboarding card ends here. */}

       <div className="navigation-row">

      <div className="back-container">
      {step > 1 && ( 
       <button className="back-btn" onClick={() => step > 1 && setStep(step - 1)}>
         Back
       </button> 
      )}
     </div>

     <div className="progress-section">
       <span className={`dot ${step >= 1 ? "active" : ""}`}></span>
       <span className={`dot ${step >= 2 ? "active" : ""}`}></span>
       <span className={`dot ${step >= 3 ? "active" : ""}`}></span>
       <span className={`dot ${step >= 4 ? "active" : ""}`}></span>
       <span className={`dot ${step >= 5 ? "active" : ""}`}></span>
     </div>

     <div className="next-container">
      <button className="next-btn" disabled={!selectedRole || step === 5} onClick={() => step < 5 && setStep(step + 1)}>
        Next
      </button>
     </div>

    </div> {/* navigation row ends here. */}

    </div>

    <OrbitQuestionModal
    isOpen={showQuestionModal}
    groupedQuestions={groupedQuestions}
    onClose={() => setShowQuestionModal(false)}
/>

  </div>
); 

}

export default RoutineBuilder;

      {/* <div className="builder-section">

       <h2>About You</h2>
       <p>Which option best describes you?</p>

      </div> 
      // abcd
      <div className="builder-section">
       <h2>Basic Schedule</h2>
       <div className="schedule-grid">

         <div className="input-group">
           <label>Wake Up Time</label>
           <input type="time" />
         </div>

         <div className="input-group">
           <label>Sleep Time</label>
           <input type="time" />
         </div>

         <div className="input-group">
           <label>College Start</label>
           <input type="time" />
         </div>

         <div className="input-group">
           <label>College End</label>
            <input type="time" />
         </div>

         <div className="input-group">
            <label>Travel Time (minutes)</label>
            <input type="number" />
         </div>

       </div>

      </div>

      <div className="builder-section">
       <h2>Goals</h2>
      </div>

      <div className="builder-section">
       <h2>Habits</h2>
      </div>

      <div className="builder-section">
       <h2>Priorities</h2>
      </div> */}
