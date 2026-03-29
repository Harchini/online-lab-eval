# Online Lab Code Evaluation System

A full-stack MERN + Angular + EJS project showcasing **all major web technologies** — built for college lab evaluation.

---

## 🛠️ Technologies Used (with Advanced Techniques)

| Layer         | Technology        | Advanced Technique Used                          |
|---------------|-------------------|--------------------------------------------------|
| Server        | **Node.js**       | `child_process` to compile & run student code    |
| Server        | **Express.js**    | Custom Middleware (Auth + Request Logger)         |
| Database      | **MongoDB**       | Aggregation Pipeline (`$group`, `$sort`, `$lookup`) |
| Landing Page  | **EJS**           | EJS Partials (`include`)                          |
| Landing Page  | **HTML/CSS/JS**   | CSS Variables, Glassmorphism, ES6+ `async/await` |
| Student App   | **React.js**      | Context API + Custom Hooks (`useAuth`)            |
| Staff App     | **Angular**       | Standalone Components + Reactive Forms + FormArray|

---

## 📁 Folder Structure

```
online-lab-evaluation-system/
├── backend/              ← Node + Express + MongoDB + EJS
│   ├── config/db.js
│   ├── controllers/      ← authController, questionController, submissionController
│   ├── middleware/       ← authMiddleware (protect, staffOnly, requestLogger)
│   ├── models/           ← User, Question, Submission
│   ├── routes/           ← auth, questions, submissions
│   ├── utils/codeRunner.js
│   ├── views/            ← EJS landing page + partials
│   ├── public/           ← Static CSS & JS
│   ├── seed.js           ← Creates default staff & student accounts
│   ├── server.js         ← Main entry point
│   └── .env
│
├── frontend/
│   ├── student-app/      ← React + Vite (Student Portal)
│   │   └── src/
│   │       ├── context/AuthContext.jsx
│   │       └── pages/  ← Login, Questions, Solve
│   │
│   └── staff-app/        ← Angular (Staff Portal)
│       └── src/app/
│           ├── login/
│           ├── dashboard/
│           ├── guards/auth.guard.ts
│           └── services/ ← auth.service.ts, api.service.ts
```

---

## 🚀 How to Run (Command Prompt - Step by Step)

> **Pre-requisites:** Node.js, MongoDB (running locally on port 27017)

### Step 1 — Start MongoDB
Open a **new Command Prompt** window and run:
```
mongod
```
_(Keep this window open)_

---

### Step 2 — Setup & Seed the Database
Open a **new Command Prompt** in the project folder:
```
cd backend
node seed.js
```
This creates:
- ✅ Staff account → `STAFF001` / `staff123`
- ✅ Student account → `22CS001` / `student123`

---

### Step 3 — Start the Backend Server
In the same `backend` folder:
```
node server.js
```
Backend runs at → **http://localhost:5000**
EJS Landing Page → **http://localhost:5000/**

---

### Step 4 — Start the React Student App (Dev Mode)
Open another **new Command Prompt**:
```
cd frontend\student-app
npm run dev
```
Student Portal → **http://localhost:5173/**

---

### Step 5 — Start the Angular Staff App (Dev Mode)
Open another **new Command Prompt**:
```
cd frontend\staff-app
npm start
```
Staff Portal → **http://localhost:4200/**

---

## 🔑 Default Login Credentials

| Role    | Register No | Password   | URL                       |
|---------|-------------|------------|---------------------------|
| Staff   | STAFF001    | staff123   | http://localhost:4200/    |
| Student | 22CS001     | student123 | http://localhost:5173/    |

---

## 📋 Workflow

1. **Staff logs in** → Creates questions with multiple test cases & marks per test case
2. **Student logs in** → Selects a question → Writes JS code in the editor
3. Student clicks **▶ Run** → Sees output or error without submitting
4. Student clicks **✔ Submit** → Code runs against ALL test cases
5. **Partial marks** awarded per passing test case (e.g., 3/5 test cases = partial marks)
6. **Staff Dashboard** → Leaderboard (ordered by total marks) + All submissions log

---

## 🌐 API Endpoints

| Method | Endpoint                         | Access  | Description                  |
|--------|----------------------------------|---------|------------------------------|
| POST   | `/api/auth/register`             | Public  | Register a user              |
| POST   | `/api/auth/login`                | Public  | Login (returns JWT token)    |
| GET    | `/api/questions`                 | Both    | List all questions           |
| POST   | `/api/questions`                 | Staff   | Create a question            |
| DELETE | `/api/questions/:id`             | Staff   | Delete a question            |
| POST   | `/api/submissions/run`           | Student | Run code (no submission)     |
| POST   | `/api/submissions/submit`        | Student | Submit code for evaluation   |
| GET    | `/api/submissions/leaderboard`   | Staff   | Get ranked student marks     |
| GET    | `/api/submissions/all`           | Staff   | View all submissions         |
