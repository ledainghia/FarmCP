import { AnimalsTemplateDTO } from './AnimalsTemplateDTO';
import { CageDTO } from './CageDTO';

export type FarmingBatchDTO = {
  id: string;
  name: string;
  species: string;
  startDate: string; // Use string to store ISO date
  completeAt: string | null;
  status: string;
  cleaningFrequency: number;
  quantity: number;
  cage: CageDTO;
  template: AnimalsTemplateDTO;
};
