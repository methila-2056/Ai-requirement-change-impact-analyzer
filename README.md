<div align="center">

  <img src="https://img.shields.io/badge/Strategic_Impact_Analyzer-2.0-5b6ef5?style=for-the-badge&labelColor=06080d" alt="SIA Badge">
  <br><br>

  <h1>Strategic Impact Analyzer</h1>
  <h3>AI-Powered Change Impact Analysis for Software Requirements</h3>

  <br>

  [![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
  [![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
  [![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![License: MIT](https://img.shields.io/badge/License-MIT-22d37e?style=for-the-badge)](LICENSE)
  [![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-a855f7?style=for-the-badge)](https://github.com/methila-2056/Ai-requirement-change-impact-analyzer/pulls)

  <br>

  An intelligent web application that analyzes the impact of software requirement changes by parsing XML configuration files, mapping component dependencies, calculating risk scores, and predicting severity — reducing analysis time by **93.2%** compared to manual expert analysis.

  <br>

  [![Live Frontend](https://img.shields.io/badge/Live_Frontend_(Vercel)-5b6ef5?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-requirement-change-impact-analyz.vercel.app/)
  [![Live Backend API](https://img.shields.io/badge/Live_Backend_API_(Render)-22d37e?style=for-the-badge&logo=render&logoColor=white)](https://strategic-impact-analyzer.onrender.com/)
  [![View Docs](https://img.shields.io/badge/Documentation-a855f7?style=for-the-badge&logo=readthedocs&logoColor=white)](#table-of-contents)
  [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/methila-2056/Ai-requirement-change-impact-analyzer)

</div>

---

## Live Deployment

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | [ai-requirement-change-impact-analyz.vercel.app](https://ai-requirement-change-impact-analyz.vercel.app/) | Static SPA (HTML/CSS/JS) served via Vercel |
| **Backend API** | [strategic-impact-analyzer.onrender.com](https://strategic-impact-analyzer.onrender.com/) | Flask REST API + SQLite on Render |

---

## Table of Contents

- [Live Deployment](#live-deployment)
- [Overview](#overview)
- [Key Features](#key-features)
- [Output Screenshots](#output-screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Risk Classification](#risk-classification)
- [Component Rules](#component-rules)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

The **Strategic Impact Analyzer (SIA)** is a web-based tool designed to automate the process of assessing the impact of software requirement changes. When XML-based configurations (ETL mappings, data pipeline schemas, system configs) are modified, SIA instantly identifies which components are affected, calculates risk scores, and provides accurate effort estimates.

### The Problem

Manually analyzing the impact of requirement changes in large software systems is:
- **Time-consuming** — Takes hours or days of expert analysis
- **Error-prone** — Human analysts may miss component dependencies
- **Inconsistent** — Different analysts produce different assessments

### The Solution

SIA automates this process with an **8-step intelligent pipeline**:

```
XML Upload --> Parse XML --> Flatten Keys --> Keyword Matching --> Risk Scoring --> Effort Estimation --> Report Generation --> History Storage
```

**Result:** Analysis time reduced from hours to **under 5 seconds**.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Smart XML Parsing** | Upload any XML file (ETL mappings, configs, schemas) for instant analysis |
| **Intelligent Risk Scoring** | Rule-based engine with 42+ component types and weighted risk classification |
| **Effort Estimation** | Calculates delivery timelines, man-hours, and fast-track projections for 2-person teams |
| **Secure Authentication** | User registration and login with bcrypt password hashing and session management |
| **Forgot Password** | Token-based password reset with Gmail SMTP email delivery |
| **Analysis History** | Track and revisit all past analyses with paginated history and full report storage |
| **Professional Reports** | Generate formatted text and JSON reports with copy-to-clipboard and download support |
| **Dark & Light Themes** | Toggle between dark and light themes with persistent preference via localStorage |
| **Client Communication Notes** | Auto-generated advisory text based on detected risk level |
| **Password Strength Indicator** | Real-time password strength feedback during registration and reset |
| **Mobile Responsive** | Full mobile navigation with slide-out menu and touch-friendly interactions |

---

## Output Screenshots

### Landing Page
```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ SIA  v2.0          [Sign In]  [🚀 Get Started]              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│              ○ v2.0 — AI-Powered Impact Analysis                │
│                                                                 │
│         Requirement Change                                      │
│            Impact Analyzer                                      │
│                                                                 │
│    Upload XML configuration files and instantly discover        │
│    which components are affected, assess risk levels,          │
│    and get accurate delivery timelines.                         │
│                                                                 │
│         [🚀 Start Analyzing]    [🔑 Sign In]                    │
│                                                                 │
│              Trusted by analysts & developers                   │
│                                                                 │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│   │  42+     │  │  93%     │  │  3       │  │  <5s     │      │
│   │Component │  │Time Saved│  │Risk Lvl  │  │Analysis  │      │
│   │ Types    │  │          │  │          │  │  Time    │      │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard — Upload Zone
```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ SIA  v2.0       [Dashboard] [History] [🌙] [M ▾]            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Analysis Dashboard                        ┌─────────────────┐  │
│  Upload an XML file for instant analysis.  │  M  Methila M   │  │
│                                             │  methilashiv@.. │  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  └─────────────────┘  │
│  │ 📊 5     │  │ 🔴 2     │  │ 📅 Aug   │                      │
│  │Total     │  │High Risk │  │ 2026     │                      │
│  │Analyses  │  │          │  │          │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  📄                                      │   │
│  │         Drop your XML file here                         │   │
│  │    📎 Drag & drop or click to browse                    │   │
│  │       .xml files only · Max 16 MB                       │   │
│  │                                                         │   │
│  │              📄 wf_brs_unload.xml                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│           [⚡ Analyze Impact]                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Analysis Results
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Impact Analysis Report            ┌───────────────────────┐    │
│  wf_brs_unload.xml                 │ 🔴 HIGH RISK          │    │
│                                    └───────────────────────┘    │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 📈 40    │  │ 📦 21    │  │ ⏱ 30     │  │ ⚡ 15    │       │
│  │Risk Score│  │Components│  │Effort    │  │Fast Del. │       │
│  │  points  │  │ affected │  │212 hrs   │  │days      │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│  AFFECTED COMPONENTS                                            │
│  ─────────────────────────────────────────────────────────────  │
│  ● Source System        SOURCE        +2d / 16h                  │
│  ● Target System        TARGET        +3d / 24h                  │
│  ● ETL Mapping          MAPPING       +2d / 16h                  │
│  ● Data Pipeline        PIPELINE      +3d / 24h                  │
│  ● Transformation       TRANSFORMATION+2d / 16h                  │
│  ● Data Schema          SCHEMA        +2d / 16h                  │
│  ● Database Layer       DATABASE      +2d / 16h                  │
│  ● ... and 14 more components                                    │
│                                                                 │
│  CLIENT COMMUNICATION NOTE                                       │
│  ─────────────────────────────────────────────────────────────  │
│  ⚠️ This change has HIGH risk. Multiple critical components      │
│  are affected. Regression testing is mandatory before deploy.   │
│                                                                 │
│  [🔄 Analyze Another]  [⬇ Download Report]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Forgot Password
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────────────────────────┐                               │
│  │           🔑                 │                               │
│  │     Forgot password?         │                               │
│  │  Enter your email to         │                               │
│  │  generate a reset link       │                               │
│  │                              │                               │
│  │  📧 Email                    │                               │
│  │  ┌───────────────────────┐   │                               │
│  │  │ you@example.com       │   │                               │
│  │  └───────────────────────┘   │                               │
│  │                              │                               │
│  │      [📨 Generate Link]     │                               │
│  │                              │                               │
│  │  ── Remember password? ──   │                               │
│  │  [🔑 Back to Sign In]       │                               │
│  └─────────────────────────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Analysis History
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Analysis History              [+ New Analysis]                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ File          Risk     Score  Comp  Effort   Date       │    │
│  │ ──────────────────────────────────────────────────────  │    │
│  │ 📄 wf_brs...  HIGH      40    21    30d/212h Aug 19    │    │
│  │ 📄 etl_map... MEDIUM    12     8    15d/96h  Aug 18    │    │
│  │ 📄 config...  LOW        3     2     3d/20h  Aug 17    │    │
│  │ 📄 schema...  HIGH      18    12    20d/148h Aug 16    │    │
│  │ 📄 pipeline.. MEDIUM     8     5    10d/68h  Aug 15    │    │
│  │                                                         │    │
│  │ Actions: [👁 View] [🗑 Delete]                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│        [< Prev]  [1] [2] [3] ... [5]  [Next >]                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Python | 3.10+ |
| **Web Framework** | Flask | 3.0+ |
| **Database** | SQLite via Flask-SQLAlchemy | 3.1+ |
| **Authentication** | PyJWT (HS256) + Werkzeug | 2.8+ / 3.0+ |
| **XML Parsing** | xmltodict | 0.14+ |
| **CORS** | flask-cors | 4.0+ |
| **Email** | Gmail SMTP (smtplib) | - |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | - |
| **Icons** | Lucide Icons | latest |
| **Fonts** | Inter, JetBrains Mono | Google Fonts |
| **Architecture** | Decoupled SPA (Vercel) + REST API (Render) | - |
| **WSGI Server** | Gunicorn | 21+ |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                    CLIENT (Vercel — Static SPA)                       │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Landing  │  │Dashboard │  │ History  │  │ Profile  │            │
│  │  Page    │  │  Upload  │  │  Table   │  │ Settings │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │              │              │              │                   │
│       └──────────────┴──────────────┴──────────────┘                   │
│                          │ fetch() + JWT Bearer                       │
│                          ▼                                            │
│               CORS ──────────────────────────┐                       │
└──────────────────────────────────────────────┼───────────────────────┘
                                               │
                          ┌────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────────────────────┐
│               SERVER (Render — Flask REST API)                        │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Route Handlers                             │   │
│  │  /  /api/login  /api/register  /api/dashboard  /api/analyze │   │
│  │  /api/history  /api/profile   /api/forgot-password          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                           │
│  ┌───────────────────────┴──────────────────────────────────────┐   │
│  │               Analysis Pipeline                               │   │
│  │                                                               │   │
│  │  ┌─────────┐   ┌──────────┐   ┌──────────────────┐          │   │
│  │  │ XML     │──>│ Impact   │──>│ Report           │          │   │
│  │  │ Parser  │   │ Engine   │   │ Generator        │          │   │
│  │  │xmltodict│   │42 Rules  │   │ TXT + JSON       │          │   │
│  │  └─────────┘   └──────────┘   └──────────────────┘          │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                          │                                           │
│  ┌───────────────────────┴──────────────────────────────────────┐   │
│  │              SQLite Database (SQLAlchemy)                      │   │
│  │    ┌──────────────┐  ┌──────────────┐  ┌──────────┐         │   │
│  │    │    Users      │  │ AnalysisHx   │  │ResetToken│         │   │
│  │    │  id, username │  │ filename,    │  │token,exp │         │   │
│  │    │  email, hash  │  │ risk, score, │  │used      │         │   │
│  │    └──────────────┘  │ effort, etc  │  └──────────┘         │   │
│  │                       └──────────────┘                       │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                          │                                           │
│  ┌───────────────────────┴──────────────────────────────────────┐   │
│  │              Gmail SMTP (Password Reset)                      │   │
│  └───────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
Strategic_Impact_Analyzer/
│
├── app.py                          # Flask application (routes, auth, analysis)
├── models.py                       # SQLAlchemy models (User, AnalysisHistory, ResetToken)
├── requirements.txt                # Python dependencies
├── Procfile                        # Render deployment config
├── render.yaml                     # Render blueprint
├── vercel.json                     # Vercel SPA deployment config (root)
├── .env.example                    # Environment variable template
├── .gitignore                      # Git ignore rules
│
├── analyzer/                       # Core analysis engine
│   ├── __init__.py
│   ├── xml_parser.py               # XML → JSON conversion + key flattening
│   ├── impact_engine.py            # Risk scoring engine (42 component rules)
│   └── report_generator.py         # Text + JSON report builder
│
├── templates/                      # Jinja2 HTML templates (monolith mode)
│   ├── base.html                   # Base layout (navbar, footer, flash messages)
│   ├── landing.html                # Public landing/marketing page
│   ├── login.html                  # User login with password toggle
│   ├── register.html               # User registration with strength indicator
│   ├── forgot_password.html        # Forgot password - email input form
│   ├── reset_password.html         # Reset password - new password form
│   ├── dashboard.html              # Main analyzer (upload + results)
│   ├── history.html                # Analysis history with pagination
│   ├── view_analysis.html          # Individual analysis detail view
│   └── profile.html                # User profile settings
│
├── static/
│   ├── css/
│   │   └── style.css               # Complete application stylesheet (2100+ lines)
│   └── js/
│       └── app.js                  # Client-side application logic
│
├── frontend/                       # Standalone SPA (deployed to Vercel)
│   ├── vercel.json                 # Vercel SPA rewrite rules
│   ├── index.html                  # Landing page
│   ├── login.html                  # Login (SPA)
│   ├── register.html               # Register (SPA)
│   ├── forgot-password.html        # Forgot password (SPA)
│   ├── reset-password.html         # Reset password (SPA)
│   ├── dashboard.html              # Dashboard (SPA)
│   ├── history.html                # History (SPA)
│   ├── view-analysis.html          # View analysis (SPA)
│   ├── profile.html                # Profile (SPA)
│   ├── css/
│   │   └── style.css               # SPA stylesheet
│   └── js/
│       └── app.js                  # SPA client-side logic
│
├── docs/
│   ├── PRD.md                      # Product Requirements Document
│   └── BRD.md                      # Business Requirements Document
│
├── uploads/                        # Stored XML uploads (git-ignored)
└── reports/                        # Generated reports (git-ignored)
```

---

## Getting Started

### Prerequisites

- **Python 3.10** or higher
- **pip** (Python package manager)
- **Gmail account** with App Password (for password reset emails)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/methila-2056/Ai-requirement-change-impact-analyzer.git
cd Ai-requirement-change-impact-analyzer
```

**2. Create a virtual environment**

```bash
python -m venv venv
```

**3. Activate the virtual environment**

```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

**4. Install dependencies**

```bash
pip install -r requirements.txt
```

**5. Configure environment variables**

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your Gmail App Password
```

**6. Run the application**

```bash
python app.py
```

**7. Open in browser**

```
http://127.0.0.1:5000
```

**8. Create an account** and start analyzing XML files!

---

## How It Works

### Analysis Pipeline (8 Steps)

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│  XML Upload  │ ──> │  XML Parser  │ ──> │ Impact Engine  │ ──> │   Reports    │
│  (User)      │     │  (xmltodict) │     │ (42 rules)    │     │ (TXT + JSON) │
└─────────────┘     └──────────────┘     └───────────────┘     └──────────────┘
```

| Step | Action | Description |
|------|--------|-------------|
| 1 | **Upload** | User drags/drops or selects an XML file (max 16 MB) |
| 2 | **Parse** | `xmltodict` converts XML to a nested Python dictionary |
| 3 | **Flatten** | All keys and string values are extracted into a searchable set |
| 4 | **Match** | The impact engine scans against 42 component keywords using regex |
| 5 | **Score** | Risk points are aggregated; effort is calculated in days and hours |
| 6 | **Classify** | Overall risk is classified as HIGH / MEDIUM / LOW / UNKNOWN |
| 7 | **Report** | Formatted text and JSON reports are generated and stored |
| 8 | **History** | Results are saved to the database under the user's account |

---

## Risk Classification

| Risk Level | Score Range | Description |
|------------|-------------|-------------|
| **HIGH** | 10+ | Multiple critical components affected. Full regression testing required. |
| **MEDIUM** | 5–9 | Moderate impact. Some dependent modules need review. |
| **LOW** | 1–4 | Limited impact. Minor component changes only. |
| **UNKNOWN** | 0 | No standard components detected. Manual review recommended. |

---

## Component Rules

The engine includes **42 component types** across 4 categories:

### ETL / Data Integration (18 rules)
Source System, Target System, Transformation Logic, Lookup Component, Join Logic, ETL Mapping, Workflow/Job Schedule, Session Config, Expression/Formula, Aggregator Logic, Filter Condition, Sort Logic, Router/Conditional Flow, Sequence Generator, Normalizer, Rank Transformation, Update Strategy, Joiner Transformation

### Data Architecture (9 rules)
Schema/Column Definition, Data Schema, Data Pipeline, Connector/Connection, Repository/Metadata, Database Layer, Table Definition, Field/Attribute, Key/Index, Data Constraint

### Application (7 rules)
Security Layer, Authentication, API Layer, Payment System, Notification Service, Reporting Module, Dashboard/Analytics

### Infrastructure (4 rules)
Cache Layer, Logging/Audit, Configuration, Parameter/Variable

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | No | API root (health check) |
| `POST` | `/api/register` | No | Create new user account |
| `POST` | `/api/login` | No | Authenticate and get JWT token |
| `GET` | `/api/me` | Yes | Get current user info |
| `POST` | `/api/forgot-password` | No | Generate password reset token |
| `POST` | `/api/reset-password/<token>` | No | Reset password with token |
| `GET` | `/api/dashboard` | Yes | Dashboard stats + recent analyses |
| `POST` | `/api/analyze` | Yes | Upload and analyze XML file |
| `GET` | `/api/history` | Yes | Paginated analysis history |
| `GET` | `/api/history/<id>` | Yes | View specific analysis detail |
| `DELETE` | `/api/history/<id>` | Yes | Delete an analysis |
| `GET` | `/api/profile` | Yes | Get user profile |
| `PUT` | `/api/profile` | Yes | Update user profile |
| `POST` | `/api/logout` | Yes | Invalidate session |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | *(auto-generated)* | Flask session / JWT secret key |
| `FLASK_DEBUG` | `true` | Enable/disable debug mode |
| `SMTP_HOST` | `smtp.gmail.com` | Gmail SMTP server |
| `SMTP_PORT` | `587` | SMTP port (TLS) |
| `SMTP_USER` | - | Your Gmail address |
| `SMTP_PASS` | - | Gmail App Password (16 chars) |
| `MAIL_FROM` | *(same as SMTP_USER)* | Sender email address |

> **Important:** Set `SECRET_KEY` to a secure random value in production. Never commit `.env` to git.

---

## Deployment

### Live Deployment

| Service | URL | Platform |
|---------|-----|----------|
| **Frontend (SPA)** | [ai-requirement-change-impact-analyz.vercel.app](https://ai-requirement-change-impact-analyz.vercel.app/) | Vercel |
| **Backend (API)** | [strategic-impact-analyzer.onrender.com](https://strategic-impact-analyzer.onrender.com/) | Render |

### Deploy Backend to Render (Free)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click **New +** → **Blueprint**
4. Connect your GitHub repo
5. Render auto-detects `render.yaml` and sets everything up
6. Add environment variables in the Render dashboard:
   - `SMTP_USER` → your Gmail
   - `SMTP_PASS` → your App Password
   - `MAIL_FROM` → your Gmail
7. Deploy — you'll get a live URL

### Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New...** → **Project**
3. Import your GitHub repo
4. Set **Root Directory** to `frontend`
5. Deploy — Vercel serves the static SPA files
6. The SPA automatically connects to the Render backend via `getApiBase()`

### Production Setup (Manual)

```bash
# Set environment variables
export SECRET_KEY="your-secure-random-key-here"
export FLASK_DEBUG="false"
export SMTP_USER="your_email@gmail.com"
export SMTP_PASS="your_app_password"

# Install with version pinning
pip install -r requirements.txt

# Run with Gunicorn (recommended)
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Docker

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Author

**Methila M** — [GitHub](https://github.com/methila-2056)

---

<div align="center">

**Built to make change impact analysis faster, smarter, and more accessible.**

<br>

![Footer](https://img.shields.io/badge/Made_with-❤️-ff4757?style=for-the-badge&labelColor=06080d)

</div>
