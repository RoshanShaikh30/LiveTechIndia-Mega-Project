function OptionsList({

    options = [],

    selected,

    onSelect

}) {

    return (

        <div className="options-list">

            {options.map((option, index) => (

                <button

                    key={index}

                    type="button"

                    className={
                        selected === option
                            ? "option active"
                            : "option"
                    }

                    onClick={() => onSelect(option)}

                >

                    {option}

                </button>

            ))}

        </div>

    );

}

export default OptionsList;