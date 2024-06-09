import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const CallbackPage: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/empresa');  
    } else {
      navigate('/');  
    }
  }, [isAuthenticated, navigate]);

  return <div>Loading...</div>;
};

export default CallbackPage;
