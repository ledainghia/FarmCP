export type MedicalSymptomDTO = {
  id: string;
  farmingBatchId: string;
  symptoms: string;
  diagnosis?: string;
  treatment: string;
  status: string;
  affectedQuantity: number;
  quantity: number;
  nameAnimal: string;
  createAt: Date;
  notes: string;
  pictures: string[];
};
