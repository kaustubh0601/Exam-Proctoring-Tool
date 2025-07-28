import React, { useState } from 'react';

const PermissionPage = ({ onGranted }) => {
  const [cameraGranted, setCameraGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);
  const [fullscreenGranted, setFullscreenGranted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleCamera = async () => {
    setError('');
    setLoading('camera');
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraGranted(true);
    } catch (err) {
      setError('Please allow camera access.');
    }
    setLoading('');
  };

  const handleMic = async () => {
    setError('');
    setLoading('mic');
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicGranted(true);
    } catch (err) {
      setError('Please allow microphone access.');
    }
    setLoading('');
  };

  const handleFullscreen = async () => {
    setError('');
    setLoading('fullscreen');
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      setFullscreenGranted(true);
    } catch (err) {
      setError('Please allow fullscreen mode.');
    }
    setLoading('');
  };

  const allGranted = cameraGranted && micGranted && fullscreenGranted;

  const handleStartExam = () => {
    if (!allGranted) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }
    onGranted();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-lg font-semibold">Exam Proctoring Permissions</h2>
      <div className="w-full max-w-md bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-3 rounded mb-2 text-sm">
        <strong>How to grant permissions:</strong>
        <ol className="list-decimal list-inside mt-1">
          <li>Click each button below to grant <span className="font-semibold">camera</span>, <span className="font-semibold">microphone</span>, and <span className="font-semibold">fullscreen</span> permissions.</li>
          <li>When prompted by your browser, click <span className="font-semibold">Allow</span> or <span className="font-semibold">OK</span>.</li>
          <li>If you accidentally block a permission, look for a camera/mic icon in your browser bar to re-enable it.</li>
        </ol>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={handleCamera}
          disabled={cameraGranted || loading === 'camera'}
          className={`py-2 px-4 rounded transition ${cameraGranted ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'} disabled:opacity-50`}
        >
          {cameraGranted ? 'Camera Granted' : loading === 'camera' ? 'Requesting Camera...' : 'Grant Camera Permission'}
        </button>
        <button
          onClick={handleMic}
          disabled={micGranted || loading === 'mic'}
          className={`py-2 px-4 rounded transition ${micGranted ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'} disabled:opacity-50`}
        >
          {micGranted ? 'Mic Granted' : loading === 'mic' ? 'Requesting Mic...' : 'Grant Mic Permission'}
        </button>
        <button
          onClick={handleFullscreen}
          disabled={fullscreenGranted || loading === 'fullscreen'}
          className={`py-2 px-4 rounded transition ${fullscreenGranted ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'} disabled:opacity-50`}
        >
          {fullscreenGranted ? 'Fullscreen Granted' : loading === 'fullscreen' ? 'Requesting Fullscreen...' : 'Grant Fullscreen Permission'}
        </button>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        onClick={handleStartExam}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition mt-2"
      >
        Start Exam
      </button>
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
          Please grant all permissions to start the exam.
        </div>
      )}
    </div>
  );
};

export default PermissionPage; 