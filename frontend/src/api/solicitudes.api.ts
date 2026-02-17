import apiClient from './client';

export const solicitudesApi = {
  getDashboardCiudadano: async () => {
    const response = await apiClient.get('/solicitudes/dashboard-ciudadano');
    return response.data;
  },

  getDashboardInterno: async () => {
    const response = await apiClient.get('/solicitudes/dashboard-interno');
    return response.data;
  },

  getMisSolicitudes: async () => {
    const response = await apiClient.get('/solicitudes/mis-solicitudes');
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/solicitudes');
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/solicitudes', data);
    return response.data;
  },
};
