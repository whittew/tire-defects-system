import { Parameter } from '../types';

export const parameters: Parameter[] = [
  {
    id: 'Diameter',
    name: 'Tire Diameter',
    unit: 'inches',
    value: 15,
    min: 15,
    max: 15,
    defaultValue: 15,
    description: 'The diameter of the tire being vulcanized measured in inches'
  },
  {
    id: 'Temperature',
    name: 'Vulcanization Temperature',
    unit: '°C',
    value: 180,
    min: 175,
    max: 195,
    defaultValue: 180,
    description: 'The temperature at which the vulcanization process occurs'
  },
  {
    id: 'Pressure',
    name: 'Capsule Pressure',
    unit: 'bar',
    value: 22,
    min: 20,
    max: 25,
    defaultValue: 22,
    description: 'The pressure applied to the tire during vulcanization'
  },
  {
    id: 'Time',
    name: 'Vulcanization Duration',
    unit: 'min',
    value: 30,
    min: 25,
    max: 40,
    defaultValue: 30,
    description: 'The total time the tire spends in the vulcanization process'
  },
  {
    id: 'Thickness',
    name: 'Rubber Thickness',
    unit: 'mm',
    value: 10,
    min: 9,
    max: 13,
    defaultValue: 10,
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
    value: 13,
    min: 12,
    max: 14,
    defaultValue: 13,
    description: 'The pressure of steam applied during the vulcanization process'
  },
  {
    id: 'Heat_Rate',
    name: 'Heating Rate',
    unit: '°C/min',
    value: 10,
    min: 8,
    max: 12,
    defaultValue: 10,
    description: 'The rate at which the temperature increases during vulcanization'
  }
];

export function getInitialParametersState(): Record<string, Parameter> {
  return parameters.reduce((acc, parameter) => {
    acc[parameter.id] = { ...parameter };
    return acc;
  }, {} as Record<string, Parameter>);
}

