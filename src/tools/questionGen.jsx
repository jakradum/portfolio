import { useState, useEffect } from "react";

// Function to generate a single math question
export const generateMathQuestion = () => {
  const operators = ["+", "-", "*", "/"];
  const num1 = Math.floor(Math.random() * 100) + 1;
  const num2 = Math.floor(Math.random() * 100) + 1;
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let correct;
  switch (operator) {
    case "+":
      correct = num1 + num2;
      break;
    case "-":
      correct = num1 - num2;
      break;
    case "*":
      correct = num1 * num2;
      break;
    case "/":
      correct = parseFloat((num1 / num2).toFixed(2)); // Two decimal precision
      break;
    default:
      correct = 0;
  }

  // Generate incorrect options
  const variance = operator === "+" || operator === "-" ? 10 : 2;
  const incorrectOptions = new Set();

  while (incorrectOptions.size < 3) {
    const incorrect =
      operator === "+" || operator === "-"
        ? correct + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * variance) + 1)
        : parseFloat((correct * (1 + (Math.random() < 0.5 ? -1 : 1) * 0.1)).toFixed(2));

    if (incorrect !== correct) incorrectOptions.add(incorrect);
  }

  return {
    question: `${num1} ${operator} ${num2} = ?`,
    correctAnswer: correct,
    options: [correct, ...Array.from(incorrectOptions)].sort(() => Math.random() - 0.5),
  };
};

// Component to generate and store a set of 10 questions
export const QuestionSetGenerator = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timer, setTimer] = useState(20);

  useEffect(() => {
    const generatedQuestions = Array.from({ length: 10 }, () => generateMathQuestion());
    setQuestions(generatedQuestions);
    console.log("Generated Question Set:", generatedQuestions);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setIsAnswerRevealed(true);
    }
  }, [timer]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === questions[currentQuestionIndex].correctAnswer) {
      setIsAnswerRevealed(true);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setTimer(20);
    }
  };

  if (questions.length === 0) return <p>Loading questions...</p>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex">
      <div className="password">
        <h2>{currentQuestion.question}</h2>
        <div className="grid">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`button-59 ${
                isAnswerRevealed && option === currentQuestion.correctAnswer ? "win" : ""
              } ${
                selectedOption === option && option !== currentQuestion.correctAnswer
                  ? "lose"
                  : ""
              }`}
              onClick={() => handleOptionClick(option)}
              disabled={!!selectedOption || isAnswerRevealed || timer === 0}
              style={{ fontWeight: "300", fontFamily: "var(--font-fam)" }}
            >
              {option}
            </button>
          ))}
        </div>
        <p>
          {isAnswerRevealed
            ? `The correct answer is ${currentQuestion.correctAnswer}`
            : `Time remaining: ${timer}s`}
        </p>
        {isAnswerRevealed && currentQuestionIndex < questions.length - 1 && (
          <button className="button-59" onClick={handleNext}>
            Next
          </button>
        )}
        {currentQuestionIndex === questions.length - 1 && isAnswerRevealed && (
          <p>All questions completed!</p>
        )}
      </div>
    </div>
  );
};
