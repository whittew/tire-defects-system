export interface Parameter {
  id: string;
  name: string;
  unit: string;
  value: number | '';
  min: number;
  max: number;
  defaultValue: number;
  description: string;
}

export interface ParameterWarning {
  parameterId: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DefectProbability {
  id: string;
  name: string;
  probability: number;
  description: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, number>;
}

export type ValidationStatus = 'valid' | 'warning' | 'error' | 'none';

export interface AppState {
  parameters: Record<string, Parameter>;
  loading: boolean;
  results: DefectProbability[] | null;
  warnings: ParameterWarning[];
  lastAnalyzed: Date | null;
}