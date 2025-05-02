import { Parameter } from '../types';

export const parameters: Parameter[] = [
  {
    id: 'Diameter',
    name: 'Tire Diameter',
    unit: 'inches',
    value: 15,
    min: 13,
    max: 24,
    defaultValue: 15,
    description: 'The diameter of the tire being vulcanized measured in inches'
  },
  {
    id: 'Temperature',
    name: 'Vulcanization Temperature',
    unit: '°C',
    value: 160,
    min: 140,
    max: 180,
    defaultValue: 160,
    description: 'The temperature at which the vulcanization process occurs'
  },
  {
    id: 'Pressure',
    name: 'Capsule Pressure',
    unit: 'bar',
    value: 20,
    min: 18,
    max: 25,
    defaultValue: 20,
    description: 'The pressure applied to the tire during vulcanization'
  },
  {
    id: 'Time',
    name: 'Vulcanization Duration',
    unit: 'min',
    value: 30,
    min: 15,
    max: 45,
    defaultValue: 30,
    description: 'The total time the tire spends in the vulcanization process'
  },
  {
    id: 'Thickness',
    name: 'Rubber Thickness',
    unit: 'mm',
    value: 8,
    min: 6,
    max: 12,
    defaultValue: 8,
    description: 'The thickness of the rubber compound used in the tire'
  },
  {
    id: 'Mold_Temperature',
    name: 'Mold Temperature',
    unit: '°C',
    value: 165,
    min: 155,
    max: 175,
    defaultValue: 165,
    description: 'The temperature of the mold used in the vulcanization process'
  },
  {
    id: 'Steam_Pressure',
    name: 'Steam Pressure',
    unit: 'bar',
    value: 15,
    min: 12,
    max: 18,
    defaultValue: 15,
    description: 'The pressure of steam applied during the vulcanization process'
  },
  {
    id: 'Heat_Rate',
    name: 'Heating Rate',
    unit: '°C/min',
    value: 8,
    min: 5,
    max: 12,
    defaultValue: 8,
    description: 'The rate at which the temperature increases during vulcanization'
  }
];

export function getInitialParametersState(): Record<string, Parameter> {
  return parameters.reduce((acc, parameter) => {
    acc[parameter.id] = { ...parameter };
    return acc;
  }, {} as Record<string, Parameter>);
}