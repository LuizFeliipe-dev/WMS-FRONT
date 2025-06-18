
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { LoginResponse } from '../types/auth';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log('Login attempt with:', { email });
      
      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      
      // Get the response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Try to parse as JSON if possible
      let data;
      try {
        // Only try to parse if there's actual content
        if (responseText && responseText.trim()) {
          data = JSON.parse(responseText);
        } else {
          throw new Error('Empty response from server');
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Erro ao processar resposta do servidor');
      }
      
      // Check if response was not OK
      if (!response.ok) {
        const errorMessage = data?.message || `Falha na autenticação: ${response.status}`;
        console.error('Authentication failed:', errorMessage);
        throw new Error(errorMessage);
      }
      
      // Validate the data structure for new format
      if (!data || !data.token || !data.userId || !data.email || !Array.isArray(data.routes)) {
        console.error('Invalid response structure:', data);
        throw new Error('Resposta inválida do servidor (dados ausentes)');
      }
      
      const result: LoginResponse = {
        token: data.token,
        userId: data.userId,
        email: data.email,
        routes: data.routes
      };
      
      // Save token and user data
      localStorage.setItem('malldre_token', result.token);
      localStorage.setItem('malldre_user', JSON.stringify({
        userId: result.userId,
        email: result.email,
        routes: result.routes
      }));
      
      console.log('Login successful:', { token: result.token, user: { userId: result.userId, email: result.email, routes: result.routes } });
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem('malldre_token');
    localStorage.removeItem('malldre_user');
  },

  // Método para obter o cabeçalho de autorização
  getAuthHeader: (): Record<string, string> => {
    const token = localStorage.getItem('malldre_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },
};
