import { generateMathQuestion } from "./questionGen";
import { useMathQuestion } from "./hooks/useMathQuestion";


export const MentalMath = () => {
    const {
      question,
      options,
      correctAnswer,
      selectedOption,
      timer,
      isAnswerRevealed,
      setSelectedOption,
      setIsAnswerRevealed,
      generateNewQuestion,
    } = useMathQuestion();
  
    const handleOptionClick = (option) => {
      setSelectedOption(option);
      if (option === correctAnswer) {
        setIsAnswerRevealed(true);
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
                style={{ fontWeight: "300", fontFamily: "var(--font-fam)" }}
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
          {isAnswerRevealed && (
            <button className="button-59" onClick={generateNewQuestion}>
              Next
            </button>
          )}
        </div>
      </div>
    );
  };