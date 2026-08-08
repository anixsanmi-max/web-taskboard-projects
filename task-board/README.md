# Task Board
**Live demo:** https://web-taskboard-projects.onrender.com

A full-stack task/board manager — sign up, log in, create boards, add tasks to each board, mark them complete.

## Stack

- **Backend:** Node.js, Express
- **Database:** SQLite (via `better-sqlite3`)
- **Auth:** Password hashing with `bcrypt`, session-based login with `express-session`
- **Frontend:** Vanilla HTML/CSS/JS (no framework, no build step)

## How to run it locally

1. Open a terminal inside the `server` folder:
```bash
   cd server
   npm install
   npm start
```
2. Open your browser to **http://localhost:3000**
3. Sign up with any email/password, then start adding boards and tasks.

The database file (`taskboard.db`) is created automatically on first run — no setup needed.

## Security notes

- Passwords are hashed with `bcrypt` — never stored in plain text.
- All board/task routes are protected — a user can only see and modify their own boards, verified server-side on every request.
- SQL queries use parameterized statements (`?` placeholders) to prevent SQL injection.
