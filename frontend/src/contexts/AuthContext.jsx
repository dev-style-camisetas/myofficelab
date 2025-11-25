import { createContext, useState, useEffect } from 'react';
import api from '../config/axios';

export const AuthContext = createContext(undefined);



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há tokens salvos ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (accessToken && refreshToken) {
        // Tentar validar o token atual fazendo uma requisição
        // Como não temos endpoint de "me", vamos apenas verificar se os tokens existem
        // Em produção, seria ideal ter um endpoint para validar o token
        try {
          // Se os tokens existem, assumimos que o usuário está autenticado
          // Poderia fazer uma requisição para validar, mas para simplificar
          // vamos apenas verificar se os tokens existem
          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Salvar tokens no localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  };

  const register = async (email, password, name)  => {
    try {
      await api.post('/register', {
        email,
        password,
        name,
      });
      // Após registrar, fazer login automaticamente
      await login(email, password);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao registrar';
      throw new Error(errorMessage);
    }
  };

  const logout = async ()=> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar tokens independente de sucesso ou erro
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      const response = await api.put(`/users/${user.id}`, updates);
      // controller returns { message, data: user }
      const updated = response.data?.data || response.data || null;
      if (updated) {
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
      }
      return updated;
    } catch (error) {
      const errorMessage = error.response?.data || error.message || 'Erro ao atualizar perfil';
      throw new Error(errorMessage);
    }
  };

  const value= {
    user,
    isAuthenticated: !!user,
    login,
    register,
    updateProfile,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

