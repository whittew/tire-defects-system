import React from 'react';
import Tooltip from './Tooltip';
import { ValidationStatus } from '../../types';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  tooltip?: string;
  error?: string;
  status?: ValidationStatus;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  unit,
  tooltip,
  error,
  status = 'none',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  const getStatusStyles = () => {
    switch (status) {
      case 'valid':
        return 'border-green-500 focus:ring-green-500 focus:border-green-500';
      case 'warning':
        return 'border-yellow-500 focus:ring-yellow-500 focus:border-yellow-500';
      case 'error':
        return 'border-red-500 focus:ring-red-500 focus:border-red-500';
      default:
        return 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    }
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        
        {status === 'valid' && (
          <span className="text-xs text-green-600">✓ Valid</span>
        )}
        
        {status === 'warning' && (
          <span className="text-xs text-yellow-600">⚠ Warning</span>
        )}
        
        {status === 'error' && (
          <span className="text-xs text-red-600">⚠ Invalid</span>
        )}
      </div>
      
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          id={inputId}
          className={`
            block w-full rounded-md sm:text-sm
            pr-${unit ? '10' : '3'} 
            ${getStatusStyles()}
            ${status === 'error' ? 'bg-red-50' : ''} 
            ${status === 'warning' ? 'bg-yellow-50' : ''}
            ${status === 'valid' ? 'bg-green-50' : ''}
          `}
          {...props}
        />
        
        {unit && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">{unit}</span>
          </div>
        )}
      </div>
      
      {tooltip && (
        <Tooltip content={tooltip} position="top">
          <div className="mt-1 text-xs text-blue-600 cursor-help flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-4 h-4 mr-1"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" 
                clipRule="evenodd" 
              />
            </svg>
            Learn more
          </div>
        </Tooltip>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default InputField;