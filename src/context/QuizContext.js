import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const SEC_PER_QUESTION = 30;

const API_URL = process.env.REACT_APP_API_URL;

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
        questions: action.payload.questions,
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

function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, intialState);
  useEffect(function () {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log( Array.isArray(data));
        
        dispatch({ type: "dataReceived", payload: data });
      })
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  
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
  const maxPoints = 10;
  // const maxPoints = questions.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        selectedAnswer,
        points,
        highScore,
        secondsRemaining,
        numQuestions,
        maxPoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("Context was called out of context provider");
  return context;
}

export { QuizProvider, useQuiz };
