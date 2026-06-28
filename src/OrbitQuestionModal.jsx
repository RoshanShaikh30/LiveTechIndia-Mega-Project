import "./OrbitQuestionModal.css";
import { useState } from "react";

function OrbitQuestionModal({
  isOpen,
  groupedQuestions,
  onClose

}) {
  
  const [answers, setAnswers] = useState({});

  if (!isOpen) return null;

  return (


    <div className="orbit-modal-overlay">

      <div className="orbit-modal">

        <h2>Orbit AI</h2>

        <p>
          I need a little more information before I can build
          your personalized routine.
        </p>

        {groupedQuestions.map((group, index) => (

          <div
            key={index}
            className="activity-group"
          >

            <h3>{group.activity}</h3>

            {group.questions.map((question, i) => (

              <div
                key={i}
                className="question-card"
              >

                <label>

                  {question.question}

                </label>

                <p>

                  Input Type:

                  <strong>

                    {" "}
                    {question.input_type}

                  </strong>

                </p>

              </div>

            ))}

          </div>

        ))}

        <button onClick={onClose}>

          Close

        </button>

      </div>

    </div>

  );

}

export default OrbitQuestionModal;