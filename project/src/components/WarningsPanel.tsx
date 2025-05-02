import React from 'react';
import { ParameterWarning } from '../types';

interface WarningsPanelProps {
  warnings: ParameterWarning[];
}

const WarningsPanel: React.FC<WarningsPanelProps> = ({ warnings }) => {
  if (warnings.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-green-500" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">All parameters within acceptable ranges</h3>
            <p className="text-xs text-green-700 mt-1">
              No warnings or issues detected with the current parameter values.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const highSeverity = warnings.filter(w => w.severity === 'high');
  const mediumSeverity = warnings.filter(w => w.severity === 'medium');
  const lowSeverity = warnings.filter(w => w.severity === 'low');
  
  return (
    <div className="space-y-4">
      {highSeverity.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
          <h3 className="font-medium text-red-800 mb-2 flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            Critical Issues
          </h3>
          
          <ul className="space-y-3">
            {highSeverity.map((warning, index) => (
              <li key={`high-${index}`} className="text-sm">
                <p className="text-red-700">{warning.message}</p>
                <p className="text-red-600 font-medium mt-1">
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {mediumSeverity.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
          <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            Warnings
          </h3>
          
          <ul className="space-y-3">
            {mediumSeverity.map((warning, index) => (
              <li key={`medium-${index}`} className="text-sm">
                <p className="text-yellow-700">{warning.message}</p>
                <p className="text-yellow-600 mt-1">
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {lowSeverity.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" 
                clipRule="evenodd" 
              />
            </svg>
            Notes
          </h3>
          
          <ul className="space-y-3">
            {lowSeverity.map((warning, index) => (
              <li key={`low-${index}`} className="text-sm">
                <p className="text-blue-700">{warning.message}</p>
                <p className="text-blue-600 mt-1">
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WarningsPanel;