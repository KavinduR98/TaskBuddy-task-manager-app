# 📝 Task Buddy - Task Manager Application

A full-stack **Task Management System** built with **Spring Boot** (backend) and **React.js** (frontend).  
This application helps users create, assign, and track tasks efficiently with role-based authentication.

---

## 🚀 Tech Stack
- **Backend:** Spring Boot, Spring Security (JWT), JPA/Hibernate, MySQL
- **Frontend:** React.js, Tailwind CSS, Axios
- **Authentication:** JWT-based security

---

## ✨ Features
- 🔑 User authentication & authorization (JWT)
- 👥 Role-based access (Admin & Member)
- ✅ Create, update, and delete tasks
- 📋 Manage checklist items for each task
- 👨‍💼 Assign members to tasks
- 📊 Dashboard with task statistics
- 📝 Logging & error handling

---

## 📂 Project Structure
- backend/ → Spring Boot APIs (Auth, Employee, Task services)
- frontend/ → React.js client (Admin & Memeber dashboards)

---

## ⚡ Setup & Run

### Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
- The API will run on http://localhost:8080.

### Frontend (React)
```bash
cd frontend
npm install
npm start
```
- The frontend will run on http://localhost:3000.

---

## 📸 Screenshots
- Authentication
<img width="1920" height="911" alt="login-page" src="https://github.com/user-attachments/assets/801e1f63-14ea-4848-a054-8a123ac9d0a2" />
<img width="1920" height="911" alt="register" src="https://github.com/user-attachments/assets/803205bb-2156-405b-a9f1-4f0cd4799333" />

- Admin Panel
<img width="1920" height="1263" alt="admin dashboard" src="https://github.com/user-attachments/assets/025f8ad1-fc56-4c73-90a8-c5116913e1f2" />
<img width="1920" height="911" alt="admin manage tasks" src="https://github.com/user-attachments/assets/b2b9f58b-f963-4afd-bd61-f63c4c5e9782" />
<img width="1920" height="911" alt="admin create" src="https://github.com/user-attachments/assets/b0877f5b-6c63-4fac-886b-30ae13a94049" />
<img width="1920" height="911" alt="update task" src="https://github.com/user-attachments/assets/a284b285-ece3-48de-8053-9cdb606cfe1d" />

- Member Panel
<img width="1920" height="911" alt="member-dashboard" src="https://github.com/user-attachments/assets/60c06d8a-fa6d-4b57-a9a8-8ce226565573" />
<img width="1920" height="911" alt="member-tasks" src="https://github.com/user-attachments/assets/8a11cb49-065d-4d51-a7fc-c3366e8a8bb7" />

---

## 🔮 Future Improvements

- Notifications system
- File uploads for tasks

---

## 📜 License

- This project is licensed under the MIT License.
