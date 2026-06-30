// import "./PriorityInput.css";
import { useState } from "react";

function PriorityInput({ onChange }) {

    const [selected, setSelected] = useState("");

    const priorities = ["High", "Medium", "Low"];

    return (
        <div className="priority-options">

            {priorities.map((priority) => (
                <button
                    key={priority}
                    type="button"
                    className={selected === priority ? "selected" : ""}
                    onClick={() => {
                        setSelected(priority);
                        onChange(priority);
                    }}
                >
                    {priority}
                </button>
            ))}

        </div>
    );

}

export default PriorityInput;
