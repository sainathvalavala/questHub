# QuestHub 🎓 (MERN Homework Help & Q&A Platform)

**QuestHub** is a simplified, responsive, and gamified peer-to-peer homework help and Q&A platform built on the MERN stack. Designed specifically as a high-quality portfolio project, it showcases full-stack engineering proficiency, clean folder architecture, database design, API testing, and modern UI aesthetics with light/dark mode support.

---

## 🚀 Key Features

- **Dark/Light Theme System**: Toggle between 3 modes: Light, Dark, and System preference. Uses `localStorage` to persist user's theme choice, and has smooth transitions between modes!
- **Secure Authentication**: Traditional Email & Password registry with password hashing (`bcryptjs`) and stateless session tracking (`jsonwebtoken`).
- **Points Gamification**:
  - New signups start with **100 points**.
  - Posting a question costs **10 points** (incentivizes participation).
  - Submitting an answer awards **15 points**.
  - Having your response accepted as the **Best Answer** by the author awards an additional **20 points**!
- **Question Feed & Subject Badges**: Browse feed items filtered by text searches, solved status, or subject tags (HTML, CSS, JavaScript, React, Node.js, Other).
- **Visual Problem Attachments**: Upload textbook figures or handwritten equation images. Integrates **Cloudinary API** with a smart **Local Disk Fallback** if Cloudinary keys are not provided.
- **Best Answer System**: Askers can mark the best response to their question, locking the thread as "Solved" and rewarding the helper.
- **Admin Moderation Panel**: Guarded panel allowing accounts with the `admin` role to monitor statistics and delete inappropriate questions directly.
- **Responsive Design**: Mobile-first responsive UI using **Tailwind CSS** and smooth entrance/exit micro-animations via **Framer Motion**.

---

## 🛠 Tech Stack

- **Frontend**: React 18 (Vite), React Router v6, Tailwind CSS, Framer Motion, Axios, Lucide React.
- **Backend**: Node.js, Express.js, Mongoose ODM, Multer, Cloudinary SDK.
- **Database**: MongoDB (Atlas or Local instance).
- **Testing**: Jest, Supertest.

---

## 📂 Project Structure

```text
quizz/
├── backend/
│   ├── src/
│   │   ├── config/        # Mongoose connect & Cloudinary configs
│   │   ├── middleware/    # Auth and Admin role guards
│   │   ├── models/        # User, Question, and Answer Schemas
│   │   ├── routes/        # Auth, Question, and Answer API controllers
│   │   └── server.js      # App entrypoint (Express)
│   ├── src/tests/         # Integration test files (Jest & Supertest)
│   ├── .env.example       # Backend environmental key examples
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, Sidebar, QuestionCard, loaders
│   │   ├── context/       # Auth state & Theme toggle context
│   │   ├── pages/         # Feed, Ask, Detail, Profile, Admin, Login/Signup
│   │   ├── App.jsx        # Routing structure & guards
│   │   ├── main.jsx
│   │   └── index.css      # Custom Tailwind styling & glassmorphism utilities
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── package.json           # Root runner for concurrently orchestrating servers
```

---

## ⚙️ Local Configuration & Setup

### 1. Database Setup

Ensure you have MongoDB running locally at `mongodb://127.0.0.1:27017/quizz` OR create a free cluster on MongoDB Atlas.

### 2. Environmental Variables

Create a `.env` file in the `/backend` directory. You can copy the template:

```bash
cp backend/.env.example backend/.env
```

Fill in the configuration details:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/quizz # Swap with MongoDB Atlas connection if available
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=mock # Set to your Cloudinary name to enable cloud storage
CLOUDINARY_API_KEY=mock
CLOUDINARY_API_SECRET=mock
```

_Note: If Cloudinary keys are set to `mock`, the app automatically stores uploads on your local disk in `backend/public/uploads`._

### 3. Installation

From the root directory, install all dependencies for the root, backend, and frontend folders:

```bash
npm run install-all
```

### 4. Running the App

Start both the React development server (Vite, port 3000) and the Express API server (port 5000) concurrently:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Hosting & Deployment Guide

Here are simple, free (or low-cost) options to host your QuestHub app:

### 1. **Database: MongoDB Atlas (Free Forever!)**

MongoDB Atlas is MongoDB's official cloud hosting. They offer a free 512MB cluster:

- Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
- Sign up and create a "Shared Cluster" (free tier)
- Create a database user, and set your IP whitelist (or allow `0.0.0.0/0` for development)
- Copy your connection string (will look like `mongodb+srv://...`)

### 2. **Backend: Render.com (Free Tier)**

Render makes it easy to host Node.js/Express apps:

- Go to [https://render.com](https://render.com) and sign up with GitHub
- Click "New" → "Web Service"
- Connect your GitHub repo, choose the `backend` directory
- Add the following environment variables in the Render dashboard:
  - `MONGO_URI` (your MongoDB Atlas connection string)
  - `JWT_SECRET` (a long, random string)
  - `CLOUDINARY_CLOUD_NAME` (your Cloudinary cloud name, or `mock`)
  - `CLOUDINARY_API_KEY` (your API key, or `mock`)
  - `CLOUDINARY_API_SECRET` (your API secret, or `mock`)
- Set the "Start Command" to `npm start`
- Deploy!

### 3. **Frontend: Vercel or Netlify (Free Forever!)**

Both are great options for React/Vite apps!

**Option A: Vercel**

- Go to [https://vercel.com](https://vercel.com), sign up with GitHub
- Click "Add New" → "Project" → Import your repo
- In "Root Directory", choose `frontend`
- Add an environment variable: `VITE_API_URL` → your Render backend URL (e.g., `https://questhub-backend.onrender.com/api`)
- Click "Deploy"!

**Option B: Netlify**

- Go to [https://netlify.com](https://netlify.com), sign up with GitHub
- Click "Add new site" → "Import an existing project"
- Connect your repo, set build settings:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `dist`
- In "Site settings" → "Environment variables", add `VITE_API_URL` → your Render backend URL
- Deploy!

### 4. **Image Storage: Cloudinary (Free Tier)**

- Go to [https://cloudinary.com](https://cloudinary.com), sign up for free
- Get your `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` from the dashboard
- Add these to your backend environment variables!

---

## 🧪 Running Unit & Integration Tests

The backend includes a comprehensive Jest/Supertest integration suite covering Auth validations and Question CRUD endpoints.

To run the backend test suite:

```bash
npm run test
```

---

## 🔍 Demo Walkthrough Path (For Recruiters)

To demonstrate the full capability of the app, follow these steps:

1. **Create First Account (Admin)**: Register a user (e.g. `admin@test.com`). The first registered user in the database is automatically assigned the `admin` role. You will immediately notice a **+100 pts** score on the navbar.
2. **Create Second Account (User)**: Open an incognito tab and register a second user (e.g., `student@test.com`).
3. **Ask a Question**: Logged in as `student@test.com`, click **Ask a Question**. Submit a Math homework query. You will see points deduct by 10 (now **90 pts**).
4. **Answer the Question**: Logged in as `admin@test.com`, browse the feed, select the Math question, and submit a detailed answer. Your score will increase by 15 (now **115 pts**).
5. **Mark Best Answer**: Switch back to the student tab, refresh the question page, and click **Mark Best** on the admin's answer. The question status changes to **Solved** and the admin receives **+20 pts** (now **135 pts**).
6. **Moderate Content**: Logged in as `admin@test.com`, click the **Admin Panel** button in the navbar to monitor stats and moderate inappropriate posts.
