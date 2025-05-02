import { Preset } from '../types';

export const presets: Preset[] = [
  {
    id: 'passenger-car',
    name: 'Passenger Car Tires',
    description: 'Standard settings for passenger car tires',
    parameters: {
      diameter: 16,
      temperature: 160,
      pressure: 20,
      duration: 30,
      thickness: 8,
      moldTemp: 165,
      steamPressure: 15,
      heatingRate: 8
    }
  },
  {
    id: 'truck',
    name: 'Truck Tires',
    description: 'Settings optimized for heavy-duty truck tires',
    parameters: {
      diameter: 22,
      temperature: 170,
      pressure: 23,
      duration: 40,
      thickness: 12,
      moldTemp: 170,
      steamPressure: 17,
      heatingRate: 7
    }
  },
  {
    id: 'performance',
    name: 'Performance Tires',
    description: 'Settings for high-performance sports tires',
    parameters: {
      diameter: 18,
      temperature: 165,
      pressure: 22,
      duration: 35,
      thickness: 9,
      moldTemp: 168,
      steamPressure: 16,
      heatingRate: 9
    }
  },
  {
    id: 'economy',
    name: 'Economy Tires',
    description: 'Settings for economic, fuel-efficient tires',
    parameters: {
      diameter: 15,
      temperature: 155,
      pressure: 19,
      duration: 25,
      thickness: 7,
      moldTemp: 160,
      steamPressure: 14,
      heatingRate: 7
    }
  }
];