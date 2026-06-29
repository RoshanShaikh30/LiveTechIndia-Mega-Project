function TimeInput({ onChange }) {

    return (

        <input
            type="time"
            onChange={(e) => onChange(e.target.value)}
        />

    );

}

export default TimeInput;