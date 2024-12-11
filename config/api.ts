import axios from 'axios';
import { baseURL } from '.';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

export const tasksApi = {
  createTasks: async (data: any) => {
    return await axiosInstance.post('/tasks', data);
  },
  getTasks: async () => {
    return await axiosInstance.get('/tasks');
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
