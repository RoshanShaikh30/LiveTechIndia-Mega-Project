import { useState } from "react";
import RoutineBuilder from "./RoutineBuilder";
import Calendar from "./Calendar";
import "./App.css";
import orbitLogo from "./actual-logo.png";
import graphic1 from "./assets/graphic1.png";
import graphic2 from "./assets/graphic2.png";
import graphic3 from "./assets/graphic3.png";
import bg2 from "./assets/bg5.jpg";

function App() {
  const [activeTab, setActiveTab] = useState("Orbit");
  const [menuOpen, setMenuOpen] = useState(false);

  return (

    <div className="landing-page">

     <nav className="navbar">
      <div className="nav-logo">
        <img src={orbitLogo} alt="Orbit Logo" />
      </div>

      <ul className="nav-links">
        <li className={activeTab === "Orbit" ? "active" : ""}
        onClick={() => setActiveTab("Orbit")}>Orbit</li>

        <li className={activeTab === "RoutineBuilder" ? "active" : ""}
        onClick={() => setActiveTab("RoutineBuilder")}>Routine Builder</li>

        <li className={activeTab === "Calendar" ? "active" : ""}
        onClick={() => setActiveTab("Calendar")}> Calendar </li>
      </ul>
     <div className="menu-container">
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
      {menuOpen && (
       <div className="dropdown-menu">
        <p onClick={() => setActiveTab("Orbit")}>Orbit</p>
        <p onClick={() => setActiveTab("RoutineBuilder")}> Routine Builder
        </p>
        <p onClick={() => setActiveTab("Calendar")}>Calendar
        </p>
       </div>
      )}
     </div>
     </nav>

     {activeTab === "Orbit" && (
      <>
     <div className="hero">

      <div className="hero-left">

       <div className="intro">
        <h2>Introducing Orbit</h2>
        <p className="description"> Most planning tools expect life to go exactly as planned.
Orbit is designed to adapt alongside you.
It helps you create routines that adapt to changing schedules,
shifting priorities, and everyday disruptions, so you can spend
less time managing your plans and more time following them.</p>

        <div className="features">
        <ul className="features-list">
          <li>✦ Built for real-life changes</li>
          <li>✦ Keep routines on track</li>
          <li>✦ Adjust plans without starting over</li>
          <li>✦ Schedules that fit your lifestyle</li>
        </ul>
        </div>

       </div>

       {/* <div className="features">
        <ul className="features-list">
          <li>Built for real-life changes</li>
          <li>Keep routines on track</li>
          <li>Adjust plans without starting over</li>
          <li>Schedules that fit your lifestyle</li>
        </ul>

         <div className="features-graphics">
          <img src={graphic1} alt="Graphic 1" className="notebook" />
          <img src={graphic2} alt="Graphic 2" className="calendar" />
          <img src={graphic3} alt="Graphic 3" className="clip" />
        </div> 
       </div> */}

      </div> {/* End of hero-left */}

      <div className="divider"></div>

      <div className="hero-right">
        <img src={orbitLogo} alt="Orbit Logo" className="logo" />
        <h1 className="title">Orbit</h1>
        <p className="tagline"> Adaptive Routine & Schedule Manager </p>
        <p className="description">Plan smarter. Adapt automatically. Build routines that adjust to real life.</p>
        <button className="start-btn" onClick={() => setActiveTab("RoutineBuilder")}>
          Start Onboarding
        </button>
      </div>

     </div> 
     <footer className="footer">

      <div className="footer-left">
       <img src={orbitLogo} alt="Orbit Logo" />
       <h2>Orbit</h2>
       <p>Adaptive Routine & Schedule Manager</p>
       <p> Built for people whose schedules change frequently. </p>
       <p> Developed by Roshan Shaikh! </p>
      </div>

       <div className="footer-links">
        <h3>Project</h3>
        <p>Orbit</p>
        <p>Routine Builder</p>
        <p>Calendar</p>
       </div>

       <div className="footer-contact">
        <h3>Contact</h3>
        <a href="https://github.com/RoshanShaikh30"
        target="_blank"
        rel="noopener noreferrer"> <p>GitHub</p> </a>
        <a href="https://www.linkedin.com/in/roshan-shaikh-r14/"
        target="_blank"
        rel="noopener noreferrer"> <p>LinkedIn</p> </a>
        <a href="mailto:roshanrizwan1414@gmail.com"
        target="_blank"
        rel="noopener noreferrer"> <p>Email</p> </a>
       </div>
     </footer>
     </>)}

     {activeTab === "RoutineBuilder" && (
      <RoutineBuilder onComplete={() => setActiveTab("Calendar")}
      />)}
     {activeTab === "Calendar" && <Calendar />}

    </div>
  );
}

export default App;