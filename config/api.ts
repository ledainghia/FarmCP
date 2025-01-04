import axios from 'axios';

import { FilterDTO } from '@/dtos/FilterDTO';
import { buildQueryString } from '@/utils/buildQuerrySearch';
import { jwtDecode } from 'jwt-decode';
import { get } from 'lodash';
const baseURL = process.env.NEXT_PUBLIC_SITE_URL + '/api';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token || !refreshToken) {
      return Promise.reject('Token not found');
    }
    try {
      const decodedToken = jwtDecode(token) as { exp?: number };
      const decodedRefreshToken = jwtDecode(refreshToken) as { exp?: number };
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedRefreshToken.exp && decodedRefreshToken.exp < currentTime) {
        localStorage.clear();
        return Promise.reject('Token is expired');
      }
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        authApi
          .refreshToken()
          .then((res) => {
            localStorage.setItem('accessToken', res.data.result.accessToken);
            localStorage.setItem('refreshToken', res.data.result.refreshToken);
          })
          .catch((error) => {
            console.log('Error refresh token', error);
          });
      }
    } catch (error) {
      Promise.reject(error);
    }
    if (token && refreshToken) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: any) => {
    return await axios.post(baseURL + '/auth/login', data);
  },
  refreshToken: async () => {
    return await axios.post(baseURL + '/auth/refresh', {
      refreshToken: localStorage.getItem('refreshToken'),
    });
  },
};

export const tasksApi = {
  createTasks: async (data: any) => {
    return await axiosInstance.post('/tasks', data);
  },
  createTaskRecurring: async (data: any) => {
    return await axiosInstance.post('/tasks/create-recurring-task', data);
  },
  getTasks: async (filter: FilterDTO) => {
    const searchParams = buildQueryString(filter);
    return await axiosInstance.get(`/tasks?${searchParams}`);
  },
  deleteTasks: async (id: string) => {
    return await axiosInstance.delete(`/tasks/${id}`);
  },
  updateTasks: async (id: string, data: any) => {
    return await axiosInstance.put(`/tasks/${id}`, data);
  },
  getTaskTypes: async () => {
    return await axiosInstance.get('/tasktype');
  },
};

export const usersApi = {
  getUsers: async () => {
    return await axiosInstance.get('/auth');
  },
};

export const cagesApi = {
  getCages: async () => {
    return await axiosInstance.get('/cages');
  },
};

export const staffApi = {
  getStaffWithCountTask: async (cageId: String) => {
    return await axiosInstance.get('/staff/pending-tasks?cageId=' + cageId);
  },
};

export const farmsApi = {
  createCage: async (data: any) => {
    return await axiosInstance.post('/cages', data);
  },
  createFarmingBatch: async (data: any) => {
    return await axiosInstance.post('/farmingbatchs', data);
  },
  getFarms: async (userID: string) => {
    return await axiosInstance.get(`/users/${userID}/farms`);
  },
  getStaffOfFarm: async (farmId: string) => {
    return await axiosInstance.get(`/farm/${farmId}/users`);
  },
  getAnimalsTemplates: async () => {
    return await axiosInstance.get('/animaltemplates');
  },
  getGrowthStageTemplate: async (animalID?: string) => {
    return await axiosInstance.get(
      `/growthstagetemplate?TemplateId=${animalID}`
    );
  },
  createAnimalTemplate: async (data: any) => {
    return await axiosInstance.post('/animaltemplates', data);
  },
  getFarmingBatch: async ({ cageID }: { cageID: string }) => {
    return await axiosInstance.get(`/farmingbatchs?CageId=${cageID}`);
  },
};

export const docterApi = {
  getMedicalsymptom: async () => {
    return await axiosInstance.get('/medicalsymptom');
  },
  getMedication: async () => {
    return await axiosInstance.get('/medication?page=1&pageSize=1000');
  },
};
