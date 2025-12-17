import { useState, useEffect } from "react";
import { generateMathQuestion } from "../questionGen";

export const useMathQuestion = () => {
  const [questionData, setQuestionData] = useState(generateMathQuestion());
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(20);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  useEffect(() => {
    setTimer(20);
    setIsAnswerRevealed(false);
    setSelectedOption(null);
  }, [questionData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0) setIsAnswerRevealed(true);
  }, [timer]);

  const generateNewQuestion = () => setQuestionData(generateMathQuestion());

  return {
    ...questionData,
    selectedOption,
    timer,
    isAnswerRevealed,
    setSelectedOption,
    setIsAnswerRevealed,
    generateNewQuestion,
  };
};
