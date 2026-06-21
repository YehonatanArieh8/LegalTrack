import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Card from '../../components/Card/Card';
import DataTable from '../../components/DataTable/DataTable';
import { getCases, createCase, updateCase, deleteCase, getClients } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import './CasesPage.css';

const CasesPage = () => {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [formError, setFormError] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({ clientId: '', type: '', description: '' });
  const [editForm, setEditForm] = useState({ clientId: '', type: '', status: '', description: '' });

  useEffect(() => { fetchData(); }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientId || !form.type || !form.description) return setFormError(t.allFieldsRequired);
    const res = await createCase({
      clientId: parseInt(form.clientId),
      userId: user.userId,
      type: form.type,
      description: form.description
    });
    if (res.success) {
      setShowForm(false);
      setForm({ clientId: '', type: '', description: '' });
      setFormError('');
      fetchData();
    } else {
      setFormError(res.error.message);
    }
  };

  const handleEdit = (c) => {
    setSelectedCase(c);
    setEditForm({ clientId: c.clientId, type: c.type, status: c.status, description: c.description });
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.clientId || !editForm.type || !editForm.status || !editForm.description) return setFormError(t.allFieldsRequired);
    const res = await updateCase(selectedCase.caseId, editForm);
    if (res.success) {
      setShowEditForm(false);
      setSelectedCase(null);
      setFormError('');
      fetchData();
    } else {
      setFormError(res.error.message);
    }
  };

  const handleDelete = async (caseId) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return;
    const res = await deleteCase(caseId);
    if (res.success) fetchData();
  };

  const filteredCases = filter ? cases.filter(c => c.status === filter) : cases;

  const caseColumns = [
    { key: 'caseId', label: t.id },
    { key: 'type', label: t.type },
    { key: 'status', label: t.status, badge: true },
    { key: 'description', label: t.description },
    { key: 'openedDate', label: t.opened, date: true },
  ];

  if (loading) return <div className="cases-loading">{t.loading}</div>;

  return (
    <div className="cases-container">
      <Navbar />
      <div className="cases-content">
        <div className="cases-header">
          <h1 className="cases-title">{t.cases}</h1>
          <button className="cases-add-btn" onClick={() => setShowForm(true)}>{t.addCase}</button>
        </div>

        <div className="cases-filter">
          {['', 'open', 'pending', 'closed'].map(status => (
            <button
              key={status}
              className={`cases-filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status === '' ? t.all : t[status]}
            </button>
          ))}
        </div>

        {error && <p className="cases-error">{error}</p>}

        <h2 className="cases-section-title">{t.casesOverview}</h2>
        <div className="cases-cards">
          {filteredCases.slice(0, 3).map(c => (
            <Card
              key={c.caseId}
              title={c.type}
              badge={c.status}
              body={c.description}
              footer={`${t.opened}: ${new Date(c.openedDate).toLocaleDateString()}`}
            />
          ))}
        </div>

        <h2 className="cases-section-title">{t.casesTable}</h2>
        <DataTable
          columns={caseColumns}
          data={filteredCases}
          emptyMessage={t.noCasesFound}
          actions={(row) => (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="cases-view-btn" onClick={() => navigate(`/cases/${row.caseId}`)}>👁️ View</button>
              <button className="cases-edit-btn" onClick={() => handleEdit(row)}>✏️ Edit</button>
              <button className="cases-delete-btn" onClick={() => handleDelete(row.caseId)}>🗑️ Delete</button>
            </div>
          )}
        />
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="cases-form-overlay">
          <div className="cases-form-card">
            <h2 className="cases-form-title">{t.addNewCase}</h2>
            <form onSubmit={handleSubmit}>
              <div className="cases-form-field">
                <label className="cases-form-label">{t.client} *</label>
                <select className="cases-form-select" value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })}>
                  <option value="">{t.selectClient}</option>
                  {clients.map(c => <option key={c.clientId} value={c.clientId}>{c.name}</option>)}
                </select>
              </div>
              <div className="cases-form-field">
                <label className="cases-form-label">{t.type} *</label>
                <select className="cases-form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="">{t.selectType}</option>
                  {['Civil', 'Criminal', 'Contract', 'Family', 'Labor'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="cases-form-field">
                <label className="cases-form-label">{t.description} *</label>
                <input
                  className="cases-form-input"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder={t.descriptionPlaceholder}
                />
              </div>
              {formError && <p className="cases-form-error">{formError}</p>}
              <div className="cases-form-actions">
                <button type="button" className="cases-form-cancel" onClick={() => { setShowForm(false); setFormError(''); }}>{t.cancel}</button>
                <button type="submit" className="cases-form-submit">{t.addCase}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && (
        <div className="cases-form-overlay">
          <div className="cases-form-card">
            <h2 className="cases-form-title">Edit Case #{selectedCase?.caseId}</h2>
            <form onSubmit={handleUpdate}>
              <div className="cases-form-field">
                <label className="cases-form-label">{t.client} *</label>
                <select className="cases-form-select" value={editForm.clientId} onChange={e => setEditForm({ ...editForm, clientId: e.target.value })}>
                  {clients.map(c => <option key={c.clientId} value={c.clientId}>{c.name}</option>)}
                </select>
              </div>
              <div className="cases-form-field">
                <label className="cases-form-label">{t.type} *</label>
                <select className="cases-form-select" value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })}>
                  {['Civil', 'Criminal', 'Contract', 'Family', 'Labor'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="cases-form-field">
                <label className="cases-form-label">Status *</label>
                <select className="cases-form-select" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                  {['open', 'pending', 'closed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="cases-form-field">
                <label className="cases-form-label">{t.description} *</label>
                <input
                  className="cases-form-input"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
              {formError && <p className="cases-form-error">{formError}</p>}
              <div className="cases-form-actions">
                <button type="button" className="cases-form-cancel" onClick={() => { setShowEditForm(false); setFormError(''); }}>{t.cancel}</button>
                <button type="submit" className="cases-form-submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CasesPage;