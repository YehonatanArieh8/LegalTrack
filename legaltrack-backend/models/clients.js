// Mock data for clients - stored in memory (resets on server restart)
const clients = [
  {
    clientId: 1,
    userId: 1,
    name: "Moshe Shapiro",
    phone: "050-1234567",
    email: "moshe@email.com",
    address: "14 Herzl St, Tel Aviv",
    joinedDate: "2024-01-10T08:00:00Z",
    createdAt: "2024-01-10T08:00:00Z"
  },
  {
    clientId: 2,
    userId: 1,
    name: "Rachel Green",
    phone: "052-9876543",
    email: "rachel@email.com",
    address: "8 Ben Gurion Blvd, Haifa",
    joinedDate: "2024-02-15T09:30:00Z",
    createdAt: "2024-02-15T09:30:00Z"
  },
  {
    clientId: 3,
    userId: 2,
    name: "Avi Katz",
    phone: "054-5556677",
    email: "avi@email.com",
    address: "3 Dizengoff St, Tel Aviv",
    joinedDate: "2024-03-20T11:00:00Z",
    createdAt: "2024-03-20T11:00:00Z"
  }
];

module.exports = clients;