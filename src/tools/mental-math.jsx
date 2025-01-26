import { useState, useEffect } from "react";

export const MentalMath = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(20);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const operators = ["+", "-", "*", "/"];

  const generateQuestion = () => {
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
        correct = parseFloat((num1 / num2).toFixed(2)); // Two decimal precision for division
        break;
      default:
        break;
    }

    setQuestion(`${num1} ${operator} ${num2} = ?`);
    setCorrectAnswer(correct);

    // Generate plausible incorrect options
    const variance = operator === "+" || operator === "-" ? 10 : 2;
    const incorrectOptions = Array.from({ length: 3 }, (_, i) =>
      (operator === "+" || operator === "-"
        ? correct + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * variance) + 1)
        : parseFloat((correct * (1 + (Math.random() < 0.5 ? -1 : 1) * 0.1)).toFixed(2))
      )
    );

    const allOptions = [correct, ...incorrectOptions].sort(() => Math.random() - 0.5);

    setOptions(allOptions);
    setTimer(20); // Reset timer
    setIsAnswerRevealed(false); // Reset reveal state
    setSelectedOption(null); // Reset selected option
  };

  useEffect(() => {
    generateQuestion();

    // Timer countdown
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

    if (option === correctAnswer) {
      setIsAnswerRevealed(true); // Reveal answer if correct
    }
  };

  return (
    <div className="flex">
      <div className="password">
        <h2>{question}</h2>
        <div className="grid">
          {options.map((option, index) => (
            <button
              key={index}
              className={`button-59 ${
                isAnswerRevealed && option === correctAnswer ? "win" : ""
              } ${
                selectedOption === option && option !== correctAnswer
                  ? "lose"
                  : ""
              }`}
              onClick={() => handleOptionClick(option)}
              disabled={!!selectedOption || isAnswerRevealed || timer === 0}
              style={{ fontWeight: "300", fontFamily: "var(--font-fam)" }} // Thinner font
            >
              {option}
            </button>
          ))}
        </div>
        <p>
          {isAnswerRevealed
            ? `The correct answer is ${correctAnswer}`
            : `Time remaining: ${timer}s`}
        </p>
      </div>
    </div>
  );
};
