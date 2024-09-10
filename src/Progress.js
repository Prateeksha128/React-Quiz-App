import { useQuiz } from "./context/QuizContext";

function Progress() {
  const { index, numQuestions, points, maxPoints, selectedAnswer } = useQuiz();
  return (
    <header className='progress'>
      <progress max={numQuestions} value={index + (selectedAnswer !== null)} />
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}{" "}
      </p>
      <p>
        <strong>{points}</strong> / {maxPoints} points
      </p>
    </header>
  );
}

export default Progress;
