import {
  cagesApi,
  docterApi,
  farmsApi,
  staffApi,
  tasksApi,
} from '@/config/api';
import { AnimalsTemplateDTO } from '@/dtos/AnimalsTemplateDTO';
import { CageDTO } from '@/dtos/CageDTO';
import { DiseaseDTO } from '@/dtos/DiseaseDTO';
import { FarmDTO } from '@/dtos/FarmDTO';
import { FarmingBatchDTO } from '@/dtos/FarmingBatchDTO';
import { MedicalSymptomDTO } from '@/dtos/MedicalSymptomDTO';
import { MedicationDTO } from '@/dtos/MedicationDTO';
import { Pagination } from '@/dtos/Pagination';
import { StaffOfFarmDTO } from '@/dtos/StaffOfFarmDTO';
import { TaskTypeDTO } from '@/dtos/TaskTypeDTO';
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
    queryFn: async (): Promise<TaskTypeDTO[]> => {
      const response = await tasksApi.getTaskTypes(); // API call
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};

export const useAnimalsTemplatesQuery = () => {
  return useQuery({
    queryKey: ['animalsTemplates'],
    queryFn: async (): Promise<Pagination<AnimalsTemplateDTO>> => {
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

export const useMedicalSymptomQuery = () => {
  return useQuery({
    queryKey: ['medicalSymptom'],
    queryFn: async (): Promise<MedicalSymptomDTO[]> => {
      const response = await docterApi.getMedicalsymptom(); // API call
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};

export const useMedicationQuery = () => {
  return useQuery({
    queryKey: ['medications'],
    queryFn: async (): Promise<Pagination<MedicationDTO>> => {
      const response = await docterApi.getMedication(); // API call
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};

export const useDiseaseQuery = () => {
  return useQuery({
    queryKey: ['diseases'],
    queryFn: async (): Promise<Pagination<DiseaseDTO>> => {
      const response = await docterApi.getDisease(); // API call
      return response.data.result; // Assuming `result` contains the pagination data
    },
  });
};
