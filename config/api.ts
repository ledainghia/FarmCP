import axios from 'axios';
import { baseURL } from '.';
import { FilterDTO } from '@/dtos/FilterDTO';
import { buildQueryString } from '@/utils/buildQuerrySearch';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export const authApi = {
  login: async (data: any) => {
    return await axiosInstance.post('/auth/login', data);
  },
};

export const tasksApi = {
  createTasks: async (data: any) => {
    return await axiosInstance.post('/tasks', data);
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
};

export const usersApi = {
  getUsers: async () => {
    return await axiosInstance.get('/users');
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
