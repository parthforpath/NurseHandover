import { useState, useEffect } from 'react';
import { authApi, type User } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = authApi.getToken();
    const savedUser = authApi.getUser();
    
    if (token && savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (employeeId: string, password: string) => {
    try {
      const authData = await authApi.login(employeeId, password);
      authApi.saveAuth(authData);
      setUser(authData.user);
      return authData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };
}
