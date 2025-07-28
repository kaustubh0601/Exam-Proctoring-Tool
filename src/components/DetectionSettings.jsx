import React, { useState, useEffect } from 'react';

const DetectionSettings = () => {
  const [settings, setSettings] = useState({
    detectionInterval: 2000,
    alertDuration: 5000,
    enableSoundAlerts: true,
    enableVisualAlerts: true,
    sensitivityThreshold: 0.7
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('detection_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('detection_settings', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    const defaultSettings = {
      detectionInterval: 2000,
      alertDuration: 5000,
      enableSoundAlerts: true,
      enableVisualAlerts: true,
      sensitivityThreshold: 0.7
    };
    setSettings(defaultSettings);
    localStorage.setItem('detection_settings', JSON.stringify(defaultSettings));
  };

  return (
    <div className="relative">
      {/* Settings Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors text-sm font-medium shadow border border-gray-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <h3 className="text-lg font-semibold mb-4">Detection Settings</h3>
          
          <div className="space-y-4">
            {/* Detection Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detection Interval: {settings.detectionInterval}ms
              </label>
              <input
                type="range"
                min="1000"
                max="5000"
                step="500"
                value={settings.detectionInterval}
                onChange={(e) => updateSetting('detectionInterval', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1s</span>
                <span>5s</span>
              </div>
            </div>

            {/* Alert Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Duration: {settings.alertDuration}ms
              </label>
              <input
                type="range"
                min="2000"
                max="10000"
                step="1000"
                value={settings.alertDuration}
                onChange={(e) => updateSetting('alertDuration', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2s</span>
                <span>10s</span>
              </div>
            </div>

            {/* Sensitivity Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sensitivity: {Math.round(settings.sensitivityThreshold * 100)}%
              </label>
              <input
                type="range"
                min="0.3"
                max="0.9"
                step="0.1"
                value={settings.sensitivityThreshold}
                onChange={(e) => updateSetting('sensitivityThreshold', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>30%</span>
                <span>90%</span>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Sound Alerts</label>
                <button
                  onClick={() => updateSetting('enableSoundAlerts', !settings.enableSoundAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableSoundAlerts ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableSoundAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Visual Alerts</label>
                <button
                  onClick={() => updateSetting('enableVisualAlerts', !settings.enableVisualAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableVisualAlerts ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.enableVisualAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={resetSettings}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectionSettings; 