# Personal Finance Tracker (Frontend)

This repository contains the React frontend for the Personal Finance Tracker application. It was bootstrapped with Create React App and uses Material-UI (MUI) and Chart.js for the UI and charts.

This README documents how to run the frontend locally, relevant backend integration points (MySQL + Spring Boot), recent UI changes, and developer notes to help you continue working on the project.

---

## Table of contents

- Quick start (frontend)
- Backend (MySQL + Spring Boot) notes and SQL scripts
- Recent UI changes (what I changed)
- Project structure and important files
- Development tips, common issues and troubleshooting
- Testing & building
- Contributing

---

## Quick start (frontend)

Prerequisites
- Node.js (>= 16 recommended) and npm

Install dependencies and start the dev server (PowerShell examples):

```powershell
cd 'c:\Users\suman\personal-finance-tracker'
npm install
npm start
```

Open http://localhost:3000 in your browser. The app will reload when you make changes.

If port 3000 is already in use, the dev server will prompt to use another port. You can also start with a different port manually:

```powershell
$env:PORT=3001; npm start
```

---

## Backend (MySQL + Spring Boot) — notes and SQL scripts

The backend Spring Boot application lives in the sibling folder `../personal-finance` (relative to this frontend). During the recent updates the backend was configured to use MySQL instead of H2/Postgres.

Files of interest (backend):
- `personal-finance/src/main/resources/application.properties` — Spring datasource updated to MySQL (JDBC URL, driver, username/password, Hibernate dialect)
- `personal-finance/mysql-setup.sql` — creates the database and a database user (example: `finance_user` / `finance_pass`).
- `personal-finance/mysql-schema-and-testdata.sql` — schema (users, accounts, transactions, budgets) and example seed data.

Quick MySQL setup (example):

1. Start MySQL server (install if required).
2. Run the setup script (adjust path and credentials as needed):

```powershell
mysql -u root -p < "c:\Users\suman\personal-finance\mysql-setup.sql"
mysql -u finance_user -pfinance_pass < "c:\Users\suman\personal-finance\mysql-schema-and-testdata.sql"
```

Notes:
- The `finance_user` and `finance_pass` credentials used in these scripts are examples; change the password and update `application.properties` accordingly before deploying to production.
- The backend endpoint consumed by the frontend is `http://localhost:8080/api/*` (for example `/api/dashboard-data`). Ensure the backend is running on port 8080 (default Spring Boot). See backend README for full instructions.

---

## Recent UI changes (high level)

I updated the frontend layout and several components to improve usability and conform to a banking-style top navigation. Key changes:

- Moved navigation from a left sidebar into a fixed top navigation bar (`src/App.js`). Top nav now shows icons and labels (labels hidden on xs screens).
- Added a Profile menu (click avatar at top-right) with Profile / Settings / Logout and small icons. Menu navigates to `/users`, `/settings`, and `/auth` respectively.
- Cleaned unused imports and commented out the Recurring nav/route (it still exists as a component but is not shown in the nav by default).
- Dashboard (`src/components/Dashboard.js`): redesigned overview — single full-width Income vs Expense Line chart, INR currency formatting helper, loading spinner, and simplified summaries.
- Accounts (`src/components/Accounts.js`): fixed dialog and form state handling, added form submit handler to POST new accounts to backend.
- Currency display: amounts across components use Indian Rupee formatting (₹) via a helper `formatINR`.

These changes were committed and pushed to `origin/master` (recent commit message: "UI: move navigation to top, add profile menu, clean imports and polish header/avatar").

---

## Project structure (important files)

- `src/App.js` — main layout, top navigation, routing and profile menu.
- `src/components/Dashboard.js` — dashboard overview, charts, quick stats, accounts/transactions lists.
- `src/components/Accounts.js` — list and create account dialog.
- `src/components/RecurringPayments.js` — recurring payments component (route commented out in nav).
- `package.json` — front-end dependencies and scripts.

Backend (separate repo folder):
- `../personal-finance` — Spring Boot backend, `pom.xml`, `src/main/java`, `src/main/resources/application.properties`.

---

## Development tips and troubleshooting

- Port conflicts: If `npm start` reports port 3000 is in use, either accept the alternative port it suggests or set `PORT` before running (PowerShell example above).
- CRLF/line ending warnings: Git may warn about LF/CRLF changes on Windows; these are cosmetic but you can configure `.gitattributes` to enforce consistent endings if needed.
- API data shape: The Dashboard relies on `/api/dashboard-data`. If charts appear empty, check the backend response — e.g., `pieData` may be empty; the dashboard now gracefully shows a loading spinner and avoids rendering empty charts.
- Logout flow: The Profile menu currently navigates to `/auth` for logout. If you need to fully clear authentication state (localStorage, cookies, backend session), we can add logic to `handleLogout` in `src/App.js`.

---

## Testing and building

- Run unit tests (if present):

```powershell
npm test
```

- Build for production:

```powershell
npm run build
```

---

## Contributing

- Make a feature branch off `master` (or open a PR against `master`):

```powershell
git checkout -b feat/your-feature
```

- Commit changes with a clear message and push to your fork/branch.
- Open a pull request describing the change and any verification steps.

If you'd like, I can open a PR for the recent UI work and add reviewers.

---
