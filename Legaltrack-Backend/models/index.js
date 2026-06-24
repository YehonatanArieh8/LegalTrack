const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

const User    = require('./User')(sequelize);
const Client  = require('./Client')(sequelize);
const Case    = require('./Case')(sequelize);
const Document = require('./Document')(sequelize);
const UserCase = require('./UserCase')(sequelize);
const Folder = require('./Folder')(sequelize);
const Note = require('./Note')(sequelize);

// One-to-many: Case → Folders
Case.hasMany(Folder, { foreignKey: 'caseId', as: 'folders' });
Folder.belongsTo(Case, { foreignKey: 'caseId', as: 'case' });

// One-to-many: Folder → Documents (optional folder)
Folder.hasMany(Document, { foreignKey: 'folderId', as: 'documents' });
Document.belongsTo(Folder, { foreignKey: 'folderId', as: 'folder' });

// One-to-many: User → Clients
User.hasMany(Client, { foreignKey: 'userId', as: 'clients' });
Client.belongsTo(User, { foreignKey: 'userId', as: 'lawyer' });

// One-to-many: Client → Cases
Client.hasMany(Case, { foreignKey: 'clientId', as: 'cases' });
Case.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// One-to-many: Case → Documents
Case.hasMany(Document, { foreignKey: 'caseId', as: 'documents' });
Document.belongsTo(Case, { foreignKey: 'caseId', as: 'case' });

// Many-to-many: User ↔ Case
User.belongsToMany(Case, { through: UserCase, foreignKey: 'userId', as: 'assignedCases' });
Case.belongsToMany(User, { through: UserCase, foreignKey: 'caseId', as: 'assignedLawyers' });

// One-to-many: Case → Notes
Case.hasMany(Note, { foreignKey: 'caseId', as: 'notes' });
Note.belongsTo(Case, { foreignKey: 'caseId', as: 'case' });

// One-to-many: User → Notes
User.hasMany(Note, { foreignKey: 'userId', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'author' });

module.exports = { sequelize, User, Client, Case, Document, Folder, Note, UserCase };
