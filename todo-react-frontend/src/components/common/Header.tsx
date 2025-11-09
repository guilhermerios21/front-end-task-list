import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>📝 Todo App</h1>
        </Link>
        
        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <span className="header-user">
                Olá, {user?.name || 'Usuário'}
              </span>
              <Link to="/tasks" className="header-link">
                Minhas Tarefas
              </Link>
              <button onClick={handleLogout} className="header-logout-btn">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-link">
                Login
              </Link>
              <Link to="/register" className="header-link">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
