import api from './api';

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export async function request<T>(
  method: HttpMethod,
  url: string,
  data?: unknown,
  config: Record<string, any> = {}
): Promise<T> {
  try {
    const response = await api.request<T>({
      method,
      url,
      ...(data && ['post', 'put'].includes(method) ? { data } : { params: data }),
      ...config,
    });
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
}
