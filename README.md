# Brainly Lite 🎓 (MERN Homework Help & Quiz Platform)

**Brainly Lite** is a simplified, responsive, and gamified peer-to-peer homework help and Q&A platform built on the MERN stack. Designed specifically as a high-quality portfolio project, it showcases full-stack engineering proficiency, clean folder architecture, database design, API testing, and modern dark-glassmorphic UI aesthetics.

---

## 🚀 Key Features

* **Secure Authentication**: Traditional Email & Password registry with password hashing (`bcryptjs`) and stateless session tracking (`jsonwebtoken`).
* **Points Gamification**:
  * New signups start with **100 points**.
  * Posting a question costs **10 points** (incentivizes participation).
  * Submitting an answer awards **15 points**.
  * Having your response accepted as the **Best Answer** by the author awards an additional **20 points**!
  * User rank titles adjust dynamically based on points (e.g. *Knowledge Seeker*, *Peer Mentor*, *Brainly Scholar*, *Grandmaster Mind*).
* **Question Feed & Subject Badges**: Browse feed items filtered by text searches, solved status, or subject tags (Math, Science, History, Biology, Literature).
* **Visual Problem Attachments**: Upload textbook figures or handwritten equation images. Integrates **Cloudinary API** with a smart **Local Disk Fallback** if Cloudinary keys are not provided.
* **Best Answer System**: Askers can mark the best response to their question, locking the thread as "Solved" and rewarding the helper.
* **Admin Moderation Panel**: Guarded panel allowing accounts with the `admin` role to monitor statistics and delete inappropriate questions directly.
* **Premium Dark glassmorphism**: Responsive design tailored mobile-first using **Tailwind CSS** and smooth entrance/exit micro-animations via **Framer Motion**.

---

## 🛠 Tech Stack

* **Frontend**: React 18 (Vite), React Router v6, Tailwind CSS, Framer Motion, Axios, Lucide React.
* **Backend**: Node.js, Express.js, Mongoose ODM, Multer, Cloudinary SDK.
* **Database**: MongoDB (Atlas or Local instance).
* **Testing**: Jest, Supertest.

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
│   │   ├── context/       # Auth state & Points global sync context
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
*Note: If Cloudinary keys are set to `mock`, the app automatically stores uploads on your local disk in `backend/public/uploads`.*

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
