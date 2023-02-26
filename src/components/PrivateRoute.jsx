import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { isLoggedIn } from '../auth';

const PrivateRoute = () => {
  return (
    isLoggedIn() ? <Outlet /> : <Navigate to={"/login"} replace />
  )
}

export default PrivateRoute;