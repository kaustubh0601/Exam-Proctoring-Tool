import React from 'react';

const ProctoringOverlay = ({ warnings = [] }) => {    // for display the warnings.
  if (!warnings.length) return null;

  return (
    <div className="mb-2">
      {warnings.map((warning, idx) => (
        <div
          key={idx}
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-1 rounded shadow-sm text-sm"
        >
          {warning}
        </div>
      ))}
    </div>
  );
};

export default ProctoringOverlay; 