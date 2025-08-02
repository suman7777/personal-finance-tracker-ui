# Personal Finance Tracker – Technical Documentation

## Table of Contents
1. Overview
2. UI (Frontend)
   - Tech Stack
   - Structure & Key Components
   - Routing
   - API Integration
   - Authentication
   - How to Run
3. Backend (Spring Boot)
   - Tech Stack
   - Project Structure
   - Main Features & Endpoints
   - Security
   - Database (H2)
   - How to Run
4. Deployment & Version Control
5. Additional Notes

---

## 1. Overview

This project is a full-stack personal finance tracker with a modern React + Material-UI frontend and a Spring Boot backend. It supports user management, accounts, transactions, budgets, recurring payments, and reports.

---

## 2. UI (Frontend)

### Tech Stack
- React 18
- Material-UI (MUI) v5
- React Router v7
- Fetch API for backend integration

### Structure & Key Components

- `src/App.js`: Main app, theme, sidebar, routing.
- `src/components/`
  - `Dashboard.js`: Overview and charts.
  - `Accounts.js`: Account CRUD.
  - `Transactions.js`: Transaction list, add dialog (Material-UI), validation.
  - `Budgets.js`, `RecurringPayments.js`, `Reports.js`: Feature pages.
  - `Users.js`: User CRUD (Material-UI table, form, validation).
  - `Auth.js`: Login page (Material-UI, backend integration).
  - `Settings.js`, `ImportExport.js`, `Goals.js`: Additional features.

### Routing

- Uses `react-router-dom` for navigation.
- Sidebar links to all main features.
- Protected routes can be added for authentication.

### API Integration

- All data is fetched from the backend at `http://localhost:8080/api/...`
- CRUD operations use fetch with proper HTTP methods.
- Error and loading states are handled in all pages.

### Authentication

- Login page posts to `/api/auth/login`.
- On success, user is redirected to the dashboard.
- (Session/token storage can be added for production.)

### How to Run

```sh
cd personal-finance-tracker
npm install
npm start
```
App runs at [http://localhost:3000](http://localhost:3000).

---

## 3. Backend (Spring Boot)

### Tech Stack

- Spring Boot 3.x
- Java 17+
- Spring Web, Spring Data JPA
- H2 (in-memory, dev)
- Spring Security (disabled for now)
- Maven

### Project Structure

- `PersonalFinanceBackendApplication.java`: Main entry, CORS config.
- `controller/`: REST controllers for all entities (`UserController`, `AccountController`, etc.), `AuthController` for login.
- `service/`: Business logic for each entity.
- `repository/`: JPA repositories.
- `model/`: Entity classes (`User`, `Account`, `Transaction`, etc.).
- `config/SecurityConfig.java`: Disables security for all endpoints (for dev).

### Main Features & Endpoints

- `/api/users`: User CRUD
- `/api/accounts`: Account CRUD
- `/api/transactions`: Transaction CRUD
- `/api/budgets`, `/api/recurring-payments`, `/api/reports`: Other features
- `/api/auth/login`: Login endpoint (plain username/password, demo only)

### Security

- All endpoints are currently open (no authentication required).
- Security can be enabled by updating `SecurityConfig.java`.

### Database (H2)

- In-memory H2 database for development.
- H2 console enabled at [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- Default JDBC URL: `jdbc:h2:mem:testdb`, user: `sa`, password: (blank)
- Tables: `app_user`, `account`, `transaction`, etc.

### How to Run

```sh
cd personal-finance
./mvnw spring-boot:run
```
App runs at [http://localhost:8080](http://localhost:8080).

---

## 4. Deployment & Version Control

- UI repo: [personal-finance-tracker-ui](https://github.com/suman7777/personal-finance-tracker-ui)
- Backend repo: [personal-finance-tracker-backend](https://github.com/suman7777/personal-finance-tracker-backend)
- Both projects use git for version control.
- To deploy, build the backend JAR and serve the frontend build with any static file server or reverse proxy.

---

## 5. Additional Notes

- For production, enable security and use hashed passwords/JWT.
- For persistent data, switch from H2 to PostgreSQL or MySQL.
- All UI forms use Material-UI with validation and error handling.
- The codebase is modular and easy to extend for new features.

---
