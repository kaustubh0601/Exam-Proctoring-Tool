import React, { useCallback, useState, useEffect } from 'react';
import WebcamFeed from '../components/WebcamFeed.jsx';
import PersonDetectionAnalytics from '../components/PersonDetectionAnalytics.jsx';
import DetectionSettings from '../components/DetectionSettings.jsx';
import ExamQuestion from '../components/ExamQuestion.jsx';
import useProctoring from '../hooks/useProctoring.js';
import ResultPage from './ResultPage.jsx';

const VIOLATION_LIMIT = 5;

const ExamPage = ({ onFinish, onTerminate }) => {
  const [toasts, setToasts] = useState([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [blurCount, setBlurCount] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const totalQuestions = 5;
  const [answers, setAnswers] = useState(Array(totalQuestions).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleTerminate = useCallback(() => {
    if (onTerminate) onTerminate();
  }, [onTerminate]);

  const { warnings } = useProctoring(handleTerminate, setTabSwitchCount, setBlurCount);

  useEffect(() => {
    if (warnings.length > 0) {
      const last = warnings[warnings.length - 1];
      setToasts((prev) => [...prev, last]);
      setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 6000);
    }
  }, [warnings]);

  const handleAnswer = (idx, value) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  if (showResult) {
    return <ResultPage answers={answers} onRestart={() => window.location.reload()} />;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-pink-100 overflow-x-hidden">
      {/* Progress Bar at Top */}
      <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden mt-0 shadow-inner fixed top-0 left-0 z-20">
        <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-300" style={{ width: `${((questionIdx + 1) / totalQuestions) * 100}%` }} />
      </div>
      {/* Webcam and Mic fixed in top left */}
      <div className="fixed top-6 left-6 z-30 flex flex-col items-center gap-4">
        <WebcamFeed />
        <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full animate-pulse text-base font-semibold shadow border border-green-200">
          <span className="w-3 h-3 rounded-full bg-green-400 animate-ping mr-2" />
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 14a3 3 0 003-3V5a3 3 0 10-6 0v6a3 3 0 003 3zm5-3a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 0014 0z" /></svg>
          <span className="font-bold">Mic is recording</span>
        </span>
        
        {/* Analytics Toggle Button */}
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors text-sm font-semibold shadow border border-blue-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
        </button>
        
        {/* Detection Settings */}
        <DetectionSettings />
      </div>
      {/* Main Content Row */}
      <div className="flex flex-1 items-center justify-center w-full h-full pt-16 pb-16">
        {/* Center: Question */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-8 text-center drop-shadow-lg tracking-tight">React Proctored Exam</h1>
          <ExamQuestion questionIdx={questionIdx} setQuestionIdx={setQuestionIdx} totalQuestions={totalQuestions} answers={answers} onAnswer={handleAnswer} />
        </div>
      </div>
      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="fixed top-6 right-6 z-30 w-80 max-h-[calc(100vh-3rem)] overflow-y-auto">
          <PersonDetectionAnalytics />
        </div>
      )}

      {/* Finish Button at Bottom Right */}
      <div className="fixed bottom-8 right-8 z-30">
        <button
          onClick={() => setShowResult(true)}
          className="bg-gradient-to-r from-green-400 via-green-500 to-green-700 text-white py-3 px-10 rounded-2xl font-extrabold shadow-xl hover:scale-105 hover:from-green-500 hover:to-green-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 border border-green-300 text-lg"
        >
          Finish Exam
        </button>
      </div>
      {/* Toasts as floating banners (right side) */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50 flex flex-col gap-4 items-end">
        {toasts.map((msg, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-white/80 backdrop-blur-lg border border-red-300 text-red-800 px-6 py-4 rounded-2xl shadow-2xl animate-slide-in-right font-semibold text-base drop-shadow-lg"
            style={{ minWidth: '320px', fontWeight: 600, letterSpacing: '0.01em' }}
          >
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamPage; 