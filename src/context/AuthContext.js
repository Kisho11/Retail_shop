import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const CUSTOMER_USERS_KEY = 'customerUsers';
const AUTH_SESSION_KEY = 'authSession';

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const decodeGoogleCredential = (credential) => {
  try {
    const [, payload] = credential.split('.');
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(window.atob(base64));
    return decoded;
  } catch (error) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage(AUTH_SESSION_KEY, null));
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(readStorage(AUTH_SESSION_KEY, null)));
  const [customerUsers, setCustomerUsers] = useState(() => readStorage(CUSTOMER_USERS_KEY, []));
  const [managers, setManagers] = useState([
    {
      id: 2,
      email: 'manager@elamshelf.com',
      name: 'Manager User',
      phone: '+1-234-567-8900',
      status: 'Active',
      joinDate: '2025-01-15',
    },
  ]);

  useEffect(() => {
    if (user) {
      writeStorage(AUTH_SESSION_KEY, user);
    } else {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
  }, [user]);

  useEffect(() => {
    writeStorage(CUSTOMER_USERS_KEY, customerUsers);
  }, [customerUsers]);

  const ADMIN_CREDENTIALS = {
    email: 'admin@elamshelf.com',
    password: 'admin123',
    role: 'admin',
  };

  const MANAGER_CREDENTIALS = {
    email: 'manager@elamshelf.com',
    password: 'manager123',
    role: 'manager',
  };

  const setSession = (sessionUser) => {
    setUser(sessionUser);
    setIsAuthenticated(true);
  };

  const login = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser = {
        id: 1,
        email: ADMIN_CREDENTIALS.email,
        name: 'Admin User',
        role: 'admin',
        loginTime: new Date().toISOString(),
      };
      setSession(adminUser);
      return { success: true, user: adminUser };
    }

    if (email === MANAGER_CREDENTIALS.email && password === MANAGER_CREDENTIALS.password) {
      const managerUser = {
        id: 2,
        email: MANAGER_CREDENTIALS.email,
        name: 'Manager User',
        role: 'manager',
        loginTime: new Date().toISOString(),
      };
      setSession(managerUser);
      return { success: true, user: managerUser };
    }

    return { success: false, error: 'Invalid staff email or password' };
  };

  const signUpCustomer = ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (customerUsers.some((item) => item.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newCustomer = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      provider: 'password',
      createdAt: new Date().toISOString(),
    };

    setCustomerUsers((prev) => [...prev, newCustomer]);

    const customerSession = {
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      role: 'customer',
      provider: newCustomer.provider,
      loginTime: new Date().toISOString(),
    };

    setSession(customerSession);
    return { success: true, user: customerSession };
  };

  const signInCustomer = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = customerUsers.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.password === password
    );

    if (!existing) {
      return { success: false, error: 'Invalid customer email or password' };
    }

    const customerSession = {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      role: 'customer',
      provider: existing.provider || 'password',
      loginTime: new Date().toISOString(),
    };

    setSession(customerSession);
    return { success: true, user: customerSession };
  };

  const authWithGoogle = (credential, mode = 'signin') => {
    const profile = decodeGoogleCredential(credential);

    if (!profile?.email) {
      return { success: false, error: 'Google authentication failed' };
    }

    const email = profile.email.trim().toLowerCase();
    const name = profile.name || 'Google User';
    const existing = customerUsers.find((item) => item.email.toLowerCase() === email);

    if (mode === 'signup' && existing && existing.provider !== 'google') {
      return {
        success: false,
        error: 'Email already registered with password login. Use customer sign in.',
      };
    }

    let account = existing;

    if (!account) {
      account = {
        id: Date.now(),
        name,
        email,
        password: null,
        provider: 'google',
        createdAt: new Date().toISOString(),
      };
      setCustomerUsers((prev) => [...prev, account]);
    }

    const customerSession = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: 'customer',
      provider: 'google',
      loginTime: new Date().toISOString(),
    };

    setSession(customerSession);
    return { success: true, user: customerSession };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => user?.role === 'admin';
  const isManager = () => user?.role === 'manager';
  const isCustomer = () => user?.role === 'customer';
  const isAdminOrManager = () => user?.role === 'admin' || user?.role === 'manager';

  const addManager = (managerData) => {
    const newManager = {
      ...managerData,
      id: Math.max(...managers.map((m) => m.id), 1) + 1,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    setManagers([...managers, newManager]);
    return newManager;
  };

  const updateManager = (managerId, updatedData) => {
    setManagers(managers.map((m) => (m.id === managerId ? { ...m, ...updatedData } : m)));
  };

  const deleteManager = (managerId) => {
    setManagers(managers.filter((m) => m.id !== managerId));
  };

  const getManagerById = (managerId) => managers.find((m) => m.id === managerId);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signUpCustomer,
        signInCustomer,
        authWithGoogle,
        logout,
        isAdmin,
        isManager,
        isCustomer,
        isAdminOrManager,
        managers,
        addManager,
        updateManager,
        deleteManager,
        getManagerById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
