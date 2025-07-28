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
    answer: 0,
  },
  {
    question: 'Which hook is used to manage state in a functional component?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    answer: 0,
  },
  {
    question: 'What does useEffect do?',
    options: [
      'Performs side effects in function components',
      'Creates a new component',
      'Handles form validation',
      'Manages CSS styles',
    ],
    answer: 0,
  },
  {
    question: 'How do you pass data from parent to child component?',
    options: ['Using props', 'Using state', 'Using context', 'Using hooks'],
    answer: 0,
  },
  {
    question: 'What is JSX?',
    options: [
      'A syntax extension for JavaScript that looks similar to XML or HTML',
      'A type of CSS',
      'A database query language',
      'A React lifecycle method',
    ],
    answer: 0,
  },
];

const ResultPage = ({ onRestart, username, terminated, answers = [] }) => {
  // Calculate score
  const score = answers.reduce((acc, ans, idx) =>
    ans === questions[idx].answer ? acc + 1 : acc, 0
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {terminated ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded text-center">
          <strong>Exam Terminated:</strong> Your exam was automatically ended due to repeated tab switching or window blur. Please contact your instructor if you believe this was a mistake.
        </div>
      ) : (
        <h2 className="text-xl font-semibold text-green-700">Thank you for completing the exam!</h2>
      )}
      <div className="text-lg">Your Score: <span className="font-bold">{score}</span> / {questions.length}</div>
      <button
        onClick={onRestart}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Restart Exam
      </button>
    </div>
  );
};

export default ResultPage; 