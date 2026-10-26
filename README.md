# 🎓 EduBuddy AI — AI-Powered Educational Assistant

> **"EduBuddy AI works like a smart study friend that helps students understand lessons, prepare for exams, make notes, and plan their studies — while helping teachers manage their schoolwork more easily."**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20ES6+-orange.svg)](#frontend)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-green.svg)](#backend)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini-8A2BE2.svg)](#ai-integration)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](#docker-deployment)

---

## 🌟 Overview & Inspiration

Students face a relentless balancing act: deciphering complex STEM topics, cramming for multi-subject exams, synthesizing massive lecture notes, managing daily schedules, and figuring out future college or career pathways. Meanwhile, educators are overwhelmed with lesson preparation, grading rubrics, and quiz drafting.

**EduBuddy AI** bridges this gap as an end-to-end academic companion that provides:
1. **Patience & Clarity:** Instant, step-by-step explanations and real-world analogies.
2. **Confidence:** Practice mock tests with instant error diagnostics and 3D flashcards.
3. **Retention:** Automated extraction of high-yield exam takeaways from raw notes.
4. **Discipline:** Spaced timetable scheduling with an integrated Pomodoro focus timer.
5. **Direction:** Curated college major roadmaps, prerequisite skills, and career outlooks.
6. **Teacher Support:** Printable classroom worksheets, answer keys, and standardized rubrics.

---

## 🚀 The 5 Core Features

```
┌────────────────────────────────────────────────────────────────────────┐
│                              EduBuddy AI                               │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 1. Study Tutor    │ 2. Exam Prep      │ 3. Smart Notes                 │
│ • Step-by-Step    │ • Timed Quizzes   │ • Executive Summaries          │
│ • Socratic Dialog │ • Error Feedback  │ • High-Yield Exam Traps        │
│ • Analogies       │ • 3D Flashcards   │ • Markdown / Cheat Sheet Export│
├───────────────────┼───────────────────┼────────────────────────────────┤
│ 4. Timetable      │ 5. Career Advisor │ 🍎 Bonus: Teacher Hub          │
│ • Schedule Blocks │ • Interest Quiz   │ • Printable Worksheets         │
│ • Pomodoro Timer  │ • College Degrees │ • 4-Tier Grading Rubrics       │
│ • Streak Counter  │ • Salary Outlook  │ • Automated Answer Keys        │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### 1. 🤖 AI Study Assistant
* **Step-by-Step Breakdown:** Deconstructs complex math, physics, biology, and CS concepts into bite-sized logic gates.
* **Explanation Depths:** Switch seamlessly between **ELI5** (Explain Like I'm 5), **High School**, **College Deep-Dive**, or **Quick Exam Revision**.
* **Memorable Analogies:** Uses intuitive analogies (e.g., spinning coins for quantum superposition, solar bakeries for photosynthesis).
* **Suggested Follow-Ups:** Proactively offers high-yield questions to probe comprehension.

### 2. 📝 Tests and Exam Preparation
* **Timed Mock Exams:** Simulates realistic test conditions with subject-specific countdown timers.
* **Instant Explanations:** Explains why correct choices are right and clarifies common misconceptions on wrong answers.
* **Diagnostic Scoring:** Computes score percentages and tracks historical exam attempts.
* **Active Recall Flashcards:** Interactive 3D flip card viewer designed around spaced-repetition memory retention.

### 3. 📄 Smart Notes & Material Summarizer
* **Executive Summary:** Condenses thousands of words from textbook chapters or lecture transcripts into a 2-3 sentence overview.
* **Core Takeaways:** Automatically extracts crucial bullet points.
* **Vocabulary Glossary:** Highlights key domain terms with precise definitions.
* **High-Yield Traps:** Flags common exam traps and pitfalls.
* **One-Click Export:** Download clean, formatted Markdown study guides for offline printing.

### 4. 📅 Study Timetable & Daily Planner
* **Dynamic Daily Schedule:** Add, organize, tag, and complete study blocks with subject color tags.
* **Exam Crunch vs. Balanced Presets:** Instant template loader for crunch weeks or steady study habits.
* **Built-in Pomodoro Focus Engine:** 25-minute deep focus / 5-minute break cycles with synthesized Web Audio chimes and zero external dependencies.
* **Streak Tracker:** Encourages consistent daily learning habits.

### 5. 🧭 Career Guidance & Pathways
* **Interest Alignment Assessment:** 2-minute diagnostic evaluating school subjects, problem-solving preferences, and work environments.
* **Match Scoring:** Calculates percentage fit for careers in AI & Machine Learning, Biomedical Engineering, Quantitative Finance, Clean Energy, Product Design, and more.
* **Actionable Roadmaps:** Identifies High School AP/IB electives, target Bachelor's degrees, high-demand skills, salary bands, and beginner portfolio projects.

### 🍎 Bonus: Teacher & Educator Hub
* **Automated Quiz & Worksheet Generator:** Creates formatted student worksheets paired with complete answer keys.
* **4-Tier Grading Rubrics:** Generates standardized rubrics across Conceptual Accuracy, Citations, and Organization.

---

## 🏗️ Architecture & Tech Stack

```
EduBuddy-AI/
├── index.html                   # Zero-dependency, modern responsive Single Page App
├── assets/
│   ├── css/
│   │   └── style.css            # Custom CSS3 theme (Dark/Light mode, Glassmorphism)
│   └── js/
│       ├── app.js               # Global state, theme switcher, Web Audio API chimes
│       ├── studyAssistant.js    # Feature 1: AI Study Assistant & Socratic tutor
│       ├── examPrep.js          # Feature 2: Practice quizzes & 3D flashcards
│       ├── smartNotes.js        # Feature 3: Smart notes summarizer & MD export
│       ├── studyTimetable.js    # Feature 4: Timetable planner & Pomodoro timer
│       ├── careerGuidance.js    # Feature 5: Career assessment & roadmaps
│       └── teacherHub.js        # Bonus: Educator quiz and rubric generator
├── backend/                     # Optional full-stack microservice
│   ├── app/
│   │   ├── main.py              # FastAPI application router
│   │   ├── config.py            # Environment configuration
│   │   └── routers/             # Dedicated endpoints for all 5 modules
│   ├── requirements.txt         # FastAPI, Google Generative AI, Uvicorn
│   ├── .env.example             # Environment template
│   └── Dockerfile               # Production container image
├── docker-compose.yml           # One-command orchestration
├── DEVPOST_SUBMISSION.md        # Comprehensive Hackathon / Devpost documentation
├── LICENSE                      # MIT Open Source License
└── README.md                    # Project documentation
```

### Technology Highlights
* **Zero-Install Client App:** Pure HTML5, modern CSS3 variables, and vanilla ES6+ modules. Opens directly in any web browser without needing `npm install` or local servers.
* **Web Audio API:** Synthesizes timer chimes and success tones directly in JavaScript without relying on external MP3 assets or external CDNs.
* **Dual AI Execution:**
  1. **Instant Offline Engine:** Curated academic knowledge base covering Physics, Biology, Math, and CS for zero latency and offline access.
  2. **Google Gemini Generative AI:** Optional client-side or backend connection to `gemini-1.5-flash` for open-ended, frontier AI responses across any subject.

---

## ⚡ Quickstart Guide

### Option 1: Instant Browser Launch (Zero Setup)
Simply double-click or open [`index.html`](file:///C:/Users/W11/EduBuddy-AI/index.html) in your browser:
* Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.
* All 5 modules and the Teacher Hub work immediately out of the box!
* To enable live Gemini generation, click the ⚙️ icon in the header and paste your Gemini API key (stored securely in your browser's `localStorage`).

### Option 2: Run with Python Backend (FastAPI)
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment & install requirements
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt

# 3. Configure your API key
cp .env.example .env
# Edit .env and insert GEMINI_API_KEY=your_key

# 4. Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```
Visit API Documentation at `http://localhost:8000/docs`.

### Option 3: Run with Docker
```bash
docker compose up --build
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
