export type MedicationDTO = {
  id: string;
  name: string;
  usageInstructions: string;
  price: number;
  doseQuantity: number;
  pricePerDose: number;
};

export type MedicationFormDTO = {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: number;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  noon: boolean;
};

export type StandardprescriptionDTO = {
  id: string;
  notes: string;
  diseaseId: string;
  medications: MedicationFormDTO[];
};
