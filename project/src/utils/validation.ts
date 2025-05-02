import { Parameter, ParameterWarning, ValidationStatus } from '../types';

export function validateParameter(parameter: Parameter): ValidationStatus {
  if (parameter.value === '') return 'none';
  
  const value = Number(parameter.value);
  
  if (isNaN(value)) return 'error';
  if (value < parameter.min || value > parameter.max) return 'error';
  
  // Warning thresholds - 5% from the boundaries
  const warningLow = parameter.min + (parameter.max - parameter.min) * 0.05;
  const warningHigh = parameter.max - (parameter.max - parameter.min) * 0.05;
  
  if (value <= warningLow || value >= warningHigh) return 'warning';
  
  return 'valid';
}

export function generateWarnings(parameters: Record<string, Parameter>): ParameterWarning[] {
  const warnings: ParameterWarning[] = [];
  
  Object.values(parameters).forEach(param => {
    const status = validateParameter(param);
    const value = Number(param.value);
    
    if (status === 'error' && !isNaN(value)) {
      let severity: 'low' | 'medium' | 'high' = 'medium';
      let message = '';

      if (value < param.min) {
        const deviation = ((param.min - value) / (param.max - param.min)) * 100;
        
        severity = deviation > 20 ? 'high' : deviation > 10 ? 'medium' : 'low';
        message = `${param.name} (${value} ${param.unit}) is below the minimum threshold of ${param.min} ${param.unit}`;
      } else if (value > param.max) {
        const deviation = ((value - param.max) / (param.max - param.min)) * 100;
        
        severity = deviation > 20 ? 'high' : deviation > 10 ? 'medium' : 'low';
        message = `${param.name} (${value} ${param.unit}) exceeds the maximum threshold of ${param.max} ${param.unit}`;
      }
      
      warnings.push({
        parameterId: param.id,
        message,
        severity
      });
    } else if (status === 'warning' && !isNaN(value)) {
      const warningLow = param.min + (param.max - param.min) * 0.05;
      const warningHigh = param.max - (param.max - param.min) * 0.05;
      
      if (value <= warningLow) {
        warnings.push({
          parameterId: param.id,
          message: `${param.name} (${value} ${param.unit}) is near the minimum threshold`,
          severity: 'low',
        });
      } else if (value >= warningHigh) {
        warnings.push({
          parameterId: param.id,
          message: `${param.name} (${value} ${param.unit}) is approaching the maximum threshold`,
          severity: 'low',
        });
      }
    }
  });
  
  return warnings;
}