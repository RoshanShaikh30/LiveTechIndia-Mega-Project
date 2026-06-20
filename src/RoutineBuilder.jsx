import "./App.css";

function RoutineBuilder() {
  return (
    <div class="routine-builder">
      <h1>Build Your Orbit</h1>
      <p>
        Tell Orbit about your schedule, goals, and habits so it can create a routine that adapts to your life.
      </p>
      <div className="builder-section">
       <h2>Basic Schedule</h2>
      </div>

      <div className="builder-section">
       <h2>Goals</h2>
      </div>

      <div className="builder-section">
       <h2>Habits</h2>
      </div>

      <div className="builder-section">
       <h2>Priorities</h2>
      </div>
    </div>
  );
}

export default RoutineBuilder;