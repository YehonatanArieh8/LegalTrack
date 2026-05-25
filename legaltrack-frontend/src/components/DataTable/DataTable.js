import React from 'react';
import './DataTable.css';

const formatValue = (col, value) => {
  if (value === null || value === undefined) return '—';
  if (col.badge) return <span className={`table-badge ${value}`}>{value}</span>;
  if (col.date) {
    const d = new Date(value);
    return `${d.toLocaleDateString()} - ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return value;
};

const DataTable = ({ columns, data, emptyMessage = 'No data found.' }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {formatValue(col, row[col.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;