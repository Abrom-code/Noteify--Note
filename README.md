#  Noteify — Full-Stack Notes Application

<div align="center">

![Noteify Banner](./Static/banner.png)

**A modern, responsive, and interactive full-stack note-taking web application**
Built with a polished **frontend experience** and a scalable **PHP-powered backend** for real-world note management, productivity, and future-ready notification support.

[![Status](https://img.shields.io/badge/status-active-success)](#)
[![Frontend](https://img.shields.io/badge/frontend-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)](#)
[![Backend](https://img.shields.io/badge/backend-PHP%20%7C%20MySQL-purple)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](#)

</div>

---

##  Project Overview

**Noteify** is a clean, responsive, and interactive **full-stack web application** designed to help users create, manage, search, edit, and delete notes effortlessly.

Originally built in **two learning phases**:

* **Phase 1:** Static UI with **HTML + CSS**
* **Phase 2:** Dynamic interactivity with **JavaScript**

It now evolves into a **professional full-stack version**, where the polished frontend is connected to a **PHP backend** and **MySQL database** for persistent, scalable, and real-world data handling.

> Noteify is not just a classroom project — it is a portfolio-ready web application that demonstrates the progression from frontend fundamentals to backend integration and full-stack development.

---

##  Key Highlights

*  Create, edit, and delete notes in real time
*  Instant note search and filtering
*  Elegant dark mode for accessibility and comfort
*  Persistent storage using **LocalStorage** (Phase 1 & 2)
*  Full-stack data persistence using **PHP + MySQL** (Professional version)
*  Fully responsive design for desktop, tablet, and mobile
*  Fast and lightweight UI with modern minimal design
*  Future-ready architecture for **calendar integration and real notifications**

---

##  Project Purpose

The goal of **Noteify** is to demonstrate how a simple browser-based note app can grow into a complete production-style web system.

This project showcases:

* Frontend structure and styling
* Responsive web design
* JavaScript DOM manipulation and CRUD logic
* Local browser persistence using `localStorage`
* Backend API handling with PHP
* Database-driven note management with MySQL
* Scalable architecture for future features like reminders and notifications

It is ideal for:

*  Students learning web development
*  Portfolio presentation
*  Practice for CRUD-based applications
*  Beginner full-stack projects

---

#  System Architecture

## Frontend Layer

The frontend focuses on user experience, responsiveness, and modern design principles.

### Built With

* **HTML5** — semantic page structure
* **CSS3** — modern styling using Flexbox, Grid, animations, and dark mode
* **JavaScript (ES6)** — interactive behavior and dynamic CRUD operations

### Frontend Responsibilities

* Render the note interface
* Capture user input
* Handle search, edit, delete, and add actions
* Provide instant visual feedback
* Toggle dark/light theme
* Communicate with backend APIs using `fetch()`

---

## Backend Layer

The backend powers the professional version of Noteify using **PHP**.

### Built With

* **PHP 8+** — server-side logic
* **MySQL / MariaDB** — relational database storage
* **REST-style API endpoints** — for CRUD operations

### Backend Responsibilities

* Receive note requests from frontend
* Validate input data
* Store notes in database
* Update and delete records securely
* Return JSON responses to the client
* Enable future features such as:

  * user authentication
  * scheduled reminders
  * notification triggers
  * calendar event syncing

---

#  Project Synopsis

**Noteify** is designed as a lightweight productivity app with a strong learning foundation and a professional upgrade path.

The original version works **offline in the browser** using `localStorage`, making it simple and beginner-friendly.

The enhanced full-stack version introduces:

* Persistent server-side storage
* Structured backend endpoints
* Real database integration
* Better scalability for multiple users
* Foundation for advanced features like reminders and calendar-based alerts

This makes **Noteify** an excellent example of transitioning from:

**Static Design → Dynamic Frontend → Full-Stack Application**

---

#  Implemented Solution

## Phase 1 & 2 (Frontend + LocalStorage)

The initial implementation focuses on a fast, offline-friendly browser experience:

* Notes stored in **LocalStorage**
* CRUD operations handled via **JavaScript DOM manipulation**
* Search filtering in real time
* Responsive layout using **Flexbox** and **CSS Grid**
* Dark mode toggle for accessibility
* Minimal, modern UI/UX

## Professional Full-Stack Version (Frontend + PHP Backend)

The upgraded solution extends Noteify into a real-world web app:

* Frontend remains lightweight and responsive
* Notes are stored in **MySQL** instead of only LocalStorage
* JavaScript uses **Fetch API / AJAX** to communicate with PHP
* Backend exposes endpoints for:

  * Create Note
  * Read Notes
  * Update Note
  * Delete Note
* Data validation and sanitization on server side
* JSON responses for clean frontend integration

---

#  Tech Stack

| Layer                       | Technologies                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| **Frontend**                | HTML5, CSS3, JavaScript (ES6), Fetch API                                                   |
| **Backend**                 | PHP 8+, REST-style PHP APIs                                                                |
| **Database**                | MySQL / MariaDB                                                                            |
| **Storage (Basic Version)** | LocalStorage                                                                               |
| **Version Control**         | Git & GitHub                                                                               |
| **Design Tools**            | Figma / Canva                                                                              |
| **Deployment Options**      | GitHub Pages (frontend demo), XAMPP/Laragon/cPanel/InfinityFree/000webhost for PHP hosting |

---

#  Recommended Professional Project Structure

```bash
Noteify/
│
├── index.html                 # Main application entry
├── README.md                  # Project documentation
├── .gitignore                 # Ignore unnecessary files
│
├── assets/
│   ├── css/
│   │   └── style.css          # Main styling + dark mode
│   ├── js/
│   │   └── app.js             # Frontend logic and API requests
│   └── images/
│       ├── logo.png
│       └── banner.png
│
├── backend/
│   ├── config/
│   │   └── db.php             # Database connection
│   ├── api/
│   │   ├── create_note.php    # Create note endpoint
│   │   ├── get_notes.php      # Fetch notes endpoint
│   │   ├── update_note.php    # Update note endpoint
│   │   └── delete_note.php    # Delete note endpoint
│   └── sql/
│       └── noteify.sql        # Database schema
│
└── Static/                    # Optional icons, images, screenshots
```

---

#  Environment Setup

## Prerequisites

Before running Noteify, make sure you have:

* A modern web browser (**Chrome, Firefox, Edge, Safari**)
* A code editor (**VS Code recommended**)
* **Git** installed (optional)
* A local PHP server such as:

  * **XAMPP**
  * **Laragon**
  * **WAMP**
* **MySQL / MariaDB** installed and running

---

#  Installation Guide

## 1. Clone the Repository

```bash
git clone https://github.com/Maxd646/noteify.git
cd noteify
```

## 2. Frontend-Only Version (Learning Version)

Simply open:

```bash
index.html
```

in your browser.

This version works using **LocalStorage** only.

---

## 3. Full-Stack PHP Version Setup

### Step 1: Move Project to Local Server

Place the project inside your local server directory.

**Example (XAMPP):**

```bash
C:/xampp/htdocs/noteify/
```

### Step 2: Create Database

Open **phpMyAdmin** and create a database named:

```sql
noteify_db
```

### Step 3: Import SQL Schema

Use the SQL file from:

```bash
backend/sql/noteify.sql
```

Example schema:

```sql
CREATE DATABASE IF NOT EXISTS noteify_db;
USE noteify_db;

CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Step 4: Configure Database Connection

Edit:

```bash
backend/config/db.php
```

Example:

```php
<?php
$host = "localhost";
$dbname = "noteify_db";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>
```

### Step 5: Start Apache + MySQL

Start services from **XAMPP / Laragon / WAMP**.

### Step 6: Open in Browser

```bash
http://localhost/noteify/
```

---

#  Deployment Options

## Frontend-Only Deployment (Static Demo)

You can deploy the basic version using **GitHub Pages**.

### Steps

1. Push the project to GitHub
2. Open **Repository Settings**
3. Go to **Pages**
4. Select the branch (usually `main`)
5. Save and publish

Expected URL:

```bash
https://maxd646.github.io/noteify/
```

>  GitHub Pages supports **static files only**. It will **not run PHP**.

---

## Full-Stack Deployment (PHP + MySQL)

To deploy the professional version, use a hosting provider that supports:

* PHP
* MySQL
* cPanel / phpMyAdmin access

### Recommended Hosting Options

* InfinityFree
* 000webhost
* Hostinger
* cPanel shared hosting
* Render / Railway (if configured with PHP support)

---

#  Quick Start

Once the application is running:

1. Click **Add Note**
2. Enter title and content
3. Save the note instantly
4. Use **Edit** to update note content
5. Use **Delete** to remove unwanted notes
6. Use the **Search Bar** to filter notes in real time
7. Toggle **Dark Mode** for a comfortable viewing experience

---

#  Features Overview

| Feature               | Description                                             |
| --------------------- | ------------------------------------------------------- |
| **Add Note**          | Create new notes instantly                              |
| **Edit Note**         | Update note content easily                              |
| **Delete Note**       | Remove unwanted notes                                   |
| **Search**            | Find notes by keywords in real time                     |
| **Dark Mode**         | Toggle between light and dark themes                    |
| **Local Storage**     | Auto-save notes in the browser (basic version)          |
| **Database Storage**  | Store notes permanently with MySQL (full-stack version) |
| **Responsive Design** | Works on desktop, tablet, and mobile                    |
| **Clean UI/UX**       | Modern minimal interface                                |
| **Scalable Backend**  | Ready for authentication, reminders, and APIs           |

---

# 🔌 Example API Endpoints (PHP Backend)

| Method | Endpoint                       | Purpose                 |
| ------ | ------------------------------ | ----------------------- |
| `GET`  | `/backend/api/get_notes.php`   | Fetch all notes         |
| `POST` | `/backend/api/create_note.php` | Create a new note       |
| `POST` | `/backend/api/update_note.php` | Update an existing note |
| `POST` | `/backend/api/delete_note.php` | Delete a note           |

---

#  Future Enhancements

The next major evolution of **Noteify** can turn it into a complete productivity platform.

### Planned Features

*  User authentication (Login / Signup)
*  Cloud synchronization across devices
*  Advanced tagging and categorization
*  Export / Import notes (JSON, TXT, PDF)
*  Progressive Web App (PWA) support
*  **Calendar integration** for deadlines and reminders
*  **Real notifications** using backend scheduling
*  Email reminder support
*  Scheduled note alerts using PHP cron jobs
*  Multi-user collaboration

### Calendar + Notification Integration Idea

For real notifications, the backend can be extended with:

* A `reminders` table in MySQL
* Calendar date & time fields attached to notes
* PHP scripts scheduled via **cron jobs**
* Browser notifications or email notifications
* Google Calendar API integration (advanced version)

---

#  UI/UX Design Philosophy

Noteify follows a **minimalist and professional product design approach**:

* Clean spacing and typography
* Soft shadows and modern card layouts
* High contrast accessibility support
* Mobile-first responsive layout
* Smooth interactions and hover states
* Dark mode for user comfort

This makes the application both:

* **easy to use for beginners**
* **impressive enough for portfolio presentation**

---

#  Prototype / Screenshots



---

#  Contributors

| Name               | ID         | GitHub                                       |
| ------------------ | ---------- | -------------------------------------------- |
| **Daniel Gashaw Kebede**  | ETS0387/16 | [@Maxd646](https://github.com/Maxd646)       |
| **Abrham Teramed Nega**   | ETS0094/16 | [@Abrom-code](https://github.com/Abrom-code) |
| **Addis Shiferaw**        | ETS0099/16 | [@Adda-19](https://github.com/Adda-19)       |
| **Liyuneh Rstey**         | ETS0841/15 | [@liyuneh](https://github.com/liyuneh)       |
| **Amir Yimam**            | ETS0169/16 | [@miro129](https://github.com/miro129)       |

---

#  Learning Outcomes

By building **Noteify**, developers demonstrate understanding of:

* Semantic HTML structure
* Responsive CSS layouts
* JavaScript event handling
* DOM manipulation
* LocalStorage persistence
* Full CRUD operations
* Fetch API integration
* PHP backend development
* MySQL database operations
* REST-style request/response design
* Full-stack project organization
* Deployment fundamentals

---

#  License

This project is open-source and can be distributed under the **MIT License**.

```text
MIT License
Copyright (c) 2026 Noteify Team
```

---

#  Final Note

**Noteify** is a strong example of how a simple student project can be transformed into a polished, professional, and scalable **full-stack web application**.

It combines:

* a modern **frontend experience**
* a practical **PHP backend**
* a strong **learning journey**
* and a clear path toward **real productivity features** like reminders, notifications, and calendar integration.

> If you want, the next step is to build the **complete full-stack Noteify codebase** for you:
>
> * `index.html`
> * `style.css`
> * `app.js`
> * `db.php`
> * `create_note.php`
> * `get_notes.php`
> * `update_note.php`
> * `delete_note.php`
> * `noteify.sql`

---

##  Support the Project

If you like this project:

* Give it a **star** on GitHub 
* Fork it and improve it 
* Use it in your portfolio 
* Expand it into a full productivity system 

---

<div align="center">

### **Built with passion, practice, and purpose by the Noteify Team** 

</div>
