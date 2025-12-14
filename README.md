# NGO Impact Reporting App

A web application that allows NGOs to submit monthly impact reports (individually or in bulk) and enables an admin to view aggregated impact data through a dashboard.

This project was built as a take‑home assignment with a focus on **scalability, background processing, idempotency, and maintainability**, while keeping the UI simple and functional.

---

## Problem Context

NGOs submit monthly impact data such as people helped, events conducted, and funds utilized. As data volume grows, the system must:

* Accept bulk uploads without blocking the UI
* Handle partial failures in uploaded data
* Prevent duplicate reports for the same NGO and month
* Provide visibility into background processing

---

## Features

### Report Submission

* Form-based submission for a single NGO report
* Fields:

  * NGO ID
  * Month (YYYY-MM)
  * People Helped
  * Events Conducted
  * Funds Utilized
* Basic validation and error handling

### Bulk CSV Upload

* Upload CSV files containing multiple monthly reports
* File processing handled asynchronously in the backend
* Returns a Job ID on upload
* Progress tracking UI (e.g. processed rows vs total rows)
* Handles partial failures (invalid rows do not stop the job)

### Admin Dashboard

* View aggregated impact data for a selected month:

  * Total NGOs reporting
  * Total people helped
  * Total events conducted
  * Total funds utilized
* Optional month selector and region-based filtering
* Protected using JWT authentication

---

## Tech Stack

**Frontend**

* Next.js 16 (App Router)
* React 19
* Tailwind CSS
* Chart.js
* Lucide React

**Backend**

* Next.js API Routes
* Mongoose
* JWT Authentication

**Database**

* MongoDB

**Language**

* TypeScript

---

## Architecture Notes

* Single Next.js codebase for frontend and backend
* Background processing used for CSV uploads to avoid blocking requests
* Job status stored and exposed via polling endpoint
* Idempotency enforced to prevent duplicate NGO/month reports
* Clear separation between API routes, database models, and utilities

---

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── report/
│   │   │   ├── reports/
│   │   │   ├── jobs/
│   │   │   ├── dashboard/
│   │   │   └── login/
│   │   ├── dashboard/
│   │   ├── submit/
│   │   └── upload/
│   ├── components/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── models/
│   │   ├── middleware/
│   │   └── utils/
├── public/
├── uploads/          # Git-ignored (local only)
├── package.json
├── next.config.ts
├── tsconfig.json
└── vercel.json
```

---

## API Endpoints

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| POST   | `/api/login`                   | Admin login               |
| POST   | `/api/report`                  | Submit a single report    |
| POST   | `/api/reports/upload`          | Upload CSV file           |
| GET    | `/api/job-status/[jobId]`      | Get CSV processing status |
| GET    | `/api/dashboard?month=YYYY-MM` | Aggregated dashboard data |

### API Documentation (Experimental)

* Swagger UI available at `/api-docs`
* Provided as an experimental addition

---

## Setup Instructions

### Prerequisites

* Node.js 18+
* MongoDB (local or Atlas)

### Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file:

   ```env
   MONGODB_URI=mongodb://localhost:27017/wedogood_assignments
   JWT_SECRET=your_jwt_secret
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open:

   ```
   http://localhost:3000
   ```

---

## Docker Setup (Experimental)

```bash
docker-compose up
```

Starts:

* Next.js app on port 3000
* MongoDB on port 27017

Docker support is experimental and intended for local evaluation only.

---

## Demo Credentials

* **Username:** admin
* **Password:** admin

---

## Deployment

**Live Demo:** [https://ngo-task-zeta.vercel.app/](https://ngo-task-zeta.vercel.app/)

**Platform:** Vercel

### Notes on Deployment

* MongoDB is hosted externally
* Local file uploads are not persistent on Vercel
* For production use, a cloud storage service would be required for CSV uploads

---

## AI Tool Usage

AI tools were used during development for:

* Code scaffolding
* TypeScript type generation
* Debugging and refactoring assistance

Final implementation decisions and architecture were manually reviewed and adjusted.

---

## Possible Improvements

Given more time, the following could be improved:

* Retry logic for failed CSV rows
* Pagination and advanced filtering in the dashboard
* Queue-based background processing (e.g. Redis + worker)
* Structured logging and metrics
* More robust validation and schema enforcement

## Additional UI Enhancements

- Dark / light theme support
- Month selector in the dashboard
- Region-based filtering
- Progress indicators for CSV uploads
- Basic client-side validation and error states
