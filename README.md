# ZimProvisional 🚗

**ZimProvisional** is a modern, full-stack web application designed to help students prepare for the Zimbabwean Provisional Driving Test. It provides a comprehensive platform for practicing test questions, tracking progress, and managing administrative tasks.

🔗 **Live Demo:** [zdc.chimaliro.com](https://zdc.chimaliro.com)

---

## 🚀 Features

### 👤 For Students

- **Practice Tests**: Take timed or untimed practice tests with randomized questions.
- **Instant Feedback**: Get immediate results with detailed explanations for correct and incorrect answers.
- **Progress Tracking**: View test history, scores, and pass/fail status.
- **Responsive Design**: Optimized for both desktop and mobile devices for on-the-go revision.
- **User Dashboard**: Personalized dashboard showing recent activity and performance metrics.

### 🛡️ For Admins

- **Dashboard**: Overview of system statistics (users, total tests, pass rates).
- **Question Management**: Create, update, and delete questions with support for image uploads.
- **User Management**: View and manage registered users.
- **Test Results**: Monitor user performance and test logs.
- **Settings**: Configure application settings such as pass marks and test durations.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Image Storage**: [Cloudinary](https://cloudinary.com/)

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tinolinton/zimprovisional.git
   cd zimprovisional
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and configure the following variables (see `env.example.txt` for reference):

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/zimprovisional?schema=public"

   # Auth.js
   AUTH_SECRET="your-secret-key"
   AUTH_URL="http://localhost:3000"

   # Email (Nodemailer)
   EMAIL_SERVER_USER="your-email@example.com"
   EMAIL_SERVER_PASSWORD="your-password"
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_FROM="noreply@zimprovisional.com"

   # Cloudinary
   CLOUDINARY_URL="cloudinary://key:secret@cloud_name"
   CLOUDINARY_UPLOAD_FOLDER="zimdrive"
   ```

4. **Database Setup**
   Generate the Prisma client and push the schema to your database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   Seed the database with initial data (default superadmin):

   ```bash
   npm run prisma:seed
   ```

   > **Default Superadmin:** `dev@chimaliro.com`

5. **Run the Application**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── (admin)/      # Admin dashboard routes
│   ├── (auth)/       # Authentication routes (login, register)
│   ├── (site)/       # Public and user-facing routes
│   └── api/          # API routes
├── components/       # Reusable UI components
├── lib/              # Utility functions and libraries (Prisma, Auth)
└── prisma/           # Database schema and seed scripts
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ✍️ Author

**Tino Linton**

- 🌐 **Portfolio**: [chimaliro.com](https://chimaliro.com)
- 🐙 **GitHub**: [@tinolinton](https://github.com/tinolinton)
- 🐦 **X (Twitter)**: [@chimaliroo](https://x.com/chimaliroo)
- 📧 **Email**: [dev@chimaliro.com](mailto:dev@chimaliro.com)

---

&copy; 2025 ZimProvisional. All rights reserved.
