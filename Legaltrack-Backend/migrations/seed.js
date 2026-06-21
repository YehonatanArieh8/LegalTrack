require('dotenv').config();
const { sequelize, User, Client, Case, UserCase } = require('../models');

const seed = async () => {
  await sequelize.sync({ force: false });

  // Create users
  const david = await User.create({
    firstName: 'David',
    lastName: 'Cohen',
    email: 'david@legaltrack.com',
    password: '123456',
    userRole: 'admin',
    username: 'David Cohen',
    theme: 'light',
    language: 'en',
    notificationsEnabled: true
  });

  const sarah = await User.create({
    firstName: 'Sarah',
    lastName: 'Levi',
    email: 'sarah@legaltrack.com',
    password: '123456',
    userRole: 'manager',
    username: 'Sarah Levi',
    theme: 'dark',
    language: 'he',
    notificationsEnabled: false
  });

  // Create clients
  const moshe = await Client.create({
    userId: david.userId,
    name: 'Moshe Shapiro',
    phone: '050-1234567',
    email: 'moshe@email.com',
    address: '14 Herzl St, Tel Aviv'
  });

  const rachel = await Client.create({
    userId: david.userId,
    name: 'Rachel Green',
    phone: '052-9876543',
    email: 'rachel@email.com',
    address: '8 Ben Gurion Blvd, Haifa'
  });

  // Create cases
  const case1 = await Case.create({
    clientId: moshe.clientId,
    type: 'Civil',
    status: 'open',
    description: 'Property dispute between neighbors'
  });

  const case2 = await Case.create({
    clientId: rachel.clientId,
    type: 'Contract',
    status: 'pending',
    description: 'Business contract review and dispute'
  });

  // Assign lawyers to cases (junction table)
  await UserCase.create({ userId: david.userId, caseId: case1.caseId });
  await UserCase.create({ userId: david.userId, caseId: case2.caseId });
  await UserCase.create({ userId: sarah.userId, caseId: case2.caseId });

  console.log('Seed completed successfully');
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});