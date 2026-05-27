import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout, getMe } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const localUser = JSON.parse(localStorage.getItem('user'));
  const [userData, setUserData] = useState(localUser);

  // Fetch current user from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        if (res.success) setUserData(res.data);
      } catch (err) {
        // Fallback to localStorage if backend call fails
        setUserData(localUser);
      }
    };
    fetchUser();
  }, []);

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
          {userData ? `${userData.firstName} ${userData.lastName}` : ''}
        </span>
        <button onClick={handleLogout} className="navbar-logout">
          {t.logout}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
