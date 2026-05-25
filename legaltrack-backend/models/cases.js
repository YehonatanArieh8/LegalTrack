// Mock data for legal cases - stored in memory (resets on server restart)
const cases = [
  {
    caseId: 1,
    clientId: 1,
    userId: 1,
    type: "Civil",
    status: "open",
    description: "Property dispute between neighbors",
    openedDate: "2024-01-15T08:00:00Z",
    closedDate: null
  },
  {
    caseId: 2,
    clientId: 2,
    userId: 1,
    type: "Criminal",
    status: "pending",
    description: "Defense case for minor theft charge",
    openedDate: "2024-02-20T10:00:00Z",
    closedDate: null
  },
  {
    caseId: 3,
    clientId: 3,
    userId: 2,
    type: "Contract",
    status: "closed",
    description: "Business contract review and dispute",
    openedDate: "2024-03-05T09:00:00Z",
    closedDate: "2024-04-10T09:00:00Z"
  }
];

module.exports = cases;