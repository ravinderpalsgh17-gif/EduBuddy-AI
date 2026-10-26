# Devpost Project Submission: EduBuddy AI

## Tagline
Your smart AI study friend that helps students understand lessons, prepare for exams, make notes, and plan their studies — while helping teachers manage schoolwork effortlessly.

---

## 💡 Inspiration
Every student has experienced that feeling of staring at a textbook page at 11 PM:
* The formulas look like an incomprehensible puzzle.
* The exam is only 48 hours away.
* Lecture notes are disorganized walls of text.
* Time management feels overwhelming.
* Nobody is available to answer questions step-by-step without judgment.

At the same time, hardworking teachers spend countless hours after school drafting quizzes, writing answer keys, and structuring grading rubrics.

We built **EduBuddy AI** to be the ultimate companion for both sides of the classroom: a patient, always-available study buddy for students, and an efficiency multiplier for teachers.

---

## ✨ What It Does

EduBuddy AI features five primary student modules and a dedicated educator hub:

### 1. 🤖 AI Study Assistant
* **Step-by-Step Breakdown:** Answers any academic question by deconstructing the solution into intuitive milestones.
* **Flexible Explanation Levels:** Switch from **ELI5** (Explain Like I'm 5) with relatable real-world analogies to **College Deep-Dive** or **Exam Quick Revision**.
* **Proactive Follow-ups:** Automatically suggests high-yield questions to test understanding.

### 2. 📝 Tests and Exam Preparation
* **Timed Mock Exams:** Generates realistic practice tests with countdown timers and dynamic difficulty (Easy, Medium, Hard).
* **Instant Diagnostic Feedback:** Details why correct choices are right and points out why incorrect options fail.
* **Interactive 3D Flashcards:** Built for active recall and spaced repetition drills.

### 3. 📄 Smart Notes & Material Summarizer
* **Executive Summary:** Condenses lengthy textbook chapters and lecture transcripts into a 2-paragraph overview.
* **Core Takeaways:** Formats essential concepts into memorable bullet points.
* **Vocabulary Glossary:** Highlights essential terms and definitions.
* **Exam Traps:** Explicitly warns students about common test pitfalls.
* **Export:** One-click download of printable, formatted Markdown study guides.

### 4. 📅 Study Timetable & Daily Planner
* **Daily Schedule Manager:** Add, track, tag, and complete subject blocks.
* **Schedule Presets:** Includes "Balanced Weekday" and "Exam Crunch" templates.
* **Built-in Pomodoro Timer:** 25-minute focus intervals and 5-minute breaks with browser-synthesized audio chimes.
* **Habit Tracker:** Visual streak counter and daily study minute accumulator.

### 5. 🧭 Career Guidance & Pathways
* **Interest Alignment Assessment:** Matches student skills, favorite subjects, and problem-solving styles with modern high-growth careers.
* **Educational Roadmaps:** Details high school electives to prioritize, recommended Bachelor's majors, industry salary bands, and starter resume projects.

### 🍎 Bonus: Teacher Hub
* **Classroom Quiz Generator:** Creates student worksheets and paired teacher answer keys in seconds.
* **Standardized 4-Tier Rubrics:** Generates objective grading frameworks across Conceptual Accuracy, Citations, and Clarity.

---

## 🛠️ How We Built It
* **Zero-Dependency Modern Frontend:** Built with vanilla HTML5, CSS3 with dark/light themes, and ES6+ modular JavaScript for instant loading without build tools.
* **Web Audio API:** Used browser-native audio synthesis for timer alerts and quiz sound effects, requiring zero external MP3 assets.
* **Dual-Tier AI Intelligence:**
  * **Instant Offline Engine:** Curated domain models in Physics, Biology, Math, and Computer Science to provide instantaneous, offline-ready study assistance.
  * **Google Gemini Integration:** Direct client-side and backend integrations with `gemini-1.5-flash` for open-ended, multi-subject frontier AI capabilities.
* **FastAPI Microservice Backend:** Complete Python 3.11 backend with Pydantic validation, CORS middleware, Docker containerization, and clean RESTful endpoints.

---

## 🏆 Accomplishments That We're Proud Of
* **Complete Independence:** The application works instantly right out of the box with zero installations or API keys needed, yet scales seamlessly when connected to live Gemini models.
* **Multi-Modal Academic Utility:** Bringing together tutoring, testing, note summarization, scheduling, and career planning into a cohesive, user-friendly interface.
* **Teacher Support:** Ensuring educators are supported with one-click test and rubric generation.

---

## 🔮 What's Next for EduBuddy AI
* **Multimodal Image & Handwritten Math OCR:** Letting students snap pictures of handwritten calculus notes or textbook diagrams.
* **Voice-Interactive Socratic Dialog:** Natural voice conversation mode for hands-free audio study sessions.
* **Classroom Sync:** Real-time collaboration between teachers and students for shared flashcard decks and live quizzes.
