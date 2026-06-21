import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Card from '../../components/Card/Card';
import DataTable from '../../components/DataTable/DataTable';
import { getCases, getClients } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import './Dashboard.css';

const COLORS = { open: '#48bb78', pending: '#ecc94b', closed: '#fc8181' };

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, clientsRes] = await Promise.all([getCases(), getClients()]);
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

  const openCases    = cases.filter(c => c.status === 'open').length;
  const pendingCases = cases.filter(c => c.status === 'pending').length;
  const closedCases  = cases.filter(c => c.status === 'closed').length;

  const pieData = [
    { name: 'Open',    value: openCases,    color: COLORS.open },
    { name: 'Pending', value: pendingCases, color: COLORS.pending },
    { name: 'Closed',  value: closedCases,  color: COLORS.closed },
  ].filter(d => d.value > 0);

  const recentActivity = [...cases]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const caseColumns = [
    { key: 'caseId',      label: t.id },
    { key: 'type',        label: t.type },
    { key: 'status',      label: t.status, badge: true },
    { key: 'description', label: t.description },
    { key: 'openedDate',  label: t.opened, date: true }
  ];

  if (loading) return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-skeleton">
        <div className="skeleton-title" />
        <div className="skeleton-stats">
          {[1,2,3,4].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">{t.welcomeBack}, {user?.firstName} 👋</h1>
            <p className="dashboard-subtitle">{t.dashboardSubtitle}</p>
          </div>
        </div>

        {error && <p className="dashboard-error">{error}</p>}

        {/* Stat Cards */}
        <div className="dashboard-stats">
          <div className="stat-card blue">
            <p className="stat-number">{cases.length}</p>
            <p className="stat-label">{t.totalCases}</p>
            <span className="stat-icon">📁</span>
          </div>
          <div className="stat-card green">
            <p className="stat-number">{openCases}</p>
            <p className="stat-label">{t.openCases}</p>
            <span className="stat-icon">🟢</span>
          </div>
          <div className="stat-card yellow">
            <p className="stat-number">{pendingCases}</p>
            <p className="stat-label">{t.pendingCases}</p>
            <span className="stat-icon">⏳</span>
          </div>
          <div className="stat-card purple">
            <p className="stat-number">{clients.length}</p>
            <p className="stat-label">{t.totalClients}</p>
            <span className="stat-icon">👥</span>
          </div>
        </div>

        {/* Chart + Recent Activity */}
        <div className="dashboard-middle">

          {/* Pie Chart */}
          <div className="dashboard-chart-card">
            <h2 className="dashboard-section-title">📊 Cases by Status</h2>
            {pieData.length === 0 ? (
              <div className="dashboard-empty">
                <p>No cases yet</p>
                <button className="dashboard-empty-btn" onClick={() => navigate('/cases')}>
                  + Create your first case
                </button>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent Activity */}
          <div className="dashboard-activity-card">
            <h2 className="dashboard-section-title">🕐 Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <p className="dashboard-empty-text">No recent activity</p>
            ) : (
              <div className="activity-list">
                {recentActivity.map(c => (
                  <div
                    key={c.caseId}
                    className="activity-item"
                    onClick={() => navigate(`/cases/${c.caseId}`)}
                  >
                    <div className={`activity-dot ${c.status}`} />
                    <div className="activity-info">
                      <span className="activity-type">{c.type}</span>
                      <span className="activity-desc">{c.description?.slice(0, 40)}...</span>
                    </div>
                    <span className="activity-date">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Cases Cards */}
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

        {/* All Cases Table */}
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