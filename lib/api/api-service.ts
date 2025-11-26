import { AxiosRequestConfig } from 'axios';
import axios_interceptor from './axiosInterceptor/Interceptor';

interface ApiServiceConfig {
  method?: string;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export class ApiService {
  private config: AxiosRequestConfig;

  constructor({ method = 'GET', url, data, params, headers = {} }: ApiServiceConfig) {
    this.config = {
      method,
      url,
      data,
      params,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
  }

  async request() {
    try {
      const response = await axios_interceptor(this.config);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export async function getApi({ url, params, headers = {} }: Omit<ApiServiceConfig, 'method' | 'data'>) {
  const apiService = new ApiService({ method: 'GET', url, params, headers });
  return await apiService.request();
}

export async function postApi({ url, data, headers = {} }: Omit<ApiServiceConfig, 'method' | 'params'>) {
  const apiService = new ApiService({ method: 'POST', url, data, headers });
  return await apiService.request();
}

export async function deleteApi({ url, params, headers = {} }: Omit<ApiServiceConfig, 'method' | 'data'>) {
  const apiService = new ApiService({ method: 'DELETE', url, params, headers });
  return await apiService.request();
}

export async function updateApi({ url, data, headers = {} }: Omit<ApiServiceConfig, 'method' | 'params'>) {
  const apiService = new ApiService({ method: 'PUT', url, data, headers });
  return await apiService.request();
}
