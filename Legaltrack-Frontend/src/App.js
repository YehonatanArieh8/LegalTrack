import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import LoginPage from './pages/LoginPage/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import ClientsPage from './pages/ClientsPage/ClientsPage';
import CasesPage from './pages/CasesPage/CasesPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import CaseDetailPage from './pages/CaseDetailPage/CaseDetailPage';
import Notifications from './components/Notifications/Notifications';
import AiChat from './components/AiChat/AiChat';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/" />;
};

function App() {
  useEffect(() => {
    document.body.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Notifications />
        <AiChat />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute><ClientsPage /></ProtectedRoute>
          } />
          <Route path="/cases" element={
            <ProtectedRoute><CasesPage /></ProtectedRoute>
          } />
          <Route path="/cases/:id" element={
            <ProtectedRoute><CaseDetailPage /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><SettingsPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
export default App;