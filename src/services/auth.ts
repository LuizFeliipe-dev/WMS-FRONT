import { LoginResponse } from '@/types/auth';
import { request } from './httpService';

const TOKEN_KEY = 'malldre_token';
const USER_KEY = 'malldre_user';

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const data = await request<any>('post', '/auth', { email, password });

    if (!data?.token || !data?.userId || !data?.email || !Array.isArray(data.routes)) {
      throw new Error('Resposta inválida do servidor (dados ausentes)');
    }

    const result: LoginResponse = {
      token: data.token,
      userId: data.userId,
      email: data.email,
      routes: data.routes,
    };

    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      userId: result.userId,
      email: result.email,
      routes: result.routes,
    }));

    return result;
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getAuthHeader: (): Record<string, string> => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
