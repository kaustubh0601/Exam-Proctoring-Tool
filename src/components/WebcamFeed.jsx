import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const SNAPSHOT_INTERVAL = 10000; // 10 seconds
const SNAPSHOT_KEY = 'exam_snapshots';
const MAX_SNAPSHOTS = 8;
const DETECTION_INTERVAL = 2000; // 2 seconds for person detection
const PERSON_DETECTION_KEY = 'person_detection_logs';

const WebcamFeed = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');
  const [snapshots, setSnapshots] = useState([]);
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [detectionResults, setDetectionResults] = useState([]);
  const [personCount, setPersonCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const intervalRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const previousPersonCount = useRef(0);

  // Load snapshots and detection logs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(SNAPSHOT_KEY);
    if (saved) {
      setSnapshots(JSON.parse(saved));
    }
    
    const savedDetections = localStorage.getItem(PERSON_DETECTION_KEY);
    if (savedDetections) {
      setDetectionResults(JSON.parse(savedDetections));
    }
  }, []);

  // Load TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsModelLoading(true);
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setIsModelLoading(false);
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Failed to load person detection model');
        setIsModelLoading(false);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    let stream;
    const getWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Unable to access webcam. Please allow camera access.');
      }
    };
    getWebcam();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Person detection function
  const detectPersons = async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    try {
      // Get current settings
      const savedSettings = localStorage.getItem('detection_settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {
        detectionInterval: 2000,
        alertDuration: 5000,
        enableSoundAlerts: true,
        enableVisualAlerts: true,
        sensitivityThreshold: 0.7
      };

      const predictions = await model.detect(videoRef.current);
      const persons = predictions.filter(pred => 
        pred.class === 'person' && pred.score >= settings.sensitivityThreshold
      );
      const currentPersonCount = persons.length;
      
      setPersonCount(currentPersonCount);

      // Check if person count changed
      if (currentPersonCount > previousPersonCount.current && previousPersonCount.current > 0) {
        const timestamp = new Date().toLocaleString();
        const detectionLog = {
          timestamp,
          event: 'PERSON_ENTERED',
          personCount: currentPersonCount,
          previousCount: previousPersonCount.current,
          details: `Detected ${currentPersonCount} person(s) - Someone entered the frame`
        };
        
        setDetectionResults(prev => {
          const updated = [...prev, detectionLog];
          localStorage.setItem(PERSON_DETECTION_KEY, JSON.stringify(updated));
          return updated;
        });

        // Show alert if visual alerts are enabled
        if (settings.enableVisualAlerts) {
          setAlertMessage(`⚠️ WARNING: ${currentPersonCount - previousPersonCount.current} additional person(s) detected!`);
          setIsAlertVisible(true);
          
          // Hide alert after configured duration
          setTimeout(() => {
            setIsAlertVisible(false);
          }, settings.alertDuration);
        }

        // Play sound alert if enabled
        if (settings.enableSoundAlerts) {
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.play().catch(e => console.log('Audio play failed:', e));
          } catch (e) {
            console.log('Audio creation failed:', e);
          }
        }
      }

      previousPersonCount.current = currentPersonCount;

      // Draw detection boxes on canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      persons.forEach(person => {
        const [x, y, width, height] = person.bbox;
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        ctx.fillStyle = '#FF0000';
        ctx.fillText(`Person (${Math.round(person.score * 100)}%)`, x, y - 5);
      });

    } catch (err) {
      console.error('Detection error:', err);
    }
  };

  // Start person detection when model is loaded
  useEffect(() => {
    if (!model || !videoRef.current) return;

    const startDetection = () => {
      const savedSettings = localStorage.getItem('detection_settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {
        detectionInterval: 2000,
        alertDuration: 5000,
        enableSoundAlerts: true,
        enableVisualAlerts: true,
        sensitivityThreshold: 0.7
      };

      detectionIntervalRef.current = setInterval(detectPersons, settings.detectionInterval);
    };

    startDetection();
    
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [model]);

  // Take a snapshot every SNAPSHOT_INTERVAL ms and save to localStorage
  useEffect(() => {
    if (!videoRef.current) return;
    intervalRef.current = setInterval(() => {
      if (!videoRef.current) return;
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setSnapshots(prev => {
        let updated;
        if (prev.length >= MAX_SNAPSHOTS) {
          updated = [dataUrl];
        } else {
          updated = [...prev, dataUrl];
        }
        localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(updated));
        return updated;
      });
    }, SNAPSHOT_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-medium mb-1">Webcam with Person Detection</span>
      
      {/* Alert Message */}
      {isAlertVisible && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2 animate-pulse">
          {alertMessage}
        </div>
      )}

      {/* Person Count Display */}
      <div className="text-sm mb-2">
        <span className={`font-bold ${personCount > 1 ? 'text-red-600' : 'text-green-600'}`}>
          Persons detected: {personCount}
        </span>
        {isModelLoading && <span className="text-gray-500 ml-2">(Loading model...)</span>}
      </div>

      {error ? (
        <div className="text-red-500 text-xs w-32 h-24 flex items-center justify-center border border-red-300 rounded bg-red-50">
          {error}
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-32 h-24 rounded border border-gray-300 bg-black object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-32 h-24 pointer-events-none"
            width="128"
            height="96"
          />
        </div>
      )}

      {/* Snapshots Thumbnails */}
      {snapshots.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 max-w-xs">
          {snapshots.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Snapshot ${idx + 1}`}
              className="w-10 h-8 object-cover rounded border"
            />
          ))}
        </div>
      )}
      
      {snapshots.length > 0 && (
        <div className="text-xs text-gray-500 mt-1">Snapshots taken: {snapshots.length}</div>
      )}

      {/* Detection Log */}
      {detectionResults.length > 0 && (
        <div className="mt-4 w-full max-w-xs">
          <h4 className="text-sm font-medium mb-2">Detection Log:</h4>
          <div className="max-h-32 overflow-y-auto text-xs">
            {detectionResults.slice(-5).map((log, idx) => (
              <div key={idx} className="mb-1 p-1 bg-gray-50 rounded">
                <div className="font-medium">{log.event}</div>
                <div className="text-gray-600">{log.timestamp}</div>
                <div className="text-gray-500">{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamFeed; 