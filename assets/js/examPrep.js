// EduBuddy AI - Feature 2: Tests and Exam Preparation
window.ExamPrep = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  quizTimerInterval: null,
  timeRemainingSecs: 300,

  // Flashcards state
  flashcards: [],
  currentCardIndex: 0,

  questionBanks: {
    "Biology": [
      {
        question: "Which organelle is responsible for generating the majority of cellular ATP via oxidative phosphorylation?",
        options: ["Endoplasmic Reticulum", "Mitochondria", "Golgi Apparatus", "Ribosome"],
        correctIndex: 1,
        explanation: "Mitochondria are the 'powerhouses' of the eukaryotic cell, housing the electron transport chain and ATP synthase."
      },
      {
        question: "During DNA replication, which enzyme unwinds the double helix at the replication fork?",
        options: ["DNA Ligase", "RNA Polymerase", "DNA Helicase", "Topoisomerase"],
        correctIndex: 2,
        explanation: "DNA Helicase breaks the hydrogen bonds between complementary base pairs to unwind the double helix."
      },
      {
        question: "Which blood type is considered the universal red blood cell donor in humans?",
        options: ["AB Positive", "O Negative", "A Negative", "B Positive"],
        correctIndex: 1,
        explanation: "O Negative red blood cells lack A, B, and Rh surface antigens, preventing immune rejection in nearly all recipients."
      }
    ],
    "Physics": [
      {
        question: "According to Newton's Second Law of Motion, what is the relationship between force (F), mass (m), and acceleration (a)?",
        options: ["F = m / a", "F = m · a", "F = m + a", "F = 0.5 · m · a²"],
        correctIndex: 1,
        explanation: "F = ma states that net force equals mass times acceleration in an inertial reference frame."
      },
      {
        question: "What is the SI unit of electrical resistance?",
        options: ["Volt (V)", "Ampere (A)", "Ohm (Ω)", "Watt (W)"],
        correctIndex: 2,
        explanation: "The Ohm (Ω) is the SI unit of electrical resistance, defined as volts per ampere (R = V/I)."
      },
      {
        question: "When light travels from air into glass, why does it bend toward the normal line?",
        options: ["Its frequency increases", "Its speed decreases in the denser medium", "Its speed increases", "Total internal reflection occurs"],
        correctIndex: 1,
        explanation: "By Snell's Law, when light enters an optically denser medium (higher index of refraction), its phase velocity decreases, refracting it toward the normal."
      }
    ],
    "Mathematics": [
      {
        question: "What is the derivative of f(x) = 3x² + 5x - 7 with respect to x?",
        options: ["6x + 5", "3x + 5", "6x² + 5", "6x - 7"],
        correctIndex: 0,
        explanation: "Applying the power rule d/dx[x^n] = n*x^(n-1): d/dx(3x²) = 6x, d/dx(5x) = 5, and d/dx(-7) = 0."
      },
      {
        question: "What is the solution set to the equation x² - 9 = 0?",
        options: ["x = 3 only", "x = -3 only", "x = 3 and x = -3", "x = 9"],
        correctIndex: 2,
        explanation: "Factoring difference of squares gives (x - 3)(x + 3) = 0, yielding x = ±3."
      },
      {
        question: "What is the value of sin(90°) in degrees?",
        options: ["0", "0.5", "1", "Undefined"],
        correctIndex: 2,
        explanation: "On the unit circle at 90° (π/2 radians), the y-coordinate is 1, so sin(90°) = 1."
      }
    ],
    "Computer Science": [
      {
        question: "What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIndex: 1,
        explanation: "Because a balanced BST halves the search space at each comparison level, search runs in logarithmic time O(log n)."
      },
      {
        question: "Which data structure operates strictly on a Last-In, First-Out (LIFO) protocol?",
        options: ["Queue", "Stack", "Linked List", "Priority Queue"],
        correctIndex: 1,
        explanation: "A Stack enforces LIFO order; elements are pushed and popped from the top."
      },
      {
        question: "In Python, which built-in function returns the number of items in an iterable?",
        options: ["size()", "count()", "len()", "length()"],
        correctIndex: 2,
        explanation: "The standard built-in function `len()` returns the item count of strings, lists, dicts, and tuples."
      }
    ]
  },

  defaultFlashcards: [
    { front: "Mitochondria", back: "Cellular organelle producing ATP via oxidative phosphorylation." },
    { front: "Ohm's Law", back: "V = I × R (Voltage = Current × Resistance)." },
    { front: "Derivative of sin(x)", back: "cos(x)" },
    { front: "Stack vs Queue", back: "Stack is LIFO (Last In First Out); Queue is FIFO (First In First Out)." },
    { front: "Photosynthesis Equation", back: "6CO2 + 6H2O + Light → C6H12O6 + 6O2" },
    { front: "Snell's Law", back: "n1 · sin(θ1) = n2 · sin(θ2)" }
  ],

  init() {
    this.setupListeners();
    this.flashcards = [...this.defaultFlashcards];
    this.renderCurrentFlashcard();
  },

  setupListeners() {
    const startQuizBtn = document.getElementById('start-quiz-btn');
    if (startQuizBtn) {
      startQuizBtn.addEventListener('click', () => this.generateAndStartQuiz());
    }

    const prevCardBtn = document.getElementById('prev-card-btn');
    const nextCardBtn = document.getElementById('next-card-btn');
    const flipCardEl = document.getElementById('flashcard-interactive');

    if (flipCardEl) {
      flipCardEl.addEventListener('click', () => {
        flipCardEl.classList.toggle('flipped');
      });
    }

    if (prevCardBtn) {
      prevCardBtn.addEventListener('click', () => {
        if (this.currentCardIndex > 0) {
          this.currentCardIndex--;
          this.renderCurrentFlashcard();
        }
      });
    }

    if (nextCardBtn) {
      nextCardBtn.addEventListener('click', () => {
        if (this.currentCardIndex < this.flashcards.length - 1) {
          this.currentCardIndex++;
          this.renderCurrentFlashcard();
        }
      });
    }
  },

  generateAndStartQuiz() {
    const subject = document.getElementById('quiz-subject-select')?.value || 'Biology';
    const difficulty = document.getElementById('quiz-difficulty-select')?.value || 'Medium';

    const pool = this.questionBanks[subject] || this.questionBanks["Biology"];
    this.currentQuiz = {
      subject,
      difficulty,
      questions: JSON.parse(JSON.stringify(pool))
    };

    this.currentQuestionIndex = 0;
    this.userAnswers = {};
    this.timeRemainingSecs = 180; // 3 minutes

    document.getElementById('quiz-setup-card').style.display = 'none';
    document.getElementById('quiz-active-card').style.display = 'block';
    document.getElementById('quiz-results-card').style.display = 'none';

    this.startQuizTimer();
    this.renderQuestion();
  },

  startQuizTimer() {
    if (this.quizTimerInterval) clearInterval(this.quizTimerInterval);
    const timerEl = document.getElementById('quiz-timer-display');
    
    this.quizTimerInterval = setInterval(() => {
      this.timeRemainingSecs--;
      const mins = Math.floor(this.timeRemainingSecs / 60);
      const secs = this.timeRemainingSecs % 60;
      if (timerEl) {
        timerEl.textContent = `⏱️ ${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }

      if (this.timeRemainingSecs <= 0) {
        clearInterval(this.quizTimerInterval);
        this.finishQuiz();
      }
    }, 1000);
  },

  renderQuestion() {
    if (!this.currentQuiz) return;
    const q = this.currentQuiz.questions[this.currentQuestionIndex];
    const total = this.currentQuiz.questions.length;

    document.getElementById('quiz-progress-text').textContent = `Question ${this.currentQuestionIndex + 1} of ${total}`;
    document.getElementById('quiz-question-title').textContent = q.question;

    const optionsContainer = document.getElementById('quiz-options-container');
    optionsContainer.innerHTML = '';

    const explanationBox = document.getElementById('quiz-explanation-box');
    explanationBox.style.display = 'none';

    const selected = this.userAnswers[this.currentQuestionIndex];

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;

      if (selected !== undefined) {
        if (idx === q.correctIndex) btn.classList.add('correct');
        if (selected === idx && selected !== q.correctIndex) btn.classList.add('incorrect');
      }

      btn.addEventListener('click', () => {
        if (this.userAnswers[this.currentQuestionIndex] !== undefined) return; // already answered
        this.userAnswers[this.currentQuestionIndex] = idx;
        
        if (idx === q.correctIndex) {
          EduBuddy.playTone('success');
        } else {
          EduBuddy.playTone('error');
        }

        this.renderQuestion();
      });

      optionsContainer.appendChild(btn);
    });

    if (selected !== undefined) {
      explanationBox.style.display = 'block';
      explanationBox.innerHTML = `
        <strong>💡 Answer Explanation:</strong> ${q.explanation}
      `;
    }

    // Action buttons
    const navContainer = document.getElementById('quiz-nav-actions');
    navContainer.innerHTML = '';

    if (this.currentQuestionIndex < total - 1) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-primary btn-sm';
      nextBtn.textContent = 'Next Question →';
      nextBtn.addEventListener('click', () => {
        this.currentQuestionIndex++;
        this.renderQuestion();
      });
      navContainer.appendChild(nextBtn);
    } else {
      const finishBtn = document.createElement('button');
      finishBtn.className = 'btn btn-success btn-sm';
      finishBtn.textContent = 'Submit & Review Score 🏆';
      finishBtn.addEventListener('click', () => this.finishQuiz());
      navContainer.appendChild(finishBtn);
    }
  },

  finishQuiz() {
    if (this.quizTimerInterval) clearInterval(this.quizTimerInterval);

    let correctCount = 0;
    const total = this.currentQuiz.questions.length;

    this.currentQuiz.questions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / total) * 100);

    document.getElementById('quiz-active-card').style.display = 'none';
    const resultsCard = document.getElementById('quiz-results-card');
    resultsCard.style.display = 'block';

    document.getElementById('quiz-final-score').textContent = `${scorePct}%`;
    document.getElementById('quiz-final-stats').textContent = `Answered ${correctCount} of ${total} correctly in ${this.currentQuiz.subject}.`;

    EduBuddy.incrementStat('quizzesTaken', 1);
    EduBuddy.playTone('success');

    const retakeBtn = document.getElementById('retake-quiz-btn');
    if (retakeBtn) {
      retakeBtn.onclick = () => {
        document.getElementById('quiz-setup-card').style.display = 'block';
        resultsCard.style.display = 'none';
      };
    }
  },

  renderCurrentFlashcard() {
    const card = this.flashcards[this.currentCardIndex];
    if (!card) return;

    const flipEl = document.getElementById('flashcard-interactive');
    if (flipEl) flipEl.classList.remove('flipped');

    const frontEl = document.getElementById('flashcard-front-content');
    const backEl = document.getElementById('flashcard-back-content');
    const countEl = document.getElementById('flashcard-counter');

    if (frontEl) frontEl.innerHTML = `<h3 style="font-size: 1.3rem;">${card.front}</h3><span style="font-size:0.75rem; color:var(--text-muted); margin-top:0.5rem;">Click to flip</span>`;
    if (backEl) backEl.innerHTML = `<p style="font-size: 1.1rem; line-height: 1.5;">${card.back}</p>`;
    if (countEl) countEl.textContent = `Card ${this.currentCardIndex + 1} of ${this.flashcards.length}`;
  }
};
