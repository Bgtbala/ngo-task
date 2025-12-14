# NGO Impact Reporting App

A full-stack Next.js application for NGOs to report impact data and for admins to view aggregated insights. Built with Next.js 16, MongoDB, and TypeScript.

## Features
- **Report Submission**: Single entry form for NGOs.
- **Bulk Upload**: Asynchronous CSV upload with progress tracking.
- **Admin Dashboard**: Aggregated statistics for people helped, events, and funds.
- **Background Processing**: Handles large CSV files without blocking the UI.
- **Additional Implementations**:
    - Region support & filtering.
    - JWT Authentication for Admin Dashboard.
    - Full-stack Next.js architecture with API routes.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, Tailwind CSS, Lucide React, Chart.js
- **Backend**: Next.js API Routes, Mongoose
- **Database**: MongoDB
- **Language**: TypeScript

## Setup Instructions

### Prerequisites
- Node.js 18+ & npm
- MongoDB (local or Atlas)

### Local Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory (or copy from `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/wedogood_assignments
   JWT_SECRET=your_jwt_secret_key_here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```
   
   **Note**: The `PORT` variable isn't used by Next.js (which runs on port 3000 by default), but kept for consistency.

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3000`

### Docker Setup (Experimental)

1. From the root directory, run:
   ```bash
   docker-compose up
   ```

   This will start:
   - Next.js app on port 3000
   - MongoDB on port 27017

   **Note**: Docker setup is experimental and may require further configuration for production environments.

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API routes
│   │   │   ├── login/
│   │   │   ├── report/
│   │   │   ├── reports/
│   │   │   ├── dashboard/
│   │   │   └── jobs/
│   │   ├── dashboard/        # Dashboard page
│   │   ├── login/            # Login page
│   │   ├── submit/           # Submit report page
│   │   └── upload/           # Upload page
│   └── components/           # React components
├── src/
│   ├── lib/
│   │   ├── db.ts             # MongoDB connection
│   │   ├── models/           # Mongoose models
│   │   ├── middleware/       # Auth middleware
│   │   └── utils/            # Utility functions
├── public/                   # Static assets
├── uploads/                  # Uploaded CSV files (gitignored)
├── package.json
├── next.config.ts
├── tsconfig.json
└── vercel.json               # Vercel deployment config
```

## API Routes

All API routes are Next.js API routes in `src/app/api/`:

- **POST /api/login**: Admin login
- **POST /api/report**: Submit JSON data
- **POST /api/reports/upload**: Upload CSV file
- **GET /api/job-status/[id]**: Get job processing status
- **GET /api/jobs/[id]/reports**: Get reports for a job
- **GET /api/dashboard**: Fetch stats (Requires `Authorization: Bearer <token>`)

**API Documentation**: Swagger documentation is available at `/api-docs` (experimental implementation).

## Admin Credentials (Demo)
- **Username**: `admin`
- **Password**: `admin123`

## Vercel Deployment

**Live URL**: [https://ngo-task-zeta.vercel.app/](https://ngo-task-zeta.vercel.app/)

This project is deployed on Vercel. The following environment variables are configured:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ADMIN_USERNAME` - Admin username
- `ADMIN_PASSWORD` - Admin password

**Note**: For file uploads to work on Vercel, you may need to use a cloud storage solution (like AWS S3, Cloudinary, or Vercel Blob) instead of local file system, as Vercel's file system is read-only except for `/tmp`.

## Development Approach & AI Tools

This project was built using a full-stack Next.js approach, consolidating both frontend and backend into a single application using Next.js API routes. The architecture leverages server-side rendering capabilities and modern React patterns for optimal performance.

AI coding tools, particularly antigravity, were extensively used throughout development for code generation, debugging, and architectural decisions. The AI assistance helped with implementing TypeScript types, setting up authentication middleware, creating API routes, and resolving build configuration issues. This collaborative approach with AI tools significantly accelerated development while maintaining code quality and following Next.js best practices.

## Notes

- **Docker & Swagger**: I tried to implement Docker and Swagger documentation, but they're not perfect - just my attempts at adding those features.
