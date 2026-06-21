const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Folder', {
  folderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  caseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
}, {
  tableName: 'folders',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});