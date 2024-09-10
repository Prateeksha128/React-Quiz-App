import { useQuiz } from "../context/QuizContext";

function FinishScreen() {
  const { points, maxPoints, highScore, dispatch } = useQuiz();
  const scorePercentage = (points / maxPoints) * 100;

  let emoji;

  if (scorePercentage === 100) {
    emoji = "🥇";
  } else if (scorePercentage >= 90) {
    emoji = "🥈";
  } else if (scorePercentage >= 75) {
    emoji = "🥉";
  } else if (scorePercentage >= 50) {
    emoji = "😀";
  } else if (scorePercentage >= 30) {
    emoji = "😐";
  } else if (scorePercentage >= 1) {
    emoji = "☹️";
  } else {
    emoji = "👎";
  }

  return (
    <>
      <p className='result'>
        {emoji} You scored <strong>{points} </strong> out of {maxPoints} points
        ({Math.ceil(scorePercentage)}%)
      </p>

      <p className='highscore'>(Highscore : {highScore} points)</p>

      <button
        className='btn btn-ui'
        onClick={() => dispatch({ type: "restartQuiz" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
