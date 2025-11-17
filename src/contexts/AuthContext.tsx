import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/apiService';
import { clearOldLocalData } from '../utils/clearOldData';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: '@carework:token',
  USER_ID: '@carework:userId',
  USER_NAME: '@carework:userName',
  USER_EMAIL: '@carework:userEmail',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há usuário salvo ao iniciar
  useEffect(() => {
    // Limpar dados antigos do AsyncStorage na primeira inicialização
    clearOldLocalData().then(() => {
      loadStoredUser();
    });
  }, []);

  const loadStoredUser = async () => {
    try {
      const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      const userName = await AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
      const userEmail = await AsyncStorage.getItem(STORAGE_KEYS.USER_EMAIL);
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      if (userId && userName && userEmail && token) {
        setUser({
          id: userId,
          name: userName,
          email: userEmail,
        });
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const authResponse = await apiService.register(email, password, name);
      
      const newUser: User = {
        id: authResponse.userId,
        name: authResponse.name,
        email: authResponse.email,
      };

      // Salvar dados do usuário
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, authResponse.userId);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, authResponse.name);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, authResponse.email);

      setUser(newUser);
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const authResponse = await apiService.login(email, password);

      const loggedUser: User = {
        id: authResponse.userId,
        name: authResponse.name,
        email: authResponse.email,
      };

      // Salvar dados do usuário
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, authResponse.userId);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, authResponse.name);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, authResponse.email);

      setUser(loggedUser);
      return true;
    } catch (error: any) {
      // Re-throw o erro para que a tela de login possa exibir a mensagem correta
      // A mensagem já vem formatada do apiService
      // Não logar como console.error para evitar toast duplicado
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_ID);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_NAME);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Limpar mesmo se houver erro
      setUser(null);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      // Atualizar dados no AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, updatedUser.id);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, updatedUser.name);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, updatedUser.email);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

