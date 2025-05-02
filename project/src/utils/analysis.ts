import { DefectProbability, Parameter, ParameterWarning } from '../types';
import { defaultDefects } from '../data/defects';
import { validateParameter, generateWarnings } from './validation';

// This is a simplified analysis model
// In a real-world scenario, this would likely use a more complex mathematical model or ML
export function analyzeParameters(
  parameters: Record<string, Parameter>
): { defects: DefectProbability[]; warnings: ParameterWarning[] } {
  // Generate warnings first
  const warnings = generateWarnings(parameters);
  
  // Clone default defects to avoid mutation
  const defects = JSON.parse(JSON.stringify(defaultDefects)) as DefectProbability[];
  
  // Count errors and warnings as a simple metric
  const errorCount = warnings.filter(w => w.severity === 'high').length;
  const warningCount = warnings.filter(w => w.severity !== 'high').length;
  
  // Get parameter values
  const temp = Number(parameters.temperature.value);
  const pressure = Number(parameters.pressure.value);
  const duration = Number(parameters.duration.value);
  const thickness = Number(parameters.thickness.value);
  const moldTemp = Number(parameters.moldTemp.value);
  const steamPressure = Number(parameters.steamPressure.value);
  const heatingRate = Number(parameters.heatingRate.value);
  
  // Calculate bubble probability
  let bubbleProbability = 0;
  if (pressure < parameters.pressure.min + 2) {
    bubbleProbability += 30;
  }
  if (heatingRate > parameters.heatingRate.max - 2) {
    bubbleProbability += 25;
  }
  if (temp < parameters.temperature.min + 5) {
    bubbleProbability += 20;
  }
  bubbleProbability = Math.min(bubbleProbability + errorCount * 5 + warningCount * 2, 100);
  defects[0].probability = bubbleProbability;
  
  // Calculate crack probability
  let crackProbability = 0;
  if (temp > parameters.temperature.max - 5) {
    crackProbability += 35;
  }
  if (duration > parameters.duration.max - 5) {
    crackProbability += 25;
  }
  if (Math.abs(temp - moldTemp) > 10) {
    crackProbability += 20;
  }
  crackProbability = Math.min(crackProbability + errorCount * 5 + warningCount * 2, 100);
  defects[1].probability = crackProbability;
  
  // Calculate uneven curing probability
  let unevenProbability = 0;
  if (Math.abs(temp - moldTemp) > 5) {
    unevenProbability += 30;
  }
  if (heatingRate < parameters.heatingRate.min + 2 || heatingRate > parameters.heatingRate.max - 2) {
    unevenProbability += 25;
  }
  if (thickness > parameters.thickness.max - 2) {
    unevenProbability += 20;
  }
  unevenProbability = Math.min(unevenProbability + errorCount * 5 + warningCount * 2, 100);
  defects[2].probability = unevenProbability;
  
  // Calculate structural damage probability
  let damageProbability = 0;
  if (pressure > parameters.pressure.max - 2) {
    damageProbability += 35;
  }
  if (temp > parameters.temperature.max - 5) {
    damageProbability += 25;
  }
  if (steamPressure > parameters.steamPressure.max - 2) {
    damageProbability += 20;
  }
  damageProbability = Math.min(damageProbability + errorCount * 5 + warningCount * 2, 100);
  defects[3].probability = damageProbability;
  
  // Round all probabilities to integers
  defects.forEach(defect => {
    defect.probability = Math.round(defect.probability);
  });
  
  return { defects, warnings };
}

export function isFormValid(parameters: Record<string, Parameter>): boolean {
  return Object.values(parameters).every(param => 
    param.value !== '' && 
    !isNaN(Number(param.value)) && 
    validateParameter(param) !== 'error'
  );
}

export function exportResults(
  parameters: Record<string, Parameter>,
  defects: DefectProbability[],
  warnings: ParameterWarning[]
): string {
  const now = new Date();
  const timestamp = now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
  
  let content = `# Tire Vulcanization Analysis - ${timestamp}\n\n`;
  
  content += `## Parameters\n\n`;
  Object.values(parameters).forEach(param => {
    content += `- ${param.name}: ${param.value} ${param.unit}\n`;
  });
  
  content += `\n## Defect Probabilities\n\n`;
  defects.forEach(defect => {
    content += `- ${defect.name}: ${defect.probability}%\n`;
  });
  
  if (warnings.length > 0) {
    content += `\n## Warnings\n\n`;
  }
  
  return content;
}