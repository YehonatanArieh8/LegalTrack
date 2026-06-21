import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Card from '../../components/Card/Card';
import DataTable from '../../components/DataTable/DataTable';
import { getClients, createClient, updateClient, deleteClient } from '../../services/api';
import { useLanguage } from '../../i18n/LanguageContext';
import './ClientsPage.css';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formError, setFormError] = useState('');
  const { t } = useLanguage();

  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [editForm, setEditForm] = useState({ name: '', phone: '', email: '', address: '' });

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    try {
      const res = await getClients();
      if (res.success) setClients(res.data);
      else setError(res.error.message);
    } catch (err) {
      setError(t.loadingError);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) return setFormError(t.namePhoneEmailRequired);
    const res = await createClient({ ...form, userId: user.userId });
    if (res.success) {
      setShowForm(false);
      setForm({ name: '', phone: '', email: '', address: '' });
      setFormError('');
      fetchClients();
    } else {
      setFormError(res.error.message);
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setEditForm({ name: client.name, phone: client.phone, email: client.email, address: client.address || '' });
    setShowEditForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.phone || !editForm.email) return setFormError(t.namePhoneEmailRequired);
    const res = await updateClient(selectedClient.clientId, editForm);
    if (res.success) {
      setShowEditForm(false);
      setSelectedClient(null);
      setFormError('');
      fetchClients();
    } else {
      setFormError(res.error.message);
    }
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    const res = await deleteClient(clientId);
    if (res.success) fetchClients();
  };

  const clientColumns = [
    { key: 'clientId', label: t.id },
    { key: 'name', label: t.name },
    { key: 'phone', label: t.phone },
    { key: 'email', label: t.email },
    { key: 'address', label: t.address }
  ];

  if (loading) return <div className="clients-loading">{t.loading}</div>;

  return (
    <div className="clients-container">
      <Navbar />
      <div className="clients-content">
        <div className="clients-header">
          <h1 className="clients-title">{t.clients}</h1>
          <button className="clients-add-btn" onClick={() => setShowForm(true)}>{t.addClient}</button>
        </div>

        {error && <p className="clients-error">{error}</p>}

        <h2 className="clients-section-title">{t.allClients}</h2>
        <div className="clients-cards">
          {clients.map(c => (
            <Card
              key={c.clientId}
              title={c.name}
              body={`📧 ${c.email} | 📞 ${c.phone}`}
              footer={c.address || t.noAddress}
            />
          ))}
        </div>

        <h2 className="clients-section-title">{t.clientsTable}</h2>
        <DataTable
          columns={clientColumns}
          data={clients}
          emptyMessage={t.noClientsFound}
          actions={(row) => (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="clients-edit-btn" onClick={() => handleEdit(row)}>✏️ Edit</button>
              <button className="clients-delete-btn" onClick={() => handleDelete(row.clientId)}>🗑️ Delete</button>
            </div>
          )}
        />
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="clients-form-overlay">
          <div className="clients-form-card">
            <h2 className="clients-form-title">{t.addNewClient}</h2>
            <form onSubmit={handleSubmit}>
              {[
                { key: 'name', label: t.name, required: true },
                { key: 'phone', label: t.phone, required: true },
                { key: 'email', label: t.email, required: true },
                { key: 'address', label: t.address, required: false }
              ].map(field => (
                <div className="clients-form-field" key={field.key}>
                  <label className="clients-form-label">{field.label}{field.required && ' *'}</label>
                  <input
                    className="clients-form-input"
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.label}
                  />
                </div>
              ))}
              {formError && <p className="clients-form-error">{formError}</p>}
              <div className="clients-form-actions">
                <button type="button" className="clients-form-cancel" onClick={() => { setShowForm(false); setFormError(''); }}>{t.cancel}</button>
                <button type="submit" className="clients-form-submit">{t.addClient}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && (
        <div className="clients-form-overlay">
          <div className="clients-form-card">
            <h2 className="clients-form-title">Edit Client — {selectedClient?.name}</h2>
            <form onSubmit={handleUpdate}>
              {[
                { key: 'name', label: t.name, required: true },
                { key: 'phone', label: t.phone, required: true },
                { key: 'email', label: t.email, required: true },
                { key: 'address', label: t.address, required: false }
              ].map(field => (
                <div className="clients-form-field" key={field.key}>
                  <label className="clients-form-label">{field.label}{field.required && ' *'}</label>
                  <input
                    className="clients-form-input"
                    value={editForm[field.key]}
                    onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                    placeholder={field.label}
                  />
                </div>
              ))}
              {formError && <p className="clients-form-error">{formError}</p>}
              <div className="clients-form-actions">
                <button type="button" className="clients-form-cancel" onClick={() => { setShowEditForm(false); setFormError(''); }}>{t.cancel}</button>
                <button type="submit" className="clients-form-submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ClientsPage;