export interface DrugSeed {
  name: string;
  description: string;
  staminaRestore: number;
  addictionRate: number;
  buyPrice: number;
  sellPrice: number;
  ticketsRequired: number;
  levelRequired: number;
}

export const DRUGS: DrugSeed[] = [
  { name: 'Beer', description: 'A cold one to take the edge off', staminaRestore: 8, addictionRate: 0.1, buyPrice: 5, sellPrice: 3, ticketsRequired: 1, levelRequired: 1 },
  { name: 'Weed', description: 'Relaxing herb from the streets', staminaRestore: 15, addictionRate: 0.3, buyPrice: 15, sellPrice: 10, ticketsRequired: 1, levelRequired: 1 },
  { name: 'Painkillers', description: 'Prescription pills, no prescription needed', staminaRestore: 20, addictionRate: 0.5, buyPrice: 30, sellPrice: 20, ticketsRequired: 2, levelRequired: 3 },
  { name: 'Ecstasy', description: 'Party drug for the nightlife', staminaRestore: 30, addictionRate: 1.0, buyPrice: 60, sellPrice: 40, ticketsRequired: 2, levelRequired: 5 },
  { name: 'Cocaine', description: 'Powdered confidence boost', staminaRestore: 40, addictionRate: 2.0, buyPrice: 120, sellPrice: 80, ticketsRequired: 3, levelRequired: 8 },
  { name: 'LSD', description: 'Mind-expanding psychedelic trip', staminaRestore: 35, addictionRate: 1.5, buyPrice: 90, sellPrice: 60, ticketsRequired: 2, levelRequired: 10 },
  { name: 'Meth', description: 'Intense stimulant, highly addictive', staminaRestore: 55, addictionRate: 3.5, buyPrice: 200, sellPrice: 140, ticketsRequired: 4, levelRequired: 12 },
  { name: 'Heroin', description: 'The most dangerous drug on the street', staminaRestore: 70, addictionRate: 5.0, buyPrice: 350, sellPrice: 250, ticketsRequired: 5, levelRequired: 15 },
];
