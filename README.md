# Primetrade-Backend-Internship
# Primetrade Backend Developer (Intern) Assignment - Secured Task API

## Overview
This project delivers a scalable REST API using **Java Spring Boot 3** and **Spring Security** (with JWT) and includes a functional **React.js** frontend demo.

## Core Features
* **Authentication:** User registration (BCrypt hashed passwords) and login (JWT token issuance).
* **Security:** Role-Based Access Control (RBAC) enforced via JWT.
* **Data:** Full CRUD operations for the `Task` entity.
* **Validation & Error Handling:** Input validation and custom error responses (HTTP 400).

## ⚙️ How to Run Locally

### 1. Backend (Spring Boot - Port 8080)
1.  **Prerequisites:** Java 17+, Maven, PostgreSQL.
2.  **Database Setup:** Create a new PostgreSQL database (e.g., `primetrade_db`).
3.  **Configuration:** Update the database credentials and `app.jwtSecret` in `backend/src/main/resources/application.properties`.
4.  **Run:**
    ```bash
    # In the /backend folder
    mvn clean install
    mvn spring-boot:run
    ```

### 2. Frontend (React)
1.  **Prerequisites:** Node.js (v20+ recommended) and npm.
2.  **Install:**
    ```bash
    # In the /frontend folder
    npm install
    ```
3.  **Run:**
    ```bash
    npm run dev
    ```
    *The frontend is configured to proxy API calls to the backend automatically.*

## 🔗 API Documentation (Swagger)
All API endpoints can be explored and tested using Swagger UI here (once the backend is running): `http://localhost:8080/swagger-ui.html`
