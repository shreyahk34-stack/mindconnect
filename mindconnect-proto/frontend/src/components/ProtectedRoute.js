import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { anonLogin } from '../api';

export default function ProtectedRoute({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  });
  const [loading, setLoading] = useState(!token);

  useEffect(() => {
    if (!token) {
      setLoading(true);
      anonLogin()
        .then((res) => {
          if (res && res.token) {
            localStorage.setItem('token', res.token);
            setToken(res.token);
          }
        })
        .catch(() => {
          // Ignore; user can still log in manually
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return <div style={{ padding: 20, color: '#333' }}>Loading…</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
