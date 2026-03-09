import axios from 'axios';
import io from 'socket.io-client';
import { Bus, Stop, Statistics, SimulationState } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

// Diagnostic Interceptors
api.interceptors.request.use(config => {
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('❌ API Error Detail:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      data: error.response?.data,
      request: error.request ? 'Request sent but no response received' : 'Request setting error'
    });
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Response Status:', error.response.status);
      console.error('Response Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received. Request details:', error.request);
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T; // Or sometimes directly T, need to check
}

import { Socket } from 'socket.io-client';

// Socket instance
let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io("http://127.0.0.1:5001", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const apiService = {
  getServiceData: async <T>(promise: Promise<any>): Promise<T> => {
    const response = await promise;
    return response.data as T;
  },

  getStatus: async () => apiService.getServiceData<{ success: boolean; simulation_running: boolean }>(api.get('/api/status')),

  getConfig: async () => {
    const data = await apiService.getServiceData<{ success: boolean; config: any }>(api.get('/api/config'));
    return data.config;
  },

  getRoutes: async () => {
    const data = await apiService.getServiceData<{ success: boolean; routes: any }>(api.get('/api/routes'));
    return data.routes;
  },

  getRoadPaths: async () => {
    const data = await apiService.getServiceData<{ success: boolean; road_paths: any }>(api.get('/api/routes/road-paths'));
    return data.road_paths;
  },

  getStops: async () => {
    const data = await apiService.getServiceData<{ success: boolean; stops: Stop[] }>(api.get('/api/stops'));
    return data.stops;
  },

  getState: async () => apiService.getServiceData<SimulationState>(api.get('/api/state')),

  getStatistics: async () => apiService.getServiceData<Statistics>(api.get('/api/statistics')),

  getBuses: async () => {
    const data = await apiService.getServiceData<{ success: boolean; buses: Bus[] }>(api.get('/api/buses'));
    return data.buses;
  },

  startSimulation: async (useTrained = false) =>
    apiService.getServiceData<{ success: boolean; message: string }>(
      api.post('/api/simulation/start', { use_trained_agents: useTrained })
    ),

  stopSimulation: async () =>
    apiService.getServiceData<{ success: boolean; message: string }>(api.post('/api/simulation/stop')),

  resetSimulation: async () =>
    apiService.getServiceData<{ success: boolean; message: string }>(api.post('/api/simulation/reset')),

  startTraining: async (numEpisodes = 100) =>
    apiService.getServiceData<{ success: boolean; message: string }>(
      api.post('/api/training/start', { num_episodes: numEpisodes })
    ),

  addBus: async () =>
    apiService.getServiceData<{ success: boolean; message: string }>(api.post('/api/buses')),

  removeBus: async (busId: string) =>
    apiService.getServiceData<{ success: boolean; message: string }>(api.delete(`/api/buses/${busId}`)),
};

export default apiService;
