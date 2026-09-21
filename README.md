# 🎓 College Management ERP System

A modern, full-featured, and secure **College Management & Enterprise Resource Planning (ERP)** web application built with **React**, **Node.js/Express**, **MongoDB**, **TailwindCSS**, **Framer Motion**, and **Playwright E2E Testing**.

---

## 🌟 Key Features

### 🧑‍🎓 Student Portal
- **Real-time Overview**: Attendance metrics, overall GPA/marks average, active assignments, and recent announcements.
- **Attendance Tracker**: Subject-wise and monthly attendance records with automatic low-attendance warnings.
- **Fee Management**: Transparent fee breakdown, invoice status, and one-click payment simulation.
- **Academic Results & Analytics**: Midterm and final exam grade breakdown with performance graphs.
- **Interactive Timetable & Calendar**: Weekly period schedule and college event dates.
- **Leave Applications**: Submit leave requests with reason and real-time status tracking.
- **E-Library & Achievements**: Access study materials, question papers, and honor badges.

### 👩‍🏫 Teacher / Faculty Portal
- **Classroom Overview**: Student directory, roll number index, and class statistics.
- **Live Attendance Recording**: One-click daily attendance marking (Present / Absent).
- **Marks & Grading System**: Submit and update exam scores, percentage calculation, and automated grade assignment.
- **Curriculum & Timetable**: Schedule management across assigned grades and subjects.
- **Communication**: Broadcast notifications and direct messaging with students.

### 🏛️ Principal / Executive Administration Portal
- **Institution Analytics**: Total student strength, active faculty count, revenue breakdown, and fee arrears audits.
- **College-wide Announcements**: Create and publish priority notices to students, faculty, or all members.
- **Leave Approvals & Disciplinary Logs**: Monitor staff/student leave requests and student conduct records.
- **Department Performance**: High-level faculty ratings and departmental summaries.

### 🤖 AI Teaching Assistant (Chatbot)
- Floating AI assistant capable of answering ERP inquiries, student performance questions, and college FAQs.
- Supports both OpenAI GPT-4o-mini integration and local LLM / Ollama fallbacks.

---

## 📂 Project Architecture

```
college-management-final/
├── frontend/                  # React + Vite + TailwindCSS Single Page App
│   ├── e2e/                   # Automated Playwright E2E test suites
│   │   ├── auth.spec.js       # Login, register, demo navigation tests
│   │   ├── student.spec.js    # Student portal, tabs, leave & fee flows
│   │   ├── teacher.spec.js    # Teacher portal, attendance & mark entry
│   │   ├── principal.spec.js  # Principal analytics & announcements
│   │   ├── chatbot.spec.js    # AI Chatbot interactive widget tests
│   │   └── navigation.spec.js # Role protection & security redirect tests
│   ├── src/
│   │   ├── components/        # Glassmorphism UI & Dashboard widgets
│   │   ├── context/           # AuthContext & State management
│   │   ├── pages/             # Student, Teacher, Principal, Login, Register
│   │   ├── routes/            # RoleRoute & PrivateRoute route guards
│   │   ├── services/          # Axios API client & Authentication service
│   │   ├── App.jsx            # Animated routing & ErrorBoundary
│   │   └── main.jsx           # React DOM root
│   ├── playwright.config.js   # Playwright configuration
│   └── package.json           # Frontend dependencies & scripts
│
├── backend/                   # Node.js + Express + MongoDB REST API
│   ├── config/                # Database connection & environment setup
│   ├── controllers/           # Modular request controllers (Auth, Student, Teacher, Principal)
│   ├── middleware/            # JWT authentication & Role-based check
│   ├── models/                # Mongoose models (User, Student, Teacher, Fee, Mark, Timetable, etc.)
│   ├── routes/                # Express API route endpoints
│   ├── seed.js                # Database seeder with sample data
│   ├── server.js              # Express server entry point
│   ├── .env.example           # Backend environment configuration template
│   └── package.json           # Backend dependencies & scripts
│
├── package.json               # Root workspace runner scripts
└── README.md                  # System documentation
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# In the project root:
npm run install:all
```

### 2. Configure Environment
Create `backend/.env` from `backend/.env.example`:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/college-erp
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=
```

### 3. Seed Database (Optional)
```bash
npm run seed
```
Demo Credentials:
- **Student**: `alice@demo.edu` / `password123`
- **Teacher**: `sarah@demo.edu` / `password123`
- **Principal**: `james@demo.edu` / `password123`

### 4. Start Development Servers
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`

---

## 🧪 Playwright End-to-End Testing

Playwright tests verify all core functionality across every user role:

```bash
# Run all E2E tests headlessly
npm run test:e2e

# Run with interactive UI mode
npm run test:e2e:ui
```

---

## 🌐 Landing Page & Public University Portal (Unipix University)
- **Classic Academic Aesthetic**: Custom Gothic architecture hero with official Unipix laurel wreath crest and Playfair/Cinzel typography.
- **Our Programs Bento Grid**: Dynamic exploration of Undergraduate, Graduate, Lifelong Learning, and Global Exchange majors with custom badges and directional indicator.
- **Heritage & Story Section**: Deep crimson narrative banner highlighting 130+ years of academic excellence and research libraries.
- **Transparent Tuition & Fee Schedule**: Interactive undergraduate and graduate cost breakdowns with semester and annual fee calculators.
- **Campus Life Showcase**: Student organizations, athletics, residential halls, and cultural festivals.
- **Interactive Admissions Inquiry**: Fast online application form with instant reference confirmation.
- **Campus Events & Global Accreditations**: Key symposiums, dates, and AACSB / EQUIS partner badges.
- **Alumni Gazette Newsletter**: Instant subscription bar.
- **Fast ERP Quick-Access**: One-click jump to Student, Faculty, and Dean portals.

---

## ☁️ Deploying to Vercel

The project is fully pre-configured for Vercel deployment with `vercel.json` SPA routing support:

### Option A: Deploy via Vercel CLI (Recommended)
```bash
# Install Vercel CLI if needed
npm i -g vercel

# In project root:
vercel --prod
```

### Option B: Deploy via Vercel Dashboard (GitHub / GitLab / Bitbucket)
1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), select your repository.
3. If deploying the **entire monorepo**:
   - Framework Preset: **Vite**
   - Root Directory: `./` (or leave default)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
4. If deploying **frontend only**:
   - Root Directory: `frontend`
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Configure Environment Variables in Vercel:
   - `VITE_API_URL`: Your deployed backend API URL (e.g. `https://your-api.onrender.com/api`)

---

## 🔒 Security & Design Standards
- **JWT Authentication** with role-based access control (RBAC).
- **Glassmorphism Design System** with dark mode aesthetics and Framer Motion micro-animations.
- **Graceful Fallbacks**: Interactive demo state when running offline or without database connectivity.

