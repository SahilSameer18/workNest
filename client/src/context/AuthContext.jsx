import { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser, logoutUser, getMe } from '../api/authApi.js';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking existing session

  // On mount: attempt to restore session from the existing httpOnly cookie
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await getMe();
        setUser(res.data);
      } catch {
        // No valid session — user stays null (not an error worth toasting)
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // Calls the login API, stores the user, and returns it for the caller to navigate
  const login = useCallback(async (email, password) => {
    const res = await loginUser(email, password);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  // Clears the server session cookie and resets local state
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore — still clear local state
    } finally {
      setUser(null);
      toast.success('Logged out successfully.');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
