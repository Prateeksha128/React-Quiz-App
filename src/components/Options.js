import { useQuiz } from "../context/QuizContext";

function Options({ question }) {
  const { dispatch, selectedAnswer } = useQuiz();

  const hasAnswered = selectedAnswer !== null;

  return (
    <div className='options'>
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${
            index === selectedAnswer ? "answer" : ""
          } ${
            hasAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          } `}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
          key={option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
