import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateLogin = () => {
    if (!email) return t.emailRequired;
    if (!email.includes('@') || !email.includes('.')) return t.emailInvalid;
    if (!password || password.length < 6) return t.passwordRequired;
    return null;
  };

  const validateRegister = () => {
    if (!firstName) return 'First name is required';
    if (!lastName) return 'Last name is required';
    if (!email) return t.emailRequired;
    if (!email.includes('@') || !email.includes('.')) return t.emailInvalid;
    if (!password || password.length < 6) return t.passwordRequired;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = mode === 'login' ? validateLogin() : validateRegister();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError('');

    try {
      const res = mode === 'login'
        ? await login(email, password)
        : await register({ firstName, lastName, email, password });

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

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">⚖️ LegalTrack</h1>
        <p className="login-subtitle">
          {mode === 'login' ? t.signInToAccount : 'Create your account'}
        </p>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            {t.signIn}
          </button>
          <button
            className={`login-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          {mode === 'register' && (
            <>
              <div className="login-field">
                <label className="login-label">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="David"
                  className="login-input"
                />
              </div>
              <div className="login-field">
                <label className="login-label">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Cohen"
                  className="login-input"
                />
              </div>
            </>
          )}

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
            {loading ? t.signingIn : mode === 'login' ? t.signIn : 'Create Account'}
          </button>
        </form>

        {mode === 'login' && <p className="login-hint">{t.demo}</p>}
      </div>
    </div>
  );
};

export default LoginPage;