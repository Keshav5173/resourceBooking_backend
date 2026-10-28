# Resource Hub – Backend

A REST API built with Node.js, Express, and MongoDB for managing resources and bookings. It handles authentication, role-based access, booking creation and history, admin booking stats, and a daily job that updates booking statuses.

- **Backend repository:** https://github.com/Keshav5173/resourceBooking_backend
- **Frontend repository:** https://github.com/Keshav5173/resourceBooking_frontend

## Features

- User authentication with hashed passwords (bcrypt) and JWT-based sessions.
- Role-based access: regular users and admins (`role: "admin"`).
- Resources: list all resources, with their booked dates, and create new ones (admin).
- Bookings: create a booking for a resource on a date, and fetch the signed-in user's booking history with resource details.
- Admin stats: one endpoint returning every booking joined with its user and resource (MongoDB aggregation).
- Scheduled job that moves bookings through `PENDING` → `ONBOARDED` → `COMPLETED` every day at 1 AM.
- Centralised async error handling and consistent JSON responses.

## Tech stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js (ES modules) |
| Framework | Express 5 |
| Database | MongoDB with Mongoose 9 |
| Auth | jsonwebtoken, bcrypt, cookie-parser |
| Scheduling | node-cron |
| Config and tooling | dotenv, cors, nodemon |

## Prerequisites

- Node.js 20 or newer, with npm
- MongoDB, either a local install (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/Keshav5173/resourceBooking_backend.git
cd resourceBooking_backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env     # on Windows: copy .env.example .env
# then edit .env with your values

# 4. Start the server (uses nodemon, so it restarts on file changes)
npm run start
```

The API runs at **http://localhost:5000** by default.


### Example: create a resource


## Scheduled job

A cron job (`node-cron`) runs every day at **01:00** in the configured timezone and updates bookings by date:

| Condition | Change |
| --- | --- |
| Booking date is today and status is `PENDING` | → `ONBOARDED` |
| Booking date is before today and status is `ONBOARDED` | → `COMPLETED` |

The job logs how many bookings it updated on each run. The schedule and the timezone (`CRON_TIMEZONE`) are set in the job file.

## Project structure


```
.
├── index.js            # Entry point: connects to MongoDB and starts the server
├── app.js              # Express app: middleware and route mounting
└── src/
    ├── controllers/    # Request handlers (resource, booking, user)
    ├── models/         # Mongoose schemas (User, Resource, Booking)
    ├── routes/         # Route definitions
    ├── middlewares/    # Auth and role checks
    ├── scheduler/           # Scheduled booking status job
    └── utils/          # asyncHandler and shared 
```

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run start` | Runs `nodemon index.js` with automatic restarts |

## Project explanation

I built the backend with Express and Mongoose, separating routes, controllers, models, and middleware so each layer has one job. Controllers are wrapped in an `asyncHandler` and return consistent `{ success, message, data }` responses, with validation for required fields and clear status codes. Authentication uses bcrypt-hashed passwords and JWTs, and admin-only endpoints such as creating resources and viewing booking stats are protected by role checks. Booking history uses `populate` to attach resource details, while the stats endpoint uses an aggregation with `$lookup` to join bookings with users and resources in one query. A node-cron job runs daily at 1 AM and moves bookings from PENDING to ONBOARDED to COMPLETED based on their date. With more time I would add automated tests for the booking endpoints and server-side pagination for the history and stats responses.

## Author

Keshav Bhardwaj