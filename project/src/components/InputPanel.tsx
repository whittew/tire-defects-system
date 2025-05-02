import React from 'react';
import { Parameter, Preset } from '../types';
import InputField from './ui/InputField';
import Button from './ui/Button';

import { validateParameter } from '../utils/validation';


interface InputPanelProps {
  parameters: Record<string, Parameter>;
  loading: boolean;
  onParameterChange: (id: string, value: number | '') => void;
  onAnalyze: () => void;
  onLoadPreset: (preset: Preset) => void;
  //isFormValid: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  parameters,
  loading,
  onParameterChange,
  onAnalyze,
  //isFormValid
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const value = e.target.value.trim();
    
    // Handle empty input
    if (value === '') {
      onParameterChange(id, '');
      return;
    }
    
    // Parse number input
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onParameterChange(id, numValue);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Vulcanization Parameters</h2>

      {Object.values(parameters).map(param => (
        <InputField
          key={param.id}
          label={param.name}
          unit={param.unit}
          tooltip={param.description}
          value={param.value.toString()}
          onChange={(e) => handleInputChange(e, param.id)}
          status={validateParameter(param)}
          min={param.min}
          max={param.max}
        />
      ))}

      <Button
        onClick={onAnalyze}
        isLoading={loading}
        // disabled={!isFormValid}
        className="w-full mt-4"
        size="lg"
      >
        Analyze Parameters
      </Button>

      {/*{!isFormValid && (*/}
      {/*  <p className="text-sm text-red-600 mt-2">*/}
      {/*    Please enter valid values for all parameters before analyzing.*/}
      {/*  </p>*/}
      {/*)}*/}
    </div>
  );
};

export default InputPanel;