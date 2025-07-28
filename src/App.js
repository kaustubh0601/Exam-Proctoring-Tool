import React, { useState } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import PermissionPage from './pages/PermissionPage.jsx';
import ExamPage from './pages/ExamPage.jsx';
import ResultPage from './pages/ResultPage.jsx';
// import useProctoring from './hooks/useProctoring';

function App() {
  const [page, setPage] = React.useState('login');
  const [username, setUsername] = React.useState('');
  const [terminated, setTerminated] = useState(false);

  // useProctoring(); // Proctoring is enabled globally for shortcut and right-click prevention

  const handleExamFinish = (wasTerminated = false) => {
    setTerminated(wasTerminated);
    setPage('result');
  };

  const renderPage = () => {
    switch (page) {
      case 'login':
        // return <LoginPage onLogin={(uname) => { setUsername(uname); setPage('exam'); }} />;
        return <LoginPage onLogin={(uname) => { setUsername(uname); setPage('permission'); }} />;
      case 'permission':
        return <PermissionPage onGranted={() => setPage('exam')} />;
      case 'exam':
        return <ExamPage onFinish={() => handleExamFinish(false)} onTerminate={() => handleExamFinish(true)} username={username} />;
      case 'result':
        return <ResultPage onRestart={() => { setUsername(''); setTerminated(false); setPage('login'); }} username={username} terminated={terminated} />;
      default:
        return <LoginPage onLogin={(uname) => { setUsername(uname); setPage('permission'); }} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-xl p-6 bg-white rounded shadow">
        {renderPage()}
      </div>
    </div>
  );
}

export default App; 