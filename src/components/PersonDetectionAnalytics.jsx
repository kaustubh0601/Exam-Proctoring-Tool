import React, { useState, useEffect } from 'react';

const PersonDetectionAnalytics = () => {
  const [detectionLogs, setDetectionLogs] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalDetections: 0,
    uniqueEvents: 0,
    averagePersonsPerDetection: 0,
    mostActiveTime: '',
    riskLevel: 'LOW'
  });

  useEffect(() => {
    const loadDetectionLogs = () => {
      const saved = localStorage.getItem('person_detection_logs');
      if (saved) {
        const logs = JSON.parse(saved);
        setDetectionLogs(logs);
        calculateAnalytics(logs);
      }
    };

    loadDetectionLogs();
    
    // Refresh analytics every 30 seconds
    const interval = setInterval(loadDetectionLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateAnalytics = (logs) => {
    if (logs.length === 0) return;

    const totalDetections = logs.length;
    const uniqueEvents = new Set(logs.map(log => log.event)).size;
    const averagePersons = logs.reduce((sum, log) => sum + log.personCount, 0) / totalDetections;
    
    // Find most active time (hour with most detections)
    const hourCounts = {};
    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const mostActiveHour = Object.keys(hourCounts).reduce((a, b) => 
      hourCounts[a] > hourCounts[b] ? a : b
    );
    
    // Calculate risk level
    let riskLevel = 'LOW';
    const multiPersonDetections = logs.filter(log => log.personCount > 1).length;
    const riskPercentage = (multiPersonDetections / totalDetections) * 100;
    
    if (riskPercentage > 50) riskLevel = 'HIGH';
    else if (riskPercentage > 20) riskLevel = 'MEDIUM';

    setAnalytics({
      totalDetections,
      uniqueEvents,
      averagePersonsPerDetection: Math.round(averagePersons * 100) / 100,
      mostActiveTime: `${mostActiveHour}:00`,
      riskLevel
    });
  };

  const clearLogs = () => {
    localStorage.removeItem('person_detection_logs');
    setDetectionLogs([]);
    setAnalytics({
      totalDetections: 0,
      uniqueEvents: 0,
      averagePersonsPerDetection: 0,
      mostActiveTime: '',
      riskLevel: 'LOW'
    });
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(detectionLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `person_detection_logs_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Person Detection Analytics</h3>
      
      {/* Analytics Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-sm text-blue-600">Total Detections</div>
          <div className="text-2xl font-bold text-blue-800">{analytics.totalDetections}</div>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <div className="text-sm text-green-600">Average Persons</div>
          <div className="text-2xl font-bold text-green-800">{analytics.averagePersonsPerDetection}</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded">
          <div className="text-sm text-yellow-600">Most Active Time</div>
          <div className="text-2xl font-bold text-yellow-800">{analytics.mostActiveTime}</div>
        </div>
        <div className={`p-3 rounded ${
          analytics.riskLevel === 'HIGH' ? 'bg-red-50' : 
          analytics.riskLevel === 'MEDIUM' ? 'bg-orange-50' : 'bg-green-50'
        }`}>
          <div className={`text-sm ${
            analytics.riskLevel === 'HIGH' ? 'text-red-600' : 
            analytics.riskLevel === 'MEDIUM' ? 'text-orange-600' : 'text-green-600'
          }`}>Risk Level</div>
          <div className={`text-2xl font-bold ${
            analytics.riskLevel === 'HIGH' ? 'text-red-800' : 
            analytics.riskLevel === 'MEDIUM' ? 'text-orange-800' : 'text-green-800'
          }`}>{analytics.riskLevel}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={exportLogs}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Export Logs
        </button>
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Clear Logs
        </button>
      </div>

      {/* Detection Logs */}
      <div className="max-h-64 overflow-y-auto">
        <h4 className="text-md font-medium mb-2">Recent Detection Events</h4>
        {detectionLogs.length === 0 ? (
          <p className="text-gray-500 text-sm">No detection events recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {detectionLogs.slice(-10).reverse().map((log, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-3 py-2 bg-gray-50 rounded-r">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm">{log.event}</div>
                    <div className="text-xs text-gray-600">{log.timestamp}</div>
                    <div className="text-xs text-gray-500">{log.details}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${
                      log.personCount > 1 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {log.personCount} person(s)
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonDetectionAnalytics; 