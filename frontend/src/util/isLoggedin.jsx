import { useState, useContext, createContext, useEffect } from 'react';
import { useAuth } from './authContext';
// import { getSocket } from './socket';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [isLoggedIn, _setIsLoggedIn] = useState(false);
  const { setAccessToken } = useAuth();

  useEffect(() => {
    // One-time refresh-accessToken API request on website start
    fetch(`${import.meta.env.VITE_API_URL}/api/refresh-accessToken`, {
      method: 'POST',
      credentials: 'include', // Include cookies for refresh token
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setIsLoggedIn(true);
          setAccessToken(data.accessToken);
        } else {
          console.error('Failed to refresh access token:', data.message);
        }
      })
      .catch(err => console.error('Error refreshing access token:', err));
  }, []);

  const setIsLoggedIn = (value) => {
    if (typeof value === 'boolean') {
      if (value === false)
        setAccessToken(null);
      _setIsLoggedIn(value);
    } else {
      console.error('Invalid value for setIsLoggedIn. Expected a boolean.');
    }
  }

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
}

export const useLogin = () => useContext(LoginContext);