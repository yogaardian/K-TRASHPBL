import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

// Create Auth Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const nama = localStorage.getItem('nama');
    const role = localStorage.getItem('role');

    if (token && userId && nama && role) {
      setUser({
        id: parseInt(userId),
        nama,
        role,
      });
    }
    setIsLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('nama', userData.nama);
    localStorage.setItem('role', userData.role);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nama');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ======================== DASHBOARD CONTEXT ========================

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let data = {};

        // Admin Dashboard
        if (user.role === 'admin') {
          const statsRes = await dashboardAPI.getAdminStats();
          data.stats = statsRes.data;
        }

        // User Dashboard
        if (user.role === 'user') {
          const balanceRes = await dashboardAPI.getUserBalance(user.id);
          const ordersRes = await dashboardAPI.getUserOrders(user.id);
          data.balance = balanceRes.data;
          data.orders = ordersRes.data;
        }

        // Driver Dashboard
        if (user.role === 'driver' || user.role === 'petugas') {
          const ordersRes = await dashboardAPI.getPendingOrders();
          data.orders = ordersRes.data;
        }

        setDashboardData(data);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const refresh = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      let data = {};

      if (user.role === 'admin') {
        const statsRes = await dashboardAPI.getAdminStats();
        data.stats = statsRes.data;
      }

      if (user.role === 'user') {
        const balanceRes = await dashboardAPI.getUserBalance(user.id);
        const ordersRes = await dashboardAPI.getUserOrders(user.id);
        data.balance = balanceRes.data;
        data.orders = ordersRes.data;
      }

      if (user.role === 'driver' || user.role === 'petugas') {
        const ordersRes = await dashboardAPI.getPendingOrders();
        data.orders = ordersRes.data;
      }

      setDashboardData(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error refreshing dashboard:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        isLoading,
        error,
        lastUpdate,
        refresh,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
