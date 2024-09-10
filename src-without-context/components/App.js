import { useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import { useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "../Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SEC_PER_QUESTION = 30;

const API_URL = process.env.API_URL;

const intialState = {
  questions: [],

  // loading, ready, active, finished, error
  status: "loading",
  index: 0,
  selectedAnswer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        secondsRemaining: state.questions.length * SEC_PER_QUESTION,
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        selectedAnswer: action.payload,
        points:
          question.correctOption === action.payload
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        selectedAnswer: null,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highScore: Math.max(state.highScore, state.points),
      };

    case "restartQuiz":
      return {
        ...intialState,
        status: "ready",
        questions: state.questions,
        secondsRemaining: state.questions.length * SEC_PER_QUESTION,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
        highScore: Math.max(state.highScore, state.points),
      };

    default:
      return "Unknown Action";
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, intialState);

  const {
    questions,
    status,
    index,
    selectedAnswer,
    points,
    highScore,
    secondsRemaining,
  } = state;
  const numQuestions = questions.length;
  const maxPoints = questions.reduce((acc, curr) => acc + curr.points, 0);

  useEffect(function () {
    // fetch("http://localhost:9000/questions")
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className='app'>
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              selectedAnswer={selectedAnswer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              selectedAnswer={selectedAnswer}
            />
            <Footer>
              <NextButton
                dispatch={dispatch}
                selectedAnswer={selectedAnswer}
                index={index}
                numQuestions={numQuestions}
              />
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
