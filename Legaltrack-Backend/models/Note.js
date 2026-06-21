const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Note', {
  noteId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  caseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'notes',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});