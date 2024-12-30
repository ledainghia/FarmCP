import { cagesApi, farmsApi, staffApi, tasksApi } from '@/config/api';
import { CageDTO } from '@/dtos/CageDTO';
import { FarmDTO } from '@/dtos/FarmDTO';
import { FarmingBatchDTO } from '@/dtos/FarmingBatchDTO';
import { Pagination } from '@/dtos/Pagination';
import { StaffOfFarmDTO } from '@/dtos/StaffOfFarmDTO';
import { useQuery } from '@tanstack/react-query';

// Define a custom hook
export const useCagesQuery = () => {
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

export const useStaffOfFarmQuery = (farmId: string) => {
  return useQuery({
    queryKey: ['staffs', farmId],
    queryFn: async (): Promise<Pagination<StaffOfFarmDTO>> => {
      const response = await farmsApi.getStaffOfFarm(farmId); // API call
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};

export const useFarmsQuery = (userID: string) => {
  return useQuery({
    queryKey: ['farms', userID],
    queryFn: async (): Promise<Pagination<FarmDTO>> => {
      const response = await farmsApi.getFarms(userID); // API call
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};

export const useTaskTypesQuery = () => {
  return useQuery({
    queryKey: ['taskTypes'],
    queryFn: async () => {
      const response = await tasksApi.getTaskTypes(); // API call
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};

export const useAnimalsTemplatesQuery = () => {
  return useQuery({
    queryKey: ['animalsTemplates'],
    queryFn: async () => {
      const response = await farmsApi.getAnimalsTemplates(); // API call
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};

export const useGrowStageTemplatesQuery = (animalID?: string) => {
  return useQuery({
    queryKey: ['growStageTemplates', animalID],
    queryFn: async () => {
      const response = await farmsApi.getGrowthStageTemplate(animalID); // API call
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};

export const useFarmingBatchQuery = (cageID: { cageID: string }) => {
  return useQuery({
    queryKey: ['farmingBatch', cageID],
    queryFn: async (): Promise<Pagination<FarmingBatchDTO>> => {
      const response = await farmsApi.getFarmingBatch(cageID); // API call
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};
