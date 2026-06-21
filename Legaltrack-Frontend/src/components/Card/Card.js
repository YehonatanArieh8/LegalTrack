import React from 'react';
import './Card.css';

const Card = ({ title, badge, body, footer }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        {badge && (
          <span className={`card-badge ${badge}`}>
            {badge}
          </span>
        )}
      </div>
      {body && <p className="card-body">{body}</p>}
      {footer && <p className="card-footer">{footer}</p>}
    </div>
  );
};

export default Card;