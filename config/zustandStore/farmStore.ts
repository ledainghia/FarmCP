import { FarmDTO } from '@/dtos/FarmDTO';
import { create } from 'zustand';

interface FarmStore {
  farm: FarmDTO | undefined; // Array to store cage data
  setFarm: (cages: FarmDTO) => void; // Action to update cage data
  clearFarm: () => void; // Action to clear cage data
}

export const farmStore = create<FarmStore>((set) => ({
  farm: undefined,
  setFarm: (farm) => set({ farm }),
  clearFarm: () => set({ farm: undefined }),
}));
export default farmStore;
