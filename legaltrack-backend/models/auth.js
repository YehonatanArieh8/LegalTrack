// Mock auth data - simulates registered users with passwords
const authUsers = [
  {
    userId: 1,
    email: "david@legaltrack.com",
    password: "123456",
    firstName: "David",
    lastName: "Cohen",
    userRole: "admin"
  },
  {
    userId: 2,
    email: "sarah@legaltrack.com",
    password: "123456",
    firstName: "Sarah",
    lastName: "Levi",
    userRole: "manager"
  }
];

module.exports = authUsers;