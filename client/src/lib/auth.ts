import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  shift: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (employeeId: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest('POST', '/api/auth/login', { employeeId, password });
    return response.json();
  },

  register: async (userData: any): Promise<AuthResponse> => {
    const response = await apiRequest('POST', '/api/auth/register', userData);
    return response.json();
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  saveAuth: (authData: AuthResponse) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }
};
