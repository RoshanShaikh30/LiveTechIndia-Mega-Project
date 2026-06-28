import "./PriorityInput.css";

function PriorityInput({ onChange }) {

    const priorities = ["High", "Medium", "Low"];

    return (
        <div className="priority-options">

            {priorities.map((priority) => (
                <button
                    key={priority}
                    type="button"
                    onClick={() => onChange(priority)}
                >
                    {priority}
                </button>
            ))}

        </div>
    );

}

export default PriorityInput;