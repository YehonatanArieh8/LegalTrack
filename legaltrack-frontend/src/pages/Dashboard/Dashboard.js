import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Card from '../../components/Card/Card';
import DataTable from '../../components/DataTable/DataTable';
import { getCases, getClients } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import './Dashboard.css';

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, clientsRes] = await Promise.all([
          getCases(),
          getClients()
        ]);
        if (casesRes.success) setCases(casesRes.data);
        if (clientsRes.success) setClients(clientsRes.data);
      } catch (err) {
        setError(t.loadingError);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const caseColumns = [
    { key: 'caseId', label: t.id },
    { key: 'type', label: t.type },
    { key: 'status', label: t.status, badge: true },
    { key: 'description', label: t.description },
    { key: 'openedDate', label: t.opened, date: true }
];

  const openCases = cases.filter(c => c.status === 'open').length;
  const pendingCases = cases.filter(c => c.status === 'pending').length;

  if (loading) return <div className="dashboard-loading">{t.loading}</div>;

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            {t.welcomeBack}, {user?.firstName} 👋
          </h1>
          <p className="dashboard-subtitle">{t.dashboardSubtitle}</p>
        </div>

        {error && <p className="dashboard-error">{error}</p>}

        <div className="dashboard-stats">
          <div className="stat-card">
            <p className="stat-number">{cases.length}</p>
            <p className="stat-label">{t.totalCases}</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{openCases}</p>
            <p className="stat-label">{t.openCases}</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{pendingCases}</p>
            <p className="stat-label">{t.pendingCases}</p>
          </div>
          <div className="stat-card">
            <p className="stat-number">{clients.length}</p>
            <p className="stat-label">{t.totalClients}</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="dashboard-section-title">{t.recentCases}</h2>
          <div className="dashboard-cards">
            {cases.slice(0, 3).map(c => (
              <Card
                key={c.caseId}
                title={c.type}
                badge={c.status}
                body={c.description}
                footer={`${t.opened}: ${new Date(c.openedDate).toLocaleDateString()}`}
              />
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="dashboard-section-title">{t.allCases}</h2>
          <DataTable
            columns={caseColumns}
            data={cases}
            emptyMessage={t.noCasesFound}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;