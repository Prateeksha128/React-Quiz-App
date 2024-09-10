function Progress({index, numQuestions, points, maxPoints, selectedAnswer}) {
    return (
      <header className='progress'>
        <progress max={numQuestions} value={index + (selectedAnswer!==null)} />
        <p>
          Question <strong>{index + 1}</strong> / {numQuestions}{" "}
        </p>
        <p>
           <strong>{points}</strong> / {maxPoints} points
        </p>
      </header>
    );
}

export default Progress
