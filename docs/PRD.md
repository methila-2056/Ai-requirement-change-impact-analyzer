# Product Requirements Document (PRD)

## Strategic Impact Analyzer — AI-Powered Change Impact Analysis

---

**Document Version:** 2.0
**Date:** August 2026
**Author:** Methila
**Repository:** https://github.com/methila-2056/Ai-requirement-change-impact-analyzer
**Classification:** Academic Mini Project

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [User Personas](#2-user-personas)
3. [User Stories](#3-user-stories)
4. [Feature Specifications](#4-feature-specifications)
5. [Information Architecture](#5-information-architecture)
6. [UI/UX Requirements](#6-uiux-requirements)
7. [Technical Specifications](#7-technical-specifications)
8. [API Specification](#8-api-specification)
9. [Database Schema](#9-database-schema)
10. [Analysis Pipeline](#10-analysis-pipeline)
11. [Risk Classification Logic](#11-risk-classification-logic)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Testing Strategy](#13-testing-strategy)
14. [Release Plan](#14-release-plan)
15. [Revision History](#15-revision-history)

---

## 1. Product Overview

### 1.1 Vision

To provide software development teams with an intelligent, automated tool for analyzing the impact of requirement changes, enabling faster and more accurate decision-making during the software development lifecycle.

### 1.2 Mission

SIA transforms the manual, time-consuming process of impact analysis into a sub-second automated workflow, delivering professional reports that stakeholders can act on immediately.

### 1.3 Product Goals

| Goal | Description | Success Metric |
|------|-------------|----------------|
| Speed | Deliver analysis results in real-time | < 5 seconds per analysis |
| Accuracy | Detect components accurately | > 90% detection rate |
| Usability | Enable non-technical users | < 2 minutes to first analysis |
| Reporting | Generate stakeholder-ready output | Copy/download support |
| History | Maintain analysis audit trail | Unlimited storage per user |

### 1.4 Key Differentiators

1. **Instant Analysis** — Sub-second XML parsing and impact scoring
2. **42+ Component Rules** — Comprehensive coverage of ETL, data architecture, application, and infrastructure components
3. **Weighted Risk Scoring** — Not just detection, but severity assessment with effort estimates
4. **Professional Reports** — Client-ready communication notes auto-generated
5. **Zero Configuration** — No ML models to train, no APIs to configure

---

## 2. User Personas

### Persona 1: Software Analyst (Primary)

| Attribute | Detail |
|-----------|--------|
| **Name** | Priya |
| **Role** | Senior Software Analyst |
| **Goals** | Quickly assess impact of XML configuration changes |
| **Pain Points** | Manual analysis takes hours, prone to missing dependencies |
| **Frequency** | Daily (5–10 analyses per day) |
| **Technical Level** | High |

### Persona 2: Project Manager (Secondary)

| Attribute | Detail |
|-----------|--------|
| **Name** | Rahul |
| **Role** | Project Manager |
| **Goals** | Get effort estimates for sprint planning |
| **Pain Points** | Relies on analysts for estimates, lacks technical depth |
| **Frequency** | Weekly (reviews analysis history) |
| **Technical Level** | Medium |

### Persona 3: QA Lead (Tertiary)

| Attribute | Detail |
|-----------|--------|
| **Name** | Anika |
| **Role** | QA Lead |
| **Goals** | Identify components requiring regression testing |
| **Pain Points** | Unclear which modules are affected by changes |
| **Frequency** | Per release cycle |
| **Technical Level** | Medium-High |

---

## 3. User Stories

### Epic 1: Authentication

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|---------------------|
| US-001 | As a new user, I want to register an account so I can use the analyzer | High | Form validates username (3+ chars), email, password (6+ chars); duplicate checking; redirect to login on success |
| US-002 | As a registered user, I want to log in with my credentials | High | Username/password validation; session creation; remember-me option; redirect to dashboard |
| US-003 | As a logged-in user, I want to log out securely | High | Session destroyed; redirect to landing page; flash confirmation |
| US-004 | As a logged-in user, I want to update my profile | Medium | Edit name/email; password change with current password verification |

### Epic 2: Impact Analysis

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|---------------------|
| US-005 | As a user, I want to upload an XML file via drag-and-drop | High | .xml validation; 16MB limit; file name display; remove option |
| US-006 | As a user, I want to see analysis results instantly | High | Risk badge; 4 stat cards; component list; client note; report text |
| US-007 | As a user, I want to copy the report to clipboard | Medium | One-click copy; visual feedback ("Copied!") |
| US-008 | As a user, I want to download the report as a text file | Medium | Blob download; filename: impact_report.txt |
| US-009 | As a user, I want to analyze another file | Medium | Reset upload zone; clear results; scroll to top |

### Epic 3: History & Tracking

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|---------------------|
| US-010 | As a user, I want to view all my past analyses | Medium | Paginated table (10/page); filename, risk, score, components, effort, date |
| US-011 | As a user, I want to view a specific analysis in detail | Medium | Full report replay; component list; client note |
| US-012 | As a user, I want to delete an analysis | Low | Confirmation dialog; ownership verification; flash confirmation |
| US-013 | As a user, I want to see recent analyses on the dashboard | Medium | Last 5 analyses; quick link to full history |

### Epic 4: User Experience

| ID | Story | Priority | Acceptance Criteria |
|----|-------|----------|---------------------|
| US-014 | As a user, I want a dark-themed professional interface | High | Consistent dark theme; glassmorphism effects; smooth animations |
| US-015 | As a mobile user, I want the app to work on my phone | Medium | Responsive layout; mobile navigation drawer; touch-friendly |
| US-016 | As a user, I want visual feedback for all actions | Medium | Flash messages; loading spinners; hover effects; transitions |
| US-017 | As a user, I want to see a password strength indicator | Low | Real-time strength bar; 5 levels (very weak to very strong) |

---

## 4. Feature Specifications

### F-001: Landing Page

| Attribute | Specification |
|-----------|---------------|
| **URL** | `/` (unauthenticated) |
| **Components** | Hero section, feature cards grid, 8-step pipeline visualization, stats bar, CTA section |
| **Animations** | fadeUp on load, orbFloat on background, hover lift on cards |
| **CTAs** | "Start Analyzing" (register), "Sign In" (login) |

### F-002: User Registration

| Attribute | Specification |
|-----------|---------------|
| **URL** | `/register` |
| **Fields** | Full Name (text), Username (text, 3+ chars, alphanumeric+underscore), Email (email), Password (password, 6+ chars), Confirm Password (password) |
| **Validation** | Client-side: required, minlength, pattern. Server-side: duplicate checking, email format, password match |
| **Success** | Flash "Account created!", redirect to login |
| **Strength Indicator** | 5-level bar: Very Weak (red), Weak (orange), Fair (orange), Strong (green), Very Strong (green) |

### F-003: User Login

| Attribute | Specification |
|-----------|---------------|
| **URL** | `/login` |
| **Fields** | Username (text), Password (password with toggle), Remember Me (checkbox) |
| **Validation** | Server-side: user existence, password hash check |
| **Success** | Flash "Welcome back, {name}!", redirect to dashboard or next param |
| **Failure** | Flash "Invalid username or password.", stay on login |

### F-004: Dashboard

| Attribute | Specification |
|-----------|---------------|
| **URL** | `/dashboard` (auth required) |
| **Components** | Header with user badge, 3 stat cards, upload zone, loading animation, results container, recent analyses table |
| **Upload Zone** | Drag-and-drop area with .xml validation, file name display, remove button |
| **Loading** | Spinner with 3-step animation: "Parsing XML" -> "Scanning Components" -> "Generating Report" |
| **Results** | Risk badge, 4 stat cards (risk score, components, effort, fast delivery), component list, client note, report box |

### F-005: Impact Analysis (AJAX)

| Attribute | Specification |
|-----------|---------------|
| **URL** | `/analyze` (POST, auth required) |
| **Input** | FormData with `xmlfile` field |
| **Output** | JSON with success/error, filename, impact object, report_text, report_file |
| **Impact Object** | components[], risk_level, risk_score, effort_days, effort_hrs, fast_delivery_days, client_note, total_components |

### F-006: Analysis History

| Attribute | Specification |
|-----------|---------------|
| **URL** | `/history` (auth required) |
| **Pagination** | 10 entries per page, prev/next, page numbers with ellipsis |
| **Columns** | File, Risk (pill), Score, Components, Effort, Date, Actions (View/Delete) |
| **Empty State** | Icon, message, CTA to dashboard |

### F-007: View Analysis Detail

| Attribute | Specification |
|-----------|---------------|
| **URL** | `/history/<id>` (auth required, ownership verified) |
| **Components** | Back button, risk badge, 4 stat cards, component list, client note, report text, timestamp |

### F-008: Profile Settings

| Attribute | Specification |
|-----------|---------------|
| **URL** | `/profile` (auth required) |
| **Fields** | Full Name, Email, Current Password, New Password |
| **Validation** | Email uniqueness, current password verification, new password min length |
| **Success** | Flash "Profile updated!", redirect to profile |

---

## 5. Information Architecture

```
Strategic Impact Analyzer
├── Public
│   ├── Landing Page (/)
│   ├── Login (/login)
│   └── Register (/register)
│
├── Authenticated
│   ├── Dashboard (/dashboard)
│   │   ├── Upload Zone
│   │   ├── Analysis Results (AJAX)
│   │   └── Recent Analyses
│   │
│   ├── Analysis History (/history)
│   │   ├── Paginated Table
│   │   └── View Detail (/history/<id>)
│   │
│   └── Profile Settings (/profile)
│       ├── Edit Info
│       └── Change Password
│
└── API
    └── POST /analyze (JSON response)
```

---

## 6. UI/UX Requirements

### 6.1 Design System

| Element | Specification |
|---------|---------------|
| **Color Palette** | Dark theme: #06080d (bg), #12151e (card), #5b6ef5 (accent), #a855f7 (accent2) |
| **Typography** | Inter (headings/body), JetBrains Mono (code/data) |
| **Icons** | Lucide Icons (CSS font) |
| **Border Radius** | 8px (sm), 12px (md), 16px (lg), 20px (xl) |
| **Shadows** | sm (2px), md (4px), lg (8px), glow (accent glow) |
| **Animations** | fadeUp, slideIn, fadeDown, orbFloat, spin, pulse |

### 6.2 Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| > 1024px | Full 3-column features, horizontal pipeline |
| 768px–1024px | 2-column features, wrapped pipeline |
| 480px–768px | Single column, mobile nav drawer |
| < 480px | Stacked CTAs, full-width elements |

### 6.3 Component States

| Component | States |
|-----------|--------|
| Upload Zone | Default, Hover (glow), Dragover (active), File Selected |
| Button | Default, Hover (lift), Disabled (dimmed), Loading (spinner) |
| Risk Badge | HIGH (red), MEDIUM (orange), LOW (green), UNKNOWN (gray) |
| Flash Message | Success (green), Error (red), Warning (orange), Info (blue) |

---

## 7. Technical Specifications

### 7.1 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | Python | 3.10+ |
| Framework | Flask | 3.0+ |
| Database | SQLite | 3.x |
| ORM | Flask-SQLAlchemy | 3.1+ |
| Auth | Flask-Login | 0.6+ |
| Password | Werkzeug | 3.0+ |
| XML Parser | xmltodict | 0.14+ |
| Frontend | HTML5, CSS3, JavaScript | ES6+ |
| Icons | Lucide Static | latest |
| Fonts | Inter, JetBrains Mono | Google Fonts |

### 7.2 Project Structure

```
Strategic_Impact_Analyzer/
├── app.py                    # Flask application (10.1 KB)
├── models.py                 # SQLAlchemy models (1.8 KB)
├── requirements.txt          # Python dependencies
├── .gitignore                # Git ignore rules
├── analyzer/
│   ├── __init__.py
│   ├── xml_parser.py         # XML parsing + key flattening (1.0 KB)
│   ├── impact_engine.py      # Risk scoring engine (7.2 KB)
│   └── report_generator.py   # Text + JSON report builder (2.1 KB)
├── templates/                # 8 Jinja2 templates
│   ├── base.html
│   ├── landing.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── history.html
│   ├── view_analysis.html
│   └── profile.html
├── static/
│   ├── css/style.css         # Complete stylesheet (43.8 KB)
│   └── js/app.js             # Client-side logic (13.2 KB)
├── uploads/                  # Stored XML files (git-ignored)
├── reports/                  # Generated reports (git-ignored)
└── docs/
    ├── BRD.md                # Business Requirements Document
    └── PRD.md                # Product Requirements Document
```

### 7.3 Dependencies

```
flask>=3.0
flask-login>=0.6
flask-sqlalchemy>=3.1
xmltodict>=0.14
werkzeug>=3.0
```

---

## 8. API Specification

### POST /analyze

**Request:**
```
Content-Type: multipart/form-data

xmlfile: <XML file binary>
```

**Success Response (200):**
```json
{
  "success": true,
  "filename": "config.xml",
  "impact": {
    "components": [
      {
        "name": "Source System",
        "keyword": "SOURCE",
        "risk": 3,
        "effort_days": 2,
        "effort_hrs": 16
      }
    ],
    "risk_level": "HIGH",
    "risk_score": 40,
    "effort_days": 30,
    "effort_hrs": 212,
    "fast_delivery_days": 15,
    "client_note": "This change has HIGH risk...",
    "total_components": 21
  },
  "report_text": "============================================================\n   STRATEGIC REQUIREMENT CHANGE IMPACT ANALYSIS REPORT...",
  "chunk_file": "reports/20260819_143025_config_chunk.json",
  "report_file": "reports/20260819_143025_config_impact_report.txt"
}
```

**Error Response (400):**
```json
{
  "error": "Please upload a valid .xml file"
}
```

---

## 9. Database Schema

### Users Table

```sql
CREATE TABLE users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    username        VARCHAR(80) NOT NULL UNIQUE,
    email           VARCHAR(120) NOT NULL UNIQUE,
    password_hash   VARCHAR(256) NOT NULL,
    full_name       VARCHAR(120) NOT NULL DEFAULT '',
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

### Analysis History Table

```sql
CREATE TABLE analysis_history (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             INTEGER NOT NULL,
    filename            VARCHAR(255) NOT NULL,
    risk_level          VARCHAR(20) NOT NULL,
    risk_score          INTEGER NOT NULL DEFAULT 0,
    total_components    INTEGER NOT NULL DEFAULT 0,
    effort_days         INTEGER NOT NULL DEFAULT 0,
    effort_hrs          INTEGER NOT NULL DEFAULT 0,
    fast_delivery_days  INTEGER NOT NULL DEFAULT 0,
    client_note         TEXT,
    report_text         TEXT,
    impact_json         TEXT,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_analysis_user_id ON analysis_history(user_id);
```

---

## 10. Analysis Pipeline

### Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ANALYSIS PIPELINE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: UPLOAD                                                 │
│  ├── User selects/drops .xml file                               │
│  ├── Client validates .xml extension                            │
│  └── FormData sent via AJAX POST to /analyze                    │
│                                                                 │
│  Step 2: PARSE                                                  │
│  ├── xmltodict.parse() converts XML → Python dict               │
│  └── Error handling for malformed XML                           │
│                                                                 │
│  Step 3: FLATTEN                                                │
│  ├── Recursive key extraction (parent.child.grandchild)         │
│  ├── All string values added to corpus                          │
│  └── Result: Set of uppercase searchable strings                │
│                                                                 │
│  Step 4: MATCH                                                  │
│  ├── For each of 42 keywords:                                   │
│  │   ├── Try word-boundary regex: \bKEYWORD\b                   │
│  │   └── Fallback to substring: KEYWORD in full_text            │
│  └── Collect matched components with metadata                   │
│                                                                 │
│  Step 5: SCORE                                                  │
│  ├── Sum risk weights (1-3 per component)                       │
│  ├── Sum effort days and hours                                  │
│  └── Calculate fast delivery: max(1, total_days // 2)           │
│                                                                 │
│  Step 6: CLASSIFY                                               │
│  ├── score >= 10  → HIGH                                        │
│  ├── score >= 5   → MEDIUM                                      │
│  ├── score > 0    → LOW                                         │
│  └── score == 0   → UNKNOWN                                     │
│                                                                 │
│  Step 7: REPORT                                                 │
│  ├── Generate formatted text report                             │
│  ├── Generate JSON report                                       │
│  └── Save both to reports/ directory                            │
│                                                                 │
│  Step 8: STORE                                                  │
│  ├── Save to AnalysisHistory table                              │
│  ├── Link to current_user.id                                    │
│  └── Return JSON response to client                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Risk Classification Logic

```python
def classify_risk(total_risk_score):
    if total_risk_score >= 10:
        return "HIGH"      # Multiple critical components affected
    elif total_risk_score >= 5:
        return "MEDIUM"    # Moderate impact, some modules need review
    elif total_risk_score > 0:
        return "LOW"       # Limited impact, minor changes only
    else:
        return "UNKNOWN"   # No components detected, manual review needed
```

### Effort Estimation Formula

```python
total_effort_days = sum(component.effort_days for component in matched_components)
total_effort_hrs = sum(component.effort_hrs for component in matched_components)
fast_delivery_days = max(1, total_effort_days // 2)  # 2-person team
```

---

## 12. Non-Functional Requirements

### 12.1 Performance

| Metric | Target |
|--------|--------|
| Analysis time (16MB XML) | < 5 seconds |
| Page load time | < 2 seconds |
| Database query time | < 100ms |
| Upload processing | < 3 seconds |

### 12.2 Security

| Control | Implementation |
|---------|---------------|
| Password hashing | Werkzeug generate_password_hash (bcrypt) |
| Session management | Flask-Login with secure cookies |
| Input validation | Server-side + client-side validation |
| File validation | Extension check (.xml) + size limit (16MB) |
| Ownership check | user_id verification on view/delete |
| Secret key | Auto-generated via secrets.token_hex(32) |

### 12.3 Scalability

| Limit | Value |
|-------|-------|
| Max file size | 16 MB |
| Max users | Unlimited (SQLite) |
| Max analyses | Unlimited per user |
| Pagination | 10 per page |
| Component rules | 42 (extensible) |

### 12.4 Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## 13. Testing Strategy

### 13.1 Manual Testing

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Register new user | Fill form, submit | Account created, redirect to login |
| Login with valid credentials | Enter username/password | Dashboard loads with user info |
| Upload valid XML | Drag/drop .xml file | Results displayed with risk badge |
| Upload invalid file | Select .png file | Error: "Only .xml files accepted" |
| Upload large file | Select 20MB XML | Error: "File too large" |
| View analysis history | Navigate to /history | Paginated table with entries |
| Delete analysis | Click delete, confirm | Entry removed, flash confirmation |
| Profile update | Change name, save | Profile updated, flash success |
| Password change | Enter current + new | Password updated, flash success |
| Logout | Click sign out | Session ended, redirect to landing |

### 13.2 Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty XML file | Parsed successfully, 0 components, UNKNOWN risk |
| XML with no matching keywords | 0 components, UNKNOWN risk, manual review note |
| XML with all 42 keywords | All components detected, HIGH risk |
| Multiple analyses by same user | All stored independently, correct ownership |
| Concurrent uploads | Sequential processing (SQLite locking) |

---

## 14. Release Plan

### v1.0 (Initial Release)
- Basic XML upload and analysis
- Single-file HTML interface
- Text report generation

### v2.0 (Current — Enhanced)
- Complete UI overhaul with dark theme
- User authentication system
- 8 separate page templates
- Mobile responsive design
- Analysis history with pagination
- Profile management
- Professional README
- BRD and PRD documentation

### v3.0 (Future — Potential)
- REST API for third-party integration
- ML-based risk prediction
- Team collaboration features
- Export to PDF
- Dashboard analytics charts
- Docker deployment support

---

## 15. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | - | Methila | Initial PRD creation |
| 2.0 | August 2026 | Methila | Complete rewrite with full feature specs, user stories, API docs, and database schema |

---

*End of Product Requirements Document*
