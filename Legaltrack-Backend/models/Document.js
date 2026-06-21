const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Document', {
  documentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  caseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  mimetype: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  aiSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  folderId: {
  type: DataTypes.INTEGER,
  allowNull: true,
  defaultValue: null,
},
}, {
  tableName: 'documents',
  timestamps: true,
  createdAt: 'uploadDate',
  updatedAt: false,
});