import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { getSettings, updateSettings } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    theme: 'light',
    language: 'en',
    notificationsEnabled: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t, changeLanguage } = useLanguage();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        if (res.success) setForm(res.data);
        else setError(t.failedLoadSettings);
      } catch (err) {
        setError(t.failedLoadSettings);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const validate = () => {
    if (!form.username) return t.usernameRequired;
    if (!form.email || !form.email.includes('@')) return t.validEmailRequired;
    if (!form.theme) return t.themeRequired;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await updateSettings(form);
      if (res.success) {
        // Apply theme
        document.body.setAttribute('data-theme', form.theme);
        localStorage.setItem('theme', form.theme);

        // Apply language
        changeLanguage(form.language);

        setSuccess(t.settingsSaved);
      } else {
        setError(res.error.message);
      }
    } catch (err) {
      setError(t.failedSaveSettings);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="settings-loading">{t.loading}</div>;

  return (
    <div className="settings-container">
      <Navbar />
      <div className="settings-content">
        <h1 className="settings-title">⚙️ {t.settings}</h1>

        <div className="settings-card">
          <form onSubmit={handleSubmit} className="settings-form">

            <div className="settings-field">
              <label className="settings-label">{t.username}</label>
              <input
                className="settings-input"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder={t.username}
              />
            </div>

            <div className="settings-field">
              <label className="settings-label">{t.email}</label>
              <input
                className="settings-input"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>

            <div className="settings-field">
              <label className="settings-label">{t.theme}</label>
              <select
                className="settings-select"
                value={form.theme}
                onChange={e => setForm({ ...form, theme: e.target.value })}
              >
                <option value="light">{t.light}</option>
                <option value="dark">{t.dark}</option>
              </select>
            </div>

            <div className="settings-field">
              <label className="settings-label">{t.language}</label>
              <select
                className="settings-select"
                value={form.language}
                onChange={e => setForm({ ...form, language: e.target.value })}
              >
                <option value="en">{t.english}</option>
                <option value="he">{t.hebrew}</option>
              </select>
            </div>

            <div className="settings-checkbox-field">
              <input
                type="checkbox"
                className="settings-checkbox"
                checked={form.notificationsEnabled}
                onChange={e => setForm({ ...form, notificationsEnabled: e.target.checked })}
              />
              <label className="settings-label">{t.enableNotifications}</label>
            </div>

            {error && <p className="settings-error">{error}</p>}
            {success && <p className="settings-success">{success}</p>}

            <button type="submit" disabled={saving} className="settings-submit">
              {saving ? t.saving : t.saveSettings}
            </button>

          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;