# TaskFlow — Full-Stack Task Management Dashboard

A modern task management web application built with **React, Node.js, Express, and MySQL**. TaskFlow helps users organize tasks, track progress, and manage their workflow through a clean dashboard.

## ✨ Features

- **Dashboard:** View total tasks, pending tasks, tasks in progress, and completed tasks.
- **Task Management:** Create, view, edit, and delete tasks.
- **Status Tracking:** Move tasks between To Do, In Progress, and Completed.
- **Task Filtering:** Filter tasks by their current status.
- **Persistent Storage:** Store task data in MySQL.
- **REST API:** Communicate between the React frontend and Express backend.
- **Responsive UI:** Dashboard layout adapts to smaller screens.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Frontend development server and build tool |
| Node.js | JavaScript runtime |
| Express.js | Backend REST API |
| MySQL | Relational database |
| mysql2 | MySQL database connectivity |
| CSS | Dashboard styling |
| Git and GitHub | Version control and source hosting |

## 📁 Project Structure

```text
taskflow/
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── db.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── api.js
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

## ✅ Prerequisites

Install the following before running the project:

- Node.js and npm
- MySQL Server
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd taskflow
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Create the MySQL database

Open your MySQL client and run:

```sql
CREATE DATABASE taskflow;
USE taskflow;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('To Do', 'In Progress', 'Completed')
        NOT NULL DEFAULT 'To Do',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configure the backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=taskflow
DB_PORT=3306
PORT=5000
```

Replace `YOUR_MYSQL_PASSWORD` with your local MySQL password. Never commit this file to GitHub.

Start the backend:

```bash
node server.js
```

The API should be available at `http://localhost:5000`.

### 4. Configure the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API health |
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Example: Create a task

```json
{
  "title": "Learn Docker",
  "description": "Containerize the TaskFlow application"
}
```

Send this JSON body in a `POST` request to `/api/tasks`.

## 🧪 Running the Project

Run the frontend and backend in separate terminals. Ensure MySQL is running and the backend `.env` file contains valid credentials.

## 🔐 Security Notes

- Never