import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email) return t.emailRequired;
    if (!email.includes('@') || !email.includes('.')) return t.emailInvalid;
    if (!password || password.length < 6) return t.passwordRequired;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      } else {
        setError(res.error.message);
      }
    } catch (err) {
      setError(t.serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">⚖️ LegalTrack</h1>
        <p className="login-subtitle">{t.signInToAccount}</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">{t.email}</label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="david@legaltrack.com"
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label className="login-label">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
              className="login-input"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? t.signingIn : t.signIn}
          </button>
        </form>

        <p className="login-hint">{t.demo}</p>
      </div>
    </div>
  );
};

export default LoginPage;