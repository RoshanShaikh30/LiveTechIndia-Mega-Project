function DateInput({ onChange }) {

    return (
        <input
            type="date"
            onChange={(e) => onChange(e.target.value)}
        />
    );

}

export default DateInput;