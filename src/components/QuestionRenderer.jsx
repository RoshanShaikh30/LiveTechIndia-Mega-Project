import DurationInput from "./inputs/DurationInput";
import TimePreferenceInput from "./inputs/TimePreferenceInput";
import PriorityInput from "./inputs/PriorityInput";
import DateInput from "./inputs/DateInput";
import DaysInput from "./inputs/DaysInput";

function QuestionRenderer({ question }) {

    switch (question.input_type) {

        case "duration":
            return <DurationInput question={question} />;

        case "time_preference":
            return <TimePreferenceInput question={question} />;

        case "priority":
            return <PriorityInput question={question} />;

        case "date":
            return <DateInput question={question} />;

        case "days":
            return <DaysInput question={question} />;

        default:

            return (

                <p>

                    Unsupported input type.

                </p>

            );

    }

}

export default QuestionRenderer;