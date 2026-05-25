import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">⚖️ LegalTrack</span>
        <Link to="/dashboard" className="navbar-link">{t.dashboard}</Link>
        <Link to="/clients" className="navbar-link">{t.clients}</Link>
        <Link to="/cases" className="navbar-link">{t.cases}</Link>
      </div>
      <div className="navbar-right">
        <Link to="/settings" className="navbar-link">⚙️ {t.settings}</Link>
        <span className="navbar-username">
          {user ? `${user.firstName} ${user.lastName}` : ''}
        </span>
        <button onClick={handleLogout} className="navbar-logout">
          {t.logout}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;