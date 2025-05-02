import { DefectProbability } from '../types';

export const defaultDefects: DefectProbability[] = [
  {
    id: 'bubbles',
    name: 'Air Bubbles',
    probability: 0,
    description: 'Trapped air bubbles within the rubber compound'
  },
  {
    id: 'cracks',
    name: 'Surface Cracks',
    probability: 0,
    description: 'Small cracks on the tire surface due to improper vulcanization'
  },
  {
    id: 'uneven',
    name: 'Uneven Curing',
    probability: 0,
    description: 'Inconsistent vulcanization across the tire'
  },
  {
    id: 'damage',
    name: 'Structural Damage',
    probability: 0,
    description: 'Compromise to the structural integrity of the tire'
  }
];