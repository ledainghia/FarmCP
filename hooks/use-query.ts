import { cagesApi, staffApi, tasksApi } from '@/config/api';
import useCageStore from '@/config/zustandStore/cagesStore';
import { TaskDTO } from '@/dtos/AplicationDTO';
import { CageDTO } from '@/dtos/cageDTO';
import { Pagination } from '@/dtos/Pagination';
import { useQuery } from '@tanstack/react-query';

// Define a custom hook
export const useCagesQuery = () => {
  const setCages = useCageStore((state) => state.setCages);
  return useQuery({
    queryKey: ['cages'],
    queryFn: async (): Promise<Pagination<CageDTO>> => {
      const response = await cagesApi.getCages(); // API call
      // if (response.data.result) {
      //   setCages(response.data.result.items);
      // }
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};

export const useStaffQuery = (cageId: string) => {
  return useQuery({
    queryKey: ['staff', cageId],
    queryFn: async () => {
      const response = await staffApi.getStaffWithCountTask(cageId); // API call
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};
