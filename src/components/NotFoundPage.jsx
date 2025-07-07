// src/components/NotFoundPage.jsx
import { useNavigate } from 'react-router-dom';
import React from 'react';

function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div className="not-found">
      <h1>404 - Página não encontrada</h1>
      <button onClick={() => navigate('/')}>
        Voltar à página inicial
      </button>
    </div>
  );
}

export default NotFoundPage;  // Exportação padrão adicionada