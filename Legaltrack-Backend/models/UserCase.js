const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('UserCase', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  caseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'user_cases',
  timestamps: true,
  createdAt: 'assignedAt',
  updatedAt: false,
});