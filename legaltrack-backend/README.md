# LegalTrack Backend API

A RESTful backend API for the LegalTrack case management system, built with Node.js and Express.

## Installation

```bash
npm install
```

## Running the Server

```bash
node server.js
```

- Port: `5000`
- Base URL: `http://localhost:5000`
- API Base Path: `/`

## Project Structure

```
legaltrack-backend/
├── server.js               # Express app setup and middleware
├── routes/
│   ├── users.js
│   ├── clients.js
│   ├── cases.js
│   ├── auth.js
│   └── settings.js
├── controllers/
│   ├── usersController.js
│   ├── clientsController.js
│   ├── casesController.js
│   ├── authController.js
│   └── settingsController.js
├── models/
│   ├── users.js
│   ├── clients.js
│   ├── cases.js
│   ├── auth.js
│   └── settings.js
├── middleware/
│   ├── logger.js
│   ├── auth.js
│   └── identify.js
└── docs/
    └── LegalTrack API.postman_collection.json
```

## Authentication

This API uses role-based access control via the `x-user-role` request header.

| Role    | Permissions            |
|---------|------------------------|
| admin   | GET, POST, PUT, DELETE |
| manager | GET, POST, PUT         |
| user    | GET only               |

Example header:
```
x-user-role: admin
```

Routes that require user identity use the `x-user-id` header:
```
x-user-id: 1
```

---

## API Reference

### Auth

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "david@legaltrack.com",
  "password": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "mock-token-1",
    "user": {
      "userId": 1,
      "firstName": "David",
      "lastName": "Cohen",
      "email": "david@legaltrack.com",
      "userRole": "admin"
    }
  },
  "error": null
}
```

#### POST /auth/logout
Logout current user.

#### GET /auth/me
Get current logged-in user. Requires `x-user-id` header.

---

### Users

| Method | Path        | Description    | Auth Required |
|--------|-------------|----------------|---------------|
| GET    | /users      | Get all users  | No            |
| GET    | /users/:id  | Get user by ID | No            |
| POST   | /users      | Create a user  | manager+      |
| PUT    | /users/:id  | Update a user  | manager+      |
| DELETE | /users/:id  | Delete a user  | admin         |

#### POST /users - Request Body
```json
{
  "firstName": "Tal",
  "lastName": "Shapiro",
  "userRole": "user"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": { "userId": 4 },
  "error": null
}
```

**Error Response (404):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "User with id 999 not found",
    "details": {}
  }
}
```

---

### Clients

| Method | Path          | Description      | Auth Required |
|--------|---------------|------------------|---------------|
| GET    | /clients      | Get all clients  | No            |
| GET    | /clients/:id  | Get client by ID | No            |
| POST   | /clients      | Create a client  | manager+      |
| PUT    | /clients/:id  | Update a client  | manager+      |
| DELETE | /clients/:id  | Delete a client  | admin         |

#### POST /clients - Request Body
```json
{
  "userId": 1,
  "name": "Noa Peretz",
  "phone": "053-1112233",
  "email": "noa@email.com",
  "address": "5 Allenby St, Tel Aviv"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": { "clientId": 4 },
  "error": null
}
```

---

### Cases

| Method | Path        | Description   | Auth Required |
|--------|-------------|---------------|---------------|
| GET    | /cases      | Get all cases | No            |
| GET    | /cases/:id  | Get case by ID| No            |
| POST   | /cases      | Create a case | manager+      |
| PUT    | /cases/:id  | Update a case | manager+      |
| DELETE | /cases/:id  | Delete a case | admin         |

#### GET /cases - Query Params
| Param  | Type   | Required | Description                           |
|--------|--------|----------|---------------------------------------|
| status | string | No       | Filter by status: open/pending/closed |

#### POST /cases - Request Body
```json
{
  "clientId": 1,
  "userId": 1,
  "type": "Family",
  "description": "Divorce proceedings and custody arrangement"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": { "caseId": 4 },
  "error": null
}
```

---

### Settings

| Method | Path      | Description              | Auth Required      |
|--------|-----------|--------------------------|--------------------|
| GET    | /settings | Get settings for user    | x-user-id header   |
| PUT    | /settings | Update settings for user | x-user-id header   |

#### PUT /settings - Request Body
```json
{
  "username": "David Cohen",
  "email": "david@legaltrack.com",
  "theme": "dark",
  "language": "he",
  "notificationsEnabled": true
}
```

---

## Response Format

#### Success
```json
{
  "success": true,
  "data": { },
  "error": null
}
```

#### Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Client with id 999 not found",
    "details": {}
  }
}
```

## Status Codes

| Code | Meaning                          |
|------|----------------------------------|
| 200  | Successful GET / PUT / DELETE    |
| 201  | Successful POST (created)        |
| 400  | Validation error / missing field |
| 403  | Forbidden (insufficient role)    |
| 404  | Resource not found               |
| 500  | Internal server error            |

## Assumptions

- Data resets on server restart (in-memory only, no database)
- IDs are auto-incremented numeric values
- No real authentication — role passed via `x-user-role`, identity via `x-user-id`
- New cases default to `status: open` and `closedDate: null`
- When a case is set to `closed`, `closedDate` is set automatically
- The `address` field in clients is optional

## Configuration

The server port is configured in `.env`:

PORT=5000: Change this value if you need a different port. Update `REACT_APP_API_URL` in the frontend `.env` accordingly.