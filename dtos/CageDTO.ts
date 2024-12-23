export type CageDTO = {
  id: string;
  penCode: string;
  farmId: string;
  name: string;
  area: number; // in square meters
  location: string; // location of the cage
  capacity: number; // maximum number of animals
  animalType: string; // type of animal housed (e.g., Cow, Chicken, etc.)
  boardCode: string; // identifier for the board
  boardStatus: boolean; // true if the board is functional
  createdDate: string; // ISO date format
  cameraUrl: string; // URL for the cage's camera feed
  staffId?: string; // ID of the staff assigned to the cage
  staffName?: string; // Name of the staff assigned to the cage
};
