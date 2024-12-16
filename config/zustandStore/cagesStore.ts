import { CageDTO } from '@/dtos/CageDTO';
import { create } from 'zustand';

interface CageStore {
  cages: CageDTO[]; // Array to store cage data
  setCages: (cages: CageDTO[]) => void; // Action to update cage data
  clearCages: () => void; // Action to clear cage data
}

export const useCageStore = create<CageStore>((set) => ({
  cages: [],
  setCages: (cages) => set({ cages }),
  clearCages: () => set({ cages: [] }),
}));
export default useCageStore;
