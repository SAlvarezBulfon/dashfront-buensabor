
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

interface PrivateRouteProps {
  component: React.ComponentType<object>;
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  roles,
}) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component />;
};

export default PrivateRoute;
