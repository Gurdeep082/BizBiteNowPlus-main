import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar user ka role allowedRole se match nahi karta (jaise Seller customer page par jaye)
  if (allowedRole && user.role !== allowedRole) {
    // Uske sahi dashboard par bhej do
    return <Navigate to={`/${user.role.toLowerCase()}-dashboard`} replace />;
  }

  return children;
}