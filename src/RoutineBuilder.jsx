import "./App.css";
import { useState } from "react";

function RoutineBuilder() {
  const [selectedRole, setSelectedRole] = useState("");
  return (
    <div className="routine-builder">
      <h2 className="build-your-orbit">Build Your Orbit</h2>
      <p>
        Tell Orbit about your schedule, goals, and habits so it can create a routine that adapts to your life.
      </p>

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
          Student
        </div>

        <div className={`choice-card ${selectedRole === "Working Professional" ? "selected" : ""}`}
        onClick={() => setSelectedRole("Working Professional")}>
          Working Professional
        </div>

        <div className={`choice-card ${selectedRole === "Freelancer" ? "selected" : ""}`}
        onClick={() => setSelectedRole("Freelancer")}>
          Freelancer
        </div>

       <div className={`choice-card ${selectedRole === "Homemaker" ? "selected" : ""}`}
        onClick={() => setSelectedRole("Homemaker")}>
          Homemaker
       </div>

       <div className={`choice-card other-card ${selectedRole === "Other" ? "selected" : ""}`}
  onClick={() => setSelectedRole("Other")}>
          Other
       </div>

      </div> {/* choice grid ends here. */}

     </div> {/* onboarding card ends here. */}
     <div className="progress-section"> 
       <span className="dot active"></span>
       <span className="dot"></span>
       <span className="dot"></span>
       <span className="dot"></span>
       <span className="dot"></span>
     </div>
     <div className="next-container">
      <button className="next-btn">
        Next
      </button>
     </div>
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
