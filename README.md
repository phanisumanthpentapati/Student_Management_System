# 🎓 Student Management System

A full-stack web application for managing student records, built using **React, Java Spring Boot, and PostgreSQL**. The application provides a dashboard to add, view, search, update, and delete student information while tracking academic performance.

## 🚀 Project Overview

The Student Management System simplifies the process of maintaining student information by providing a centralized platform for managing student records.

Instead of maintaining records manually, users can manage student details through a responsive web interface connected to a Spring Boot REST API and a PostgreSQL database.

## ✨ Features

- **Dashboard:** View student statistics and academic performance.
- **Add Students:** Register students with their name, email, department, and marks.
- **View Students:** Display student records in a structured table.
- **Update Students:** Edit existing student information.
- **Delete Students:** Remove student records with confirmation.
- **Search Students:** Search by student name, email, ID, or department.
- **Department Filter:** Filter records by department.
- **Performance Tracking:** View average marks, high performers, and performance indicators.
- **Responsive UI:** Modern dashboard design for desktop and smaller screens.
- **REST API Integration:** Connect the React frontend with the Spring Boot backend.

## 🛠️ Technologies Used

| Technology      | Purpose                                 |
| --------------- | --------------------------------------- |
| React           | Frontend user interface                 |
| Java 21         | Backend programming language            |
| Spring Boot     | Backend application and REST APIs       |
| Spring Data JPA | Database operations                     |
| PostgreSQL      | Relational database                     |
| Maven           | Backend dependency and build management |
| JavaScript      | Frontend functionality                  |
| HTML5           | Page structure                          |
| CSS3            | Styling and responsive design           |
| IntelliJ IDEA   | Development environment                 |

## 🏗️ Architecture

The application follows a three-layer architecture:

1. **Frontend — React:** Displays the dashboard, student forms, search, filters, and records.
2. **Backend — Spring Boot:** Handles HTTP requests, processes business logic, and performs CRUD operations.
3. **Database — PostgreSQL:** Stores student information persistently.

### Application Flow

```text
User
  |
  v
React Frontend
  |
  | HTTP / REST API
  v
Spring Boot Backend
  |
  | Spring Data JPA
  v
PostgreSQL Database
```

## 📂 Project Structure

```text
student-management/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── auspify/
│       │           └── student_management/
│       │               ├── controller/
│       │               ├── entity/
│       │               ├── repository/
│       │               └── service/
│       └── resources/
│           └── application.properties
│
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

*Note: The exact Java package subfolders may differ depending on your implementation.*

## ⚙️ Prerequisites

Install the following before running the application:

- Java Development Kit (JDK) 21
- Node.js and npm
- PostgreSQL
- IntelliJ IDEA or another Java IDE
- Git

## 🔧 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your actual GitHub username and repository name.

### 2. Create the PostgreSQL database

Open PostgreSQL or pgAdmin and execute:

```sql
CREATE DATABASE student_management;
```

### 3. Configure the backend

Open `src/main/resources/application.properties` and configure the database connection:

```properties
spring.application.name=student-management
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/student_management
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

Set the `DB_PASSWORD` environment variable to your PostgreSQL password before starting the backend.

**Security:** Do not commit database passwords, API keys, or other secrets to GitHub.

### 4. Run the Spring Boot backend

From the project root, run on Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend should start at:

```text
http://localhost:8080
```

### 5. Run the React frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite development URL:

```text
http://localhost:5173
```

Keep both the backend and frontend running while testing the application.

## 🔗 REST API Endpoints

The following endpoints are implemented in the application.

| Method | Endpoint                                | Description                     |
| ------ | --------------------------------------- | ------------------------------- |
| POST   | `/api/students`                         | Create a student                |
| GET    | `/api/students`                         | Retrieve all students           |
| GET    | `/api/students/{id}`                    | Retrieve a student by ID        |
| PUT    | `/api/students/{id}`                    | Update a student                |
| DELETE | `/api/students/{id}`                    | Delete a student                |
| GET    | `/api/students/search?name={name}`      | Search students by name         |
| GET    | `/api/students/department/{department}` | Retrieve students by department |

Base URL:

```text
http://localhost:8080/api/students
```

### Example: Create a Student

**Request**

```http
POST http://localhost:8080/api/students
Content-Type: application/json
```

**Request body**

```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "department": "CSE",
  "marks": 85
}
```

Use Postman or another API client to test the endpoints. The request body assumes the backend entity uses these field names.

## 🧪 Testing

Test the application using the following checklist:

- [ ] Backend starts successfully.
- [ ] PostgreSQL connection works.
- [ ] Student records load on the dashboard.
- [ ] A new student can be added.
- [ ] Existing student details can be updated.
- [ ] A student record can be deleted.
- [ ] Search returns matching records.
- [ ] Department filtering works.
- [ ] Dashboard statistics reflect the student data.
- [ ] Invalid input and backend errors are handled appropriately.

## 🔮 Future Enhancements

Potential improvements include:

- Student and administrator authentication
- Role-based access control
- Attendance management
- Course and subject management
- Marksheets and downloadable reports
- Pagination and sorting
- Form validation and improved error reporting
- Deployment to a cloud hosting platform

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

- Full-stack web development
- Java and Spring Boot application development
- REST API design and integration
- CRUD operations
- PostgreSQL database connectivity
- React state management and component development
- Maven and application configuration
- Frontend and backend integration

## 📄 License

This project is available for educational and portfolio purposes. Add a license file if you intend to distribute it under a specific open-source license.
