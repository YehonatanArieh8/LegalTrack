const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Case', {
  caseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Civil', 'Criminal', 'Contract', 'Family', 'Labor', 'Other'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('open', 'pending', 'closed'),
    defaultValue: 'open',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  openedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  closedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'cases',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});