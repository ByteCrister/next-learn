# Next Learn

<center>

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.17.0-47A248?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

**A comprehensive study planning and course management platform with hierarchical roadmaps, assessments, and scheduling tools.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-configuration) • [Tech Stack](#-tech-stack)

<center>

---

## 📋 Overview

**Next Learn** is a full-stack educational web platform that helps students and educators organize study materials, create learning roadmaps, and manage assessments and routines — all within an authenticated, user-friendly system.

### Core Capabilities

- **Structured Content:** Subjects → Roadmaps → Chapters with rich text editing
- **Assessment System:** Exams with automated grading and history tracking
- **Scheduling Tools:** Study routines, event calendars, and dashboards
- **Authentication:** Secure JWT-based login with Google OAuth integration

---

## ✨ Features

### 📚 Educational Content Management

- Create and organize subjects with titles, codes, and metadata
- Build **course roadmaps** using the **TipTap** rich text editor
- Nest chapters inside roadmaps for detailed learning paths
- Write personal notes and attach **external resources**

### 📝 Assessment System

- Create and edit exams with multiple question types
- Support for **timed** exams and auto-submission
- Instant grading and **score tracking**
- Historical results and analytics dashboard

### 📅 Scheduling & Organization

- Custom study routines and recurring events
- **Interactive calendar** with color-coded deadlines
- Centralized **dashboard** for quick overviews

### 🔐 Authentication & Security

- **NextAuth.js** with credentials and Google OAuth providers
- Configurable session expiry (24h or 30 days)
- **JWT tokens** with secure cookie handling
- Middleware-based route protection

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18.x
- MongoDB (Local or Atlas)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/ByteCrister/next-learn.git
cd next-learn

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env.local` file in the root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/next-learn
# or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/next-learn

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Run the Development Server
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/c

## Getting Started

First, run the development server:

```bash
npm run dev
```

Then open: [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

### Frontend

| Technology        | Version  | Purpose                  |
| ----------------- | -------- | ------------------------ |
| **Next.js**       | 15.4.5   | App Router + SSR         |
| **React**         | 19.1.0   | UI library               |
| **TypeScript**    | 5.x      | Type safety              |
| **Tailwind CSS**  | 4.x      | Styling                  |
| **TipTap**        | 3.0.9    | Rich text editing        |
| **Zustand**       | 5.0.7    | State management         |
| **Radix UI**      | Latest   | Accessible UI primitives |
| **Material-UI**   | 7.2.0    | UI components            |
| **Framer Motion** | 12.23.12 | Animations               |

### Backend

| Technology             | Version | Purpose          |
| ---------------------- | ------- | ---------------- |
| **Next.js API Routes** | 15.4.5  | Backend API      |
| **MongoDB**            | 8.17.0  | Database         |
| **Mongoose**           | 8.17.0  | ODM              |
| **NextAuth.js**        | 4.24.11 | Authentication   |
| **bcryptjs**           | 3.0.2   | Password hashing |
| **jsonwebtoken**       | 9.0.2   | JWT handling     |

### Additional Libraries

- **Validation:** Zod, Yup
- **Forms:** React Hook Form, Formik
- **HTTP:** Axios
- **Calendar:** react-big-calendar
- **Notifications:** react-toastify
- **DnD:** @dnd-kit

---

## 📁 Project Structure

```
next-learn/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── subjects/
│   │   ├── exams/
│   │   ├── routines/
│   │   └── api/
│   │       ├── auth/
│   │       ├── subjects/
│   │       ├── roadmaps/
│   │       ├── exams/
│   │       ├── results/
│   │       └── dashboard/
│   ├── components/
│   │   ├── ui/
│   │   ├── subjects/
│   │   ├── Editor/
│   │   └── providers/
│   ├── models/
│   │   ├── User.ts
│   │   ├── Subject.ts
│   │   ├── CourseRoadmap.ts
│   │   ├── Exam.ts
│   │   └── ExamResult.ts
│   ├── store/
│   │   ├── useDashboardStore.ts
│   │   ├── useSubjectsStore.ts
│   │   └── useEventsStore.ts
│   ├── utils/
│   │   ├── auth/
│   │   ├── api/
│   │   └── helpers/
│   └── config/
│       └── ConnectDB.ts
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── .env.local
```

---

## 🔧 Configuration

### Database Models

| Model             | Purpose                          |
| ----------------- | -------------------------------- |
| **User**          | Authentication and profile data  |
| **Subject**       | Top-level educational categories |
| **CourseRoadmap** | Structured course paths          |
| **Exam**          | Assessment definitions           |
| **ExamResult**    | Scores and submissions           |
| **Event**         | Calendar events and reminders    |

### Authentication Flow

- **Credentials Provider:** Email/password via bcrypt
- **Google OAuth:** Secure sign-in via NextAuth
- **Session Lifetimes:**

  - Default: 24 hours
  - With “Remember Me”: 30 days

### State Management

- `useDashboardStore`: Profile & content stats
- `useSubjectsStore`: Subject/roadmap data
- `useEventsStore`: Calendar events

---

## 📚 API Endpoints

### Authentication

- `POST /api/auth/signin` — Login
- `POST /api/auth/signout` — Logout
- `GET /api/auth/session` — Session info

### Subjects

- `GET /api/subjects` — List subjects
- `POST /api/subjects` — Create
- `PUT /api/subjects/:id` — Update
- `DELETE /api/subjects/:id` — Delete

### Roadmaps

- `GET /api/roadmaps` — Retrieve
- `POST /api/roadmaps` — Create
- `PUT /api/roadmaps/:id` — Update
- `DELETE /api/roadmaps/:id` — Delete

### Exams

- `GET /api/exams` — List
- `POST /api/exams` — Create
- `POST /api/exams/join` — Participate
- `GET /api/results` — View results

### Public

- `GET /api/view/subject` — Public subject view
- `GET /api/view/notes` — Shared notes view

---

## 🎨 Styling

- **Framework:** Tailwind CSS
- **Fonts:** Inter (primary), Sora (secondary)
- **Theme:** Dark/light with custom palette
- **Enhancements:** Typography plugin, smooth animations

---

## 🔒 Security

- JWT-based authentication
- Bcrypt password hashing
- Route-level access control
- User data isolation per session
- CSRF and HTTPS enforced
- Secrets stored in `.env.local`

---

## 🚢 Deployment

### Using Vercel (Recommended)

1. Push to GitHub
2. Import into [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

**Requirements:**

- Node.js ≥ 18
- MongoDB connection string
- Configured environment variables

---

## 📝 Development Scripts

```bash
npm run dev       # Development (Turbopack)
npm run build     # Production build
npm start         # Start production server
npm run lint      # Lint codebase
```

---

## 🤝 Contributing

This is a **private project**, but internal contributors can:

1. Fork the repository
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is **private and proprietary**.
All rights reserved © ByteCrister.

---

## 🐛 Roadmap

- [ ] Real-time collaboration
- [ ] Mobile application
- [ ] Roadmap export feature
- [ ] Advanced analytics dashboard
- [ ] Notification & alert system

---

## 📞 Support

For inquiries or bug reports:

- Open a GitHub issue
- Contact the development team directly

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI from [Radix UI](https://www.radix-ui.com/) and [Material-UI](https://mui.com/)
- Rich text editing via [TipTap](https://tiptap.dev/)
- Authentication powered by [NextAuth.js](https://next-auth.js.org/)

---

<div style="text-align:center;">
Made by <strong>ByteCrister & Adil</strong>
</div>
