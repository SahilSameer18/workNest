# 🏢 WorkNest - Employee Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

WorkNest is a full-stack Employee Management System designed to handle secure authentication, role-based access control, organizational hierarchy visualization, and comprehensive employee lifecycle management.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (v19)
- Vite for fast builds
- Tailwind CSS for premium styling
- Lucide React for consistent iconography
- React Router DOM for routing

**Backend:**
- Node.js & Express.js
- Prisma ORM (Neon adapter)
- PostgreSQL (Neon Serverless)
- JWT & bcryptjs for secure authentication

---

## ✨ Features & Requirements

- **Secure Authentication**: JWT-based authentication with `httpOnly` secure cookies and bcrypt password hashing.
- **Dynamic Dashboard**: Live statistics of employees, active vs inactive states, and departmental distributions.
- **Employee Management**: Full CRUD operations (Create, Read, Update, Soft-Delete).
- **Organizational Hierarchy**: Visualize the reporting structure, assign managers, and prevent circular reporting lines.
- **Advanced Filtering**: Search by name/email, filter by department/role/status, and dynamic sorting.
- **Role-Based Access Control**: Strict permissions depending on the user's role.
- **Premium UI/UX**: Custom themed Light/Dark modes, skeleton loading screens, and smooth micro-animations.

---

## 🔐 Role-Based Access Control (RBAC)

| Feature | Super Admin | HR Manager | Employee |
| :--- | :---: | :---: | :---: |
| **View Dashboard** | ✅ | ✅ | ❌ |
| **View All Employees** | ✅ | ✅ | ❌ |
| **Create Employee** | ✅ | ✅ | ❌ |
| **Edit Employee Profile** | ✅ | ✅ | ✅ (Own Only) |
| **Soft-Delete Employee** | ✅ | ❌ | ❌ |
| **Assign Manager/Role** | ✅ | ❌ | ❌ |

---

## 📐 Project Architecture

```mermaid
graph TD
    subgraph Client["Frontend - React.js"]
        UI["Vite + React UI"]
        State["Context API"]
        Router["React Router DOM"]
        Axios["Axios Interceptors"]

        UI --> State
        UI --> Router
        Router --> Axios
    end

    subgraph Server["Backend - Node.js + Express"]
        API["Express REST API"]
        Auth["JWT Authentication + bcrypt"]
        RBAC["Role-Based Access Control Middleware"]
        Prisma["Prisma Client"]

        API --> Auth
        Auth --> RBAC
        RBAC --> Prisma
    end

    subgraph Database["Neon PostgreSQL"]
        DB[(PostgreSQL Database)]
    end

    Axios -->|"HTTP Requests with Cookies"| API
    Prisma -->|"Database Connection"| DB

```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### 2. Environment Variables
You will need `.env` files in both your `client` and `server` directories.

**`server/.env`**
```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
DIRECT_URL=postgresql://user:pass@host/db?sslmode=require
```

### 3. Installation & Setup

1. **Clone the repository and install backend dependencies:**
   ```bash
   cd server
   npm install
   ```
2. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### 4. Database Seeding
Since there are no users initially, you must seed the database to create the default Super Admin account.

```bash
cd server
npx prisma db seed
```
This command will create the following administrator account:
- **Email:** `admin@worknest.com`
- **Password:** `password123`

### 5. Running the Application
You can run both the client and server development environments simultaneously.

**Run Backend (Terminal 1):**
```bash
cd server
npm run dev
```

**Run Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

Your application will now be running at `http://localhost:5173`!

---

## 📡 Core API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate user & receive JWT cookie
- `POST /api/auth/logout` - Clear JWT session
- `GET /api/auth/me` - Retrieve current session user

### Employee Management
- `GET /api/employees` - List all employees (supports search, sort, filter)
- `GET /api/employees/stats` - Fetch dashboard statistics
- `POST /api/employees` - Create a new employee
- `GET /api/employees/:id` - Fetch single employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Soft delete employee

### Organization
- `GET /api/org/tree` - Retrieve hierarchical tree of all employees
- `GET /api/employees/:id/reportees` - Retrieve direct reports for an employee
- `PATCH /api/employees/:id/manager` - Update reporting manager

---

## 👨‍💻 Author

**Sahil Sameer** 
- GitHub: [@SahilSameer18](https://github.com/SahilSameer18)

---
*Developed with ❤️ using the PERN stack.*

