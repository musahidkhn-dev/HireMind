# 🚀 HireMind – AI-Powered Hiring Platform

HireMind is a modern full-stack AI-powered hiring platform that connects job seekers with recruiters and companies. It streamlines recruitment using intelligent matching, clean UI, and scalable architecture.

---

## 🌟 Features

### 👨‍💼 For Job Seekers

* 🔍 Search jobs with filters (location, role, salary)
* 📄 Apply to jobs easily
* 📊 Track application status (Applied, Interview, Hired, etc.)
* 🤖 AI-based job matching score

### 🏢 For Recruiters

* 📝 Create and manage job postings
* 📥 View applicants in pipeline stages
* 📊 AI resume scoring
* 🔔 Real-time notifications

### 👑 For Admin (Super Admin)

* 📈 Platform analytics dashboard
* 👥 Manage users & companies
* 🏢 Monitor job listings
* ⚙️ Control system data

---

## 🧠 AI Features

* ✨ AI Job Description Generator
* 🎯 Resume Match Scoring
* 🤖 Smart candidate recommendations

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React.js (Vite)
* 🎨 Tailwind CSS
* 🧠 Redux Toolkit
* 🎞️ Framer Motion

### Backend

* 🟢 Node.js
* 🚀 Express.js
* 🍃 MongoDB + Mongoose
* 🔐 JWT Authentication
* 🔑 OAuth (Google & GitHub)

---

## 🔐 Authentication

* Email & Password login
* Google OAuth login
* GitHub OAuth login
* Role-based access:

  * Job Seeker
  * Recruiter

---

## 📂 Project Structure

```bash
HireMind/
│
├── client/            # Frontend (React)
├── server/            # Backend (Node.js)
├── models/            # MongoDB schemas
├── routes/            # API routes
├── controllers/       # Business logic
├── middleware/        # Auth & error handling
└── utils/             # Helpers & services
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/hiremind.git
cd hiremind
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=8080
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret

CLIENT_URL=http://localhost:3001

GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx

GITHUB_CLIENT_ID=xxxx
GITHUB_CLIENT_SECRET=xxxx
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Environment Variables

| Variable         | Description               |
| ---------------- | ------------------------- |
| MONGO_URI        | MongoDB connection string |
| JWT_SECRET       | Secret key for auth       |
| CLIENT_URL       | Frontend URL              |
| GOOGLE_CLIENT_ID | Google OAuth              |
| GITHUB_CLIENT_ID | GitHub OAuth              |

---

## 📸 Screenshots

* 🏠 Landing Page
* 📊 Dashboard
* 🧑‍💼 Recruiter Panel
* 📝 Job Listings

---

## 🚀 Future Enhancements

* 💬 Real-time chat system
* 📹 Interview scheduling
* 📊 Advanced analytics
* 📱 Mobile app

---

## 🤝 Contributing

Contributions are welcome!

```bash
fork → clone → create branch → commit → push → PR
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Author

**Musahid Khan**
💼 Full Stack Developer
🔗 GitHub: https://github.com/musahidkhn-dev

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
