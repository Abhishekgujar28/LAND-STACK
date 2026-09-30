import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CitizenLoginPage from './CitizenLoginPage';
import GovernmentLoginPage from './GovernmentLoginPage';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  if (mode === 'official' || mode === 'government') {
    return <GovernmentLoginPage />;
  }

  return <CitizenLoginPage />;
};

export default LoginPage;
