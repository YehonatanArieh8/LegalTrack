// Mock data for users - stored in memory (resets on server restart)

const users = [
  {
    userId: 1,
    firstName: "David",
    lastName: "Cohen",
    createDate: "2024-01-10T08:00:00Z",
    updateDate: "2024-01-10T08:00:00Z",
    userRole: "admin"
  },
  {
    userId: 2,
    firstName: "Sarah",
    lastName: "Levi",
    createDate: "2024-02-15T09:30:00Z",
    updateDate: "2024-02-15T09:30:00Z",
    userRole: "manager"
  },
  {
    userId: 3,
    firstName: "Yossi",
    lastName: "Mizrahi",
    createDate: "2024-03-20T11:00:00Z",
    updateDate: "2024-03-20T11:00:00Z",
    userRole: "user"
  }
];

module.exports = users;