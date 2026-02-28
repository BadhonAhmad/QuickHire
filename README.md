# QuickHire - Job Board Application

A full-stack job board application built with **Next.js** (frontend) and **Node.js/Express** (backend) with **SQLite** database.

## Features

### For Job Seekers
- Browse job listings with search and filters
- Filter by category, location, and keyword
- View detailed job descriptions
- Apply for jobs with name, email, resume link and cover note

### For Employers (Admin)
- Post new job listings
- Manage existing jobs (view/delete)
- View received applications
- Dashboard with statistics

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | Next.js 16, React 19, TypeScript  |
| Styling   | Tailwind CSS 4                    |
| Backend   | Node.js, Express 5                |
| Database  | SQLite (via better-sqlite3)       |
| Icons     | Lucide React                      |

## Project Structure

```
QuickHire/
├── backend/
│   ├── data/                  # SQLite database file
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # DB connection & seed data
│   │   ├── middleware/
│   │   │   └── validators.js  # Input validation
│   │   ├── models/
│   │   │   ├── Job.js         # Job model
│   │   │   └── Application.js # Application model
│   │   ├── routes/
│   │   │   ├── jobs.js        # Job endpoints
│   │   │   └── applications.js# Application endpoints
│   │   └── server.js          # Express server entry
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     # Root layout with Navbar/Footer
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── globals.css    # Global styles
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx   # Jobs listing with filters
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Job detail + apply form
│   │   │   └── admin/
│   │   │       └── page.tsx   # Admin panel
│   │   ├── components/
│   │   │   ├── home/          # Landing page sections
│   │   │   ├── jobs/          # Job-related components
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   └── ui/            # Reusable UI components
│   │   └── lib/
│   │       ├── api.ts         # API client functions
│   │       ├── types.ts       # TypeScript interfaces
│   │       └── constants.ts   # App constants
│   └── package.json
│
└── README.md
```

## API Endpoints

### Jobs
| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | /api/jobs             | List jobs (with search/filter/pagination) |
| GET    | /api/jobs/featured    | Get featured jobs     |
| GET    | /api/jobs/latest      | Get latest jobs       |
| GET    | /api/jobs/categories  | Get categories with counts |
| GET    | /api/jobs/locations   | Get unique locations  |
| GET    | /api/jobs/stats       | Get dashboard stats   |
| GET    | /api/jobs/:id         | Get single job        |
| POST   | /api/jobs             | Create job (Admin)    |
| PUT    | /api/jobs/:id         | Update job (Admin)    |
| DELETE | /api/jobs/:id         | Delete job (Admin)    |

### Applications
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | /api/applications     | Submit application       |
| GET    | /api/applications     | List applications (Admin)|
| GET    | /api/applications/:id | Get single application   |
| DELETE | /api/applications/:id | Delete application       |

## Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 1. Clone the repository
```bash
git clone <repo-url>
cd QuickHire
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The API server will start on **http://localhost:5000**.  
The SQLite database is created automatically with seed data.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on **http://localhost:3000**.

### Environment Variables

**Backend** (`.env`):
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

No database connection string needed — SQLite runs locally.

## Database Schema

### Jobs Table
| Column       | Type     | Description          |
|--------------|----------|----------------------|
| id           | INTEGER  | Primary key          |
| title        | TEXT     | Job title            |
| company      | TEXT     | Company name         |
| location     | TEXT     | Job location         |
| category     | TEXT     | Job category         |
| type         | TEXT     | Full-time/Part-time etc |
| salary       | TEXT     | Salary range         |
| description  | TEXT     | Full description     |
| requirements | TEXT     | Newline-separated    |
| is_featured  | INTEGER  | Featured flag (0/1)  |
| created_at   | DATETIME | Timestamp            |

### Applications Table
| Column      | Type     | Description               |
|-------------|----------|---------------------------|
| id          | INTEGER  | Primary key               |
| job_id      | INTEGER  | FK → jobs.id (CASCADE)    |
| name        | TEXT     | Applicant name            |
| email       | TEXT     | Applicant email           |
| resume_link | TEXT     | URL to resume             |
| cover_note  | TEXT     | Optional cover note       |
| created_at  | DATETIME | Timestamp                 |
