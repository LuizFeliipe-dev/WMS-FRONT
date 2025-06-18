
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';

const DashboardHeader = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const date = new Date();
    const hours = date.getHours();
    
    if (hours < 12) {
      setGreeting('Bom dia');
    } else if (hours < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }
  }, []);

  // Extract name from email (part before @) or use email if no name available
  const displayName = user?.email?.split('@')[0] || 'Usuário';

  return (
    <header className="mb-6 md:mb-8">
      <h1 className="text-2xl md:text-3xl font-semibold">
        {greeting}, {displayName}
      </h1>
      <p className="text-gray-500 mt-1">
        Bem-vindo ao seu dashboard. Aqui está o resumo do seu armazém.
      </p>
    </header>
  );
};

export default DashboardHeader;
