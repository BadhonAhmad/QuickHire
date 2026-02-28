# QuickHire - Job Board Application

A full-stack job board application where job seekers can browse and apply for jobs, and admins can post and manage listings. Built with **Next.js** (frontend) and **Node.js/Express** (backend) with **SQLite** for persistent storage.

## Features

- **Job Listings Page** — Search by keyword, filter by category and location, paginated results
- **Job Detail Page** — Full description, requirements list, company info, and an "Apply Now" form (Name, Email, Resume URL, Cover Note)
- **Admin Panel** — Post new jobs, view/delete existing jobs, view/delete applications, dashboard stats
- **RESTful API** — Full CRUD for jobs and applications with input validation and proper error messages
- **Database** — SQLite with auto-seeded sample data (12 jobs across 8 categories)
- **Responsive Design** — Works on desktop, tablet, and mobile

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | Next.js 16, React 19, TypeScript  |
| Styling   | Tailwind CSS 4                    |
| Backend   | Node.js, Express 5                |
| Database  | SQLite (via better-sqlite3)       |
| Validation| express-validator                 |
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

## How to Run Locally

### Prerequisites

- **Node.js** v18 or higher — [download here](https://nodejs.org/)
- **npm** v9 or higher (comes with Node.js)

### Step 1 — Clone the repository

```bash
git clone https://github.com/BadhonAhmad/QuickHire.git
cd QuickHire
```

### Step 2 — Start the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (optional — defaults work out of the box):

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Then start the server:

```bash
npm run dev
```

The API will be running at **http://localhost:5000**.  
A SQLite database is **created automatically** with 12 sample jobs on first run — no manual setup needed.

### Step 3 — Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

The app will be running at **http://localhost:3000**.

### Step 4 — Use the App

| Page | URL |
|------|-----|
| Home (Landing Page) | http://localhost:3000 |
| Browse Jobs | http://localhost:3000/jobs |
| Job Detail | http://localhost:3000/jobs/1 |
| Admin Panel | http://localhost:3000/admin |

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
