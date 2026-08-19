# Business Requirements Document (BRD)

## Strategic Impact Analyzer — AI-Powered Change Impact Analysis

---

**Document Version:** 2.0
**Date:** August 2026
**Author:** Methila
**Repository:** https://github.com/methila-2056/Ai-requirement-change-impact-analyzer
**Classification:** Academic Mini Project

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Scope](#2-project-scope)
3. [Business Requirements](#3-business-requirements)
4. [Component Rules Database](#4-component-rules-database)
5. [Risk Assessment Matrix](#5-risk-assessment-matrix)
6. [Stakeholder Analysis](#6-stakeholder-analysis)
7. [Success Criteria](#7-success-criteria)
8. [Constraints](#8-constraints)
9. [Glossary](#9-glossary)
10. [Revision History](#10-revision-history)

---

## 1. Executive Summary

### 1.1 Purpose

The **Strategic Impact Analyzer (SIA)** is a web-based application designed to automate the analysis of software requirement changes. When XML configuration files (ETL mappings, data pipeline schemas, system configurations) are modified, the system identifies affected components, calculates risk scores, and provides accurate effort estimates — reducing analysis time by **93.2%** compared to manual expert analysis.

### 1.2 Business Problem

In enterprise software environments, requirement changes propagate through complex dependency chains. Currently, analysts manually assess impact by:

- Reading through XML configuration files line by line
- Identifying affected components through domain expertise
- Manually calculating risk scores and effort estimates
- Documenting findings in spreadsheets or reports

This process is **time-consuming** (4–8 hours per analysis), **error-prone** (human oversight in large files), and **inconsistent** (different analysts produce different assessments).

### 1.3 Proposed Solution

SIA automates the entire impact analysis pipeline:

1. Upload XML configuration files via a web interface
2. Parse and flatten XML structure into searchable text
3. Scan against 42+ pre-defined component rules using regex matching
4. Calculate weighted risk scores and effort estimates
5. Generate professional reports with client communication notes
6. Store results in a database for historical tracking

### 1.4 Expected Benefits

| Benefit | Metric |
|---------|--------|
| Time Reduction | From 4–8 hours to <5 seconds per analysis |
| Accuracy Improvement | 93.2% time savings vs. manual expert analysis |
| Consistency | Automated rule-based scoring eliminates subjective variation |
| Documentation | Automatic report generation with client-ready communication notes |
| Tracking | Historical analysis storage for trend monitoring |

---

## 2. Project Scope

### 2.1 In Scope

| Feature | Description |
|---------|-------------|
| XML File Upload | Drag-and-drop or click-to-browse upload of .xml files (max 16 MB) |
| XML Parsing | Conversion of XML to structured Python dictionaries using xmltodict |
| Impact Analysis | Rule-based scanning against 42 component types across 4 categories |
| Risk Classification | Automatic classification as HIGH (10+), MEDIUM (5-9), LOW (1-4), or UNKNOWN (0) |
| Effort Estimation | Working days, man-hours, and fast-track delivery for 2-person teams |
| Report Generation | Formatted text reports and structured JSON reports |
| User Authentication | Registration, login, logout with bcrypt password hashing |
| Analysis History | Paginated storage and retrieval of all past analyses |
| Profile Management | User profile editing with password change |
| Client Notes | Auto-generated advisory text based on risk level |

### 2.2 Out of Scope

- Machine learning models (rule-based engine used instead)
- REST API for third-party integrations
- Multi-tenant or enterprise deployment
- Real-time collaboration features
- Mobile native applications (responsive web only)
- CI/CD pipeline configuration
- Automated testing suite

### 2.3 Assumptions

1. Users have basic familiarity with XML configuration files
2. The system operates in a single-user desktop/server environment
3. Internet connection is available for Google Fonts and Lucide Icons CDN
4. Python 3.10+ is available on the target machine
5. SQLite is sufficient for the data storage requirements

---

## 3. Business Requirements

### 3.1 Functional Requirements

#### BR-001: XML File Upload
- **Priority:** High
- **Description:** Users shall be able to upload XML files via drag-and-drop or file browser
- **Acceptance Criteria:**
  - Only .xml files are accepted (client-side validation)
  - Maximum file size is 16 MB (server-side enforcement)
  - File name is displayed after selection with option to remove
  - Upload progress is indicated visually

#### BR-002: Impact Analysis Engine
- **Priority:** High
- **Description:** The system shall analyze uploaded XML files against 42 component rules
- **Acceptance Criteria:**
  - XML is parsed into a Python dictionary using xmltodict
  - All keys and string values are flattened into a searchable text corpus
  - 42 component keywords are matched using regex with word-boundary and substring fallback
  - Risk scores are calculated as the sum of matched component risk weights
  - Effort estimates aggregate days and hours from all matched components

#### BR-003: Risk Classification
- **Priority:** High
- **Description:** The system shall classify overall risk based on aggregated scores
- **Acceptance Criteria:**
  - HIGH risk: score >= 10
  - MEDIUM risk: score 5–9
  - LOW risk: score 1–4
  - UNKNOWN risk: score 0 (no components detected)

#### BR-004: Report Generation
- **Priority:** High
- **Description:** The system shall generate formatted impact reports
- **Acceptance Criteria:**
  - Plain text report with box-drawing characters, timestamp, risk summary, component table, and effort section
  - JSON report with structured impact data
  - Reports are saved to the `reports/` directory
  - Reports can be copied to clipboard and downloaded from the UI

#### BR-005: User Authentication
- **Priority:** High
- **Description:** The system shall support user registration and login
- **Acceptance Criteria:**
  - Registration requires: full name, username (3+ chars, alphanumeric + underscore), valid email, password (6+ chars), password confirmation
  - Login supports username/password with optional "remember me"
  - Passwords are hashed using Werkzeug's `generate_password_hash`
  - Session management via Flask-Login
  - All analysis routes require authentication
  - Analysis ownership is verified before view/delete operations

#### BR-006: Analysis History
- **Priority:** Medium
- **Description:** The system shall store and display all past analyses
- **Acceptance Criteria:**
  - History is paginated (10 entries per page)
  - Each entry shows: filename, risk level, score, components, effort, date
  - Users can view full analysis details
  - Users can delete their own analyses (with confirmation)

#### BR-007: Profile Management
- **Priority:** Medium
- **Description:** Users shall be able to update their profile information
- **Acceptance Criteria:**
  - Edit full name and email
  - Change password (requires current password verification)
  - Email uniqueness is validated

#### BR-008: Client Communication Notes
- **Priority:** Medium
- **Description:** The system shall generate advisory text for stakeholder communication
- **Acceptance Criteria:**
  - HIGH risk: Warning about regression testing requirement
  - MEDIUM risk: Advisory about dependent module review
  - LOW risk: Confirmation of limited impact
  - UNKNOWN risk: Recommendation for manual review

### 3.2 Non-Functional Requirements

#### BR-NFR-001: Performance
- Analysis completion within 5 seconds for files up to 16 MB
- Page load time under 2 seconds on standard broadband connection

#### BR-NFR-002: Security
- Passwords stored using bcrypt hashing (Werkzeug)
- Session-based authentication with secure cookies
- File upload validation (type and size enforcement)
- User input sanitization (XSS prevention)
- Path traversal protection on file download routes

#### BR-NFR-003: Usability
- Responsive design for desktop, tablet, and mobile
- Accessible navigation with semantic HTML
- Consistent dark theme across all pages
- Flash message notifications for user actions

#### BR-NFR-004: Reliability
- Graceful error handling for malformed XML files
- Database transaction integrity for analysis storage
- Custom error pages (404, 413, 500)

---

## 4. Component Rules Database

### 4.1 ETL / Data Integration (18 Rules)

| Rule | Label | Risk | Effort (Days) | Effort (Hours) |
|------|-------|------|---------------|----------------|
| SOURCE | Source System | 3 | 2 | 16 |
| TARGET | Target System | 3 | 3 | 24 |
| TRANSFORMATION | Transformation Logic | 2 | 2 | 16 |
| LOOKUP | Lookup Component | 3 | 2 | 16 |
| JOIN | Join Logic | 2 | 1 | 8 |
| MAPPING | ETL Mapping | 2 | 2 | 16 |
| WORKFLOW | Workflow / Job Schedule | 2 | 1 | 8 |
| SESSION | Session Config | 1 | 1 | 4 |
| EXPRESSION | Expression / Formula | 2 | 1 | 8 |
| AGGREGATOR | Aggregator Logic | 2 | 1 | 8 |
| FILTER | Filter Condition | 1 | 1 | 4 |
| SORTER | Sort Logic | 1 | 1 | 4 |
| ROUTER | Router / Conditional Flow | 2 | 1 | 8 |
| SEQUENCE | Sequence Generator | 1 | 1 | 4 |
| NORMALIZER | Normalizer | 2 | 1 | 8 |
| RANK | Rank Transformation | 1 | 1 | 4 |
| UPDATESTRATEGY | Update Strategy | 2 | 1 | 8 |
| JOINER | Joiner Transformation | 2 | 2 | 12 |

### 4.2 Data Architecture (9 Rules)

| Rule | Label | Risk | Effort (Days) | Effort (Hours) |
|------|-------|------|---------------|----------------|
| COLUMN | Schema / Column Definition | 1 | 1 | 4 |
| SCHEMA | Data Schema | 3 | 2 | 16 |
| PIPELINE | Data Pipeline | 3 | 3 | 24 |
| CONNECTOR | Connector / Connection | 2 | 1 | 8 |
| REPOSITORY | Repository / Metadata | 2 | 1 | 8 |
| DATABASE | Database Layer | 3 | 2 | 16 |
| TABLE | Table Definition | 2 | 1 | 8 |
| FIELD | Field / Attribute | 1 | 1 | 4 |
| KEY | Key / Index | 2 | 1 | 8 |
| CONSTRAINT | Data Constraint | 2 | 1 | 8 |

### 4.3 Application (7 Rules)

| Rule | Label | Risk | Effort (Days) | Effort (Hours) |
|------|-------|------|---------------|----------------|
| SECURITY | Security Layer | 3 | 3 | 24 |
| AUTH | Authentication | 3 | 2 | 16 |
| API | API Layer | 2 | 2 | 16 |
| PAYMENT | Payment System | 3 | 3 | 24 |
| NOTIFICATION | Notification Service | 1 | 1 | 8 |
| REPORT | Reporting Module | 2 | 2 | 12 |
| DASHBOARD | Dashboard / Analytics | 2 | 2 | 12 |

### 4.4 Infrastructure (4 Rules)

| Rule | Label | Risk | Effort (Days) | Effort (Hours) |
|------|-------|------|---------------|----------------|
| CACHE | Cache Layer | 1 | 1 | 4 |
| LOG | Logging / Audit | 1 | 1 | 4 |
| CONFIG | Configuration | 1 | 1 | 4 |
| PARAMETER | Parameter / Variable | 1 | 1 | 4 |

---

## 5. Risk Assessment Matrix

| Risk Level | Score Range | Color | Action Required |
|------------|-------------|-------|-----------------|
| HIGH | >= 10 | Red | Full regression testing mandatory. Multiple critical components affected. Deployment freeze until all tests pass. |
| MEDIUM | 5 – 9 | Orange | Additional testing cycles needed. Some dependent modules require review. Staged deployment recommended. |
| LOW | 1 – 4 | Green | Standard review process. Impact limited to minor components. No deployment delay expected. |
| UNKNOWN | 0 | Gray | Manual expert review recommended. No standard components detected in the XML configuration. |

---

## 6. Stakeholder Analysis

| Stakeholder | Role | Interest | Impact |
|-------------|------|----------|--------|
| Software Analysts | Primary Users | Daily impact analysis | High |
| Project Managers | Secondary Users | Effort estimation and risk reports | High |
| Development Team | End Users | Component dependency information | Medium |
| Client/Stakeholders | Report Recipients | Client communication notes | Medium |
| System Administrator | Maintainer | System deployment and configuration | Low |

---

## 7. Success Criteria

| Criterion | Measurement | Target |
|-----------|-------------|--------|
| Analysis Speed | Time from upload to report | < 5 seconds |
| Time Savings | Comparison with manual expert analysis | 93.2% reduction |
| User Adoption | Registered accounts within first month | 10+ users |
| Accuracy | Component detection rate vs. manual review | > 90% |
| User Satisfaction | Feedback rating | > 4.0 / 5.0 |

---

## 8. Constraints

1. **Technology Stack:** Python 3.10+, Flask, SQLite — no external database server required
2. **Budget:** Zero-cost infrastructure (runs on local machine)
3. **Timeline:** Academic mini project with defined semester deadline
4. **Deployment:** Local machine deployment only (no cloud infrastructure)
5. **Security:** Single-user desktop application (no multi-tenancy)

---

## 9. Glossary

| Term | Definition |
|------|------------|
| ETL | Extract, Transform, Load — data integration process |
| XML | Extensible Markup Language — structured data format |
| Impact Analysis | Process of identifying consequences of changes |
| Risk Score | Numerical value representing change severity |
| Effort Estimation | Calculation of time and resources needed |
| Component Rule | Keyword pattern matched against XML content |
| Fast Delivery | Accelerated timeline using 2-person team |

---

## 10. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | - | Methila | Initial BRD creation |
| 2.0 | August 2026 | Methila | Updated with full system analysis, component rules, and risk matrix |

---

*End of Business Requirements Document*
