import React from 'react';

const questions = [
  {
    question: 'What is a React Hook?',
    options: [
      'A special function that lets you use state and other React features',
      'A CSS framework',
      'A type of component',
      'A JavaScript library',
    ],
  },
  {
    question: 'Which hook is used to manage state in a functional component?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
  },
  {
    question: 'What does useEffect do?',
    options: [
      'Performs side effects in function components',
      'Creates a new component',
      'Handles form validation',
      'Manages CSS styles',
    ],
  },
  {
    question: 'How do you pass data from parent to child component?',
    options: ['Using props', 'Using state', 'Using context', 'Using hooks'],
  },
  {
    question: 'What is JSX?',
    options: [
      'A syntax extension for JavaScript that looks similar to XML or HTML',
      'A type of CSS',
      'A database query language',
      'A React lifecycle method',
    ],
  },
];

const ExamQuestion = ({ questionIdx, setQuestionIdx, totalQuestions, answers, onAnswer }) => {
  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <div className="font-medium mb-2">Q{questionIdx + 1}. {questions[questionIdx].question}</div>
      <div className="flex flex-col gap-2 mb-4">
        {questions[questionIdx].options.map((option, idx) => (
          <label key={idx} className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition ${answers[questionIdx] === idx ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
            <input
              type="radio"
              name={`question-${questionIdx}`}
              checked={answers[questionIdx] === idx}
              onChange={() => onAnswer(questionIdx, idx)}
              className="accent-blue-600"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => setQuestionIdx((c) => Math.max(0, c - 1))}
          disabled={questionIdx === 0}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setQuestionIdx((c) => Math.min(totalQuestions - 1, c + 1))}
          disabled={questionIdx === totalQuestions - 1}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExamQuestion; 