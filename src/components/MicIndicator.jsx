import React, { useEffect, useRef, useState } from 'react';

const MicIndicator = () => {
  const [error, setError] = useState('');
  const [active, setActive] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    let stream;
    const getMic = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });    // access the mic of browser
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();     // anaylser node. anatlis time and frep data
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        const checkMic = () => {
          analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
          // If the waveform is not flat, audio is detected
          const isActive = dataArrayRef.current.some(v => Math.abs(v - 128) > 10);
          setActive(isActive);
          rafIdRef.current = requestAnimationFrame(checkMic);
        };
        checkMic();
      } catch (err) {
        setError('Unable to access microphone. Please allow mic access.');
      }
    };
    getMic();
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-medium mb-1">Mic</span>
      {error ? (
        <div className="text-red-500 text-xs w-20 h-8 flex items-center justify-center border border-red-300 rounded bg-red-50">
          {error}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* Mic icon */}
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19v2m0 0h-3m3 0h3m-3-2a7 7 0 01-7-7m14 0a7 7 0 01-7 7m0-7v-5a3 3 0 016 0v5a3 3 0 01-6 0z" />
          </svg>
          {/* Status dot */}
          <span className={`w-3 h-3 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        </div>
      )}
    </div>
  );
};

export default MicIndicator; 