import React, { useEffect, useState } from 'react';
import socket from '../../services/socket';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('case:created', (data) => {
      addNotification(`New case created: ${data.type} - ${data.description}`);
    });

    socket.on('case:updated', (data) => {
      addNotification(`Case #${data.caseId} status updated to: ${data.status}`);
    });

    socket.on('document:uploaded', (data) => {
      addNotification(`New document uploaded: ${data.filename}`);
    });

    return () => {
      socket.off('case:created');
      socket.off('case:updated');
      socket.off('document:uploaded');
    };
  }, []);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notifications-container">
      {notifications.map(n => (
        <div key={n.id} className="notification-item">
          🔔 {n.message}
        </div>
      ))}
    </div>
  );
};

export default Notifications;