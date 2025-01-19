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
  prescriptions: PrescriptionsDTO;
};

export type PrescriptionsDTO = {
  id: string;
  prescribedDate: Date;
  notes: string;
  status: string;
  daysToTake: number;
  quantityAnimal: number;
  medications: MedicationDTO[];
};

export type MedicationDTO = {
  medicationId: string;
  medicationName: string;
  morning: number;
  afternoon: number;
  evening: number;
  noon: number;
  notes: string;
};
