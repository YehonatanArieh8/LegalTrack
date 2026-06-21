const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  userRole: {
    type: DataTypes.ENUM('admin', 'manager', 'user'),
    defaultValue: 'user',
  },
  username: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark'),
    defaultValue: 'light',
  },
  language: {
    type: DataTypes.ENUM('en', 'he'),
    defaultValue: 'en',
  },
  notificationsEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'createDate',
  updatedAt: 'updateDate',
});