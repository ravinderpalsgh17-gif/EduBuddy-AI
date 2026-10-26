// EduBuddy AI - Feature 4: Study Timetable & Pomodoro Timer
window.StudyTimetable = {
  tasks: [],
  
  // Pomodoro timer state
  timerMode: 'focus', // 'focus' (25 min) or 'break' (5 min)
  timeRemainingSecs: 25 * 60,
  timerInterval: null,
  isTimerRunning: false,

  init() {
    this.loadTasks();
    this.setupListeners();
    this.updateTimerDisplay();
    this.renderTasks();
  },

  loadTasks() {
    const saved = localStorage.getItem('edubuddy_tasks');
    if (saved) {
      try {
        this.tasks = JSON.parse(saved);
      } catch (e) {
        this.tasks = [];
      }
    }

    if (!this.tasks || this.tasks.length === 0) {
      this.tasks = [
        { id: 1, time: "09:00 AM - 10:00 AM", subject: "Mathematics", task: "Calculus integration chapter exercises", done: true },
        { id: 2, time: "10:15 AM - 11:15 AM", subject: "Physics", task: "Newton's laws practice quiz & lab notes", done: false },
        { id: 3, time: "02:00 PM - 03:00 PM", subject: "Biology", task: "Cellular respiration flashcard review", done: false },
        { id: 4, time: "04:30 PM - 05:30 PM", subject: "Computer Science", task: "Implement recursive binary tree traversals", done: false }
      ];
      this.saveTasks();
    }
  },

  saveTasks() {
    localStorage.setItem('edubuddy_tasks', JSON.stringify(this.tasks));
  },

  setupListeners() {
    // Add task
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', () => this.handleAddTask());
    }

    // Schedule presets
    const presetBtns = document.querySelectorAll('.schedule-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-preset');
        this.applySchedulePreset(mode);
      });
    });

    // Pomodoro Controls
    const startPauseBtn = document.getElementById('pomodoro-start-pause-btn');
    const resetBtn = document.getElementById('pomodoro-reset-btn');
    const modeFocusBtn = document.getElementById('pomodoro-mode-focus');
    const modeBreakBtn = document.getElementById('pomodoro-mode-break');

    if (startPauseBtn) {
      startPauseBtn.addEventListener('click', () => this.togglePomodoro());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetPomodoro());
    }

    if (modeFocusBtn) {
      modeFocusBtn.addEventListener('click', () => this.setPomodoroMode('focus', 25));
    }

    if (modeBreakBtn) {
      modeBreakBtn.addEventListener('click', () => this.setPomodoroMode('break', 5));
    }
  },

  handleAddTask() {
    const timeInput = document.getElementById('task-time-input');
    const subjInput = document.getElementById('task-subject-input');
    const descInput = document.getElementById('task-desc-input');

    const time = timeInput ? timeInput.value.trim() : '';
    const subject = subjInput ? subjInput.value.trim() : 'General';
    const task = descInput ? descInput.value.trim() : '';

    if (!task) {
      EduBuddy.showNotification('Please enter a task description!', 'error');
      return;
    }

    const newTask = {
      id: Date.now(),
      time: time || "Flexible Time",
      subject: subject || "Study",
      task: task,
      done: false
    };

    this.tasks.push(newTask);
    this.saveTasks();
    this.renderTasks();

    if (descInput) descInput.value = '';
    EduBuddy.showNotification('Added study block to your schedule! 📅');
  },

  renderTasks() {
    const listContainer = document.getElementById('timetable-tasks-list');
    if (!listContainer) return;

    if (this.tasks.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No study blocks scheduled today. Click below to add one!
        </div>
      `;
      return;
    }

    listContainer.innerHTML = '';
    this.tasks.forEach(t => {
      const item = document.createElement('div');
      item.className = `task-item ${t.done ? 'completed' : ''}`;
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
          <input type="checkbox" ${t.done ? 'checked' : ''} style="cursor: pointer; width: 18px; height: 18px;">
          <div>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-main);">
              ${t.task}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; gap: 0.5rem; margin-top: 0.2rem;">
              <span>🕒 ${t.time}</span>
              <span class="tag-badge" style="font-size: 0.7rem; padding: 0.1rem 0.4rem;">${t.subject}</span>
            </div>
          </div>
        </div>
        <button class="icon-btn btn-sm" title="Delete Task" style="color: var(--danger); border-color: transparent;">
          ✕
        </button>
      `;

      // Checkbox toggle
      item.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
        t.done = e.target.checked;
        this.saveTasks();
        this.renderTasks();
        if (t.done) {
          EduBuddy.playTone('success');
          EduBuddy.incrementStat('studyMinutesToday', 15);
        }
      });

      // Delete button
      item.querySelector('button').addEventListener('click', () => {
        this.tasks = this.tasks.filter(x => x.id !== t.id);
        this.saveTasks();
        this.renderTasks();
      });

      listContainer.appendChild(item);
    });
  },

  applySchedulePreset(mode) {
    if (mode === 'crunch') {
      this.tasks = [
        { id: 1, time: "08:00 AM - 09:30 AM", subject: "Priority Exam Topic", task: "Review weak chapters & formulas", done: false },
        { id: 2, time: "10:00 AM - 12:00 PM", subject: "Mock Exam", task: "Timed practice exam under test conditions", done: false },
        { id: 3, time: "02:00 PM - 03:30 PM", subject: "Error Analysis", task: "Review every wrong answer and write corrections", done: false },
        { id: 4, time: "04:30 PM - 05:30 PM", subject: "Flashcards", task: "Active recall and spaced repetition drills", done: false }
      ];
    } else if (mode === 'balanced') {
      this.tasks = [
        { id: 1, time: "04:00 PM - 04:45 PM", subject: "STEM", task: "Homework problems and formula revision", done: false },
        { id: 2, time: "05:00 PM - 05:45 PM", subject: "Humanities", task: "Reading and essay outline preparation", done: false },
        { id: 3, time: "07:00 PM - 07:30 PM", subject: "Language/Vocab", task: "Quick flashcard drill and review", done: false }
      ];
    }
    this.saveTasks();
    this.renderTasks();
    EduBuddy.showNotification(`Loaded ${mode === 'crunch' ? 'Exam Crunch' : 'Balanced Weekday'} Schedule!`);
  },

  // Pomodoro Logic
  togglePomodoro() {
    const btn = document.getElementById('pomodoro-start-pause-btn');
    if (this.isTimerRunning) {
      clearInterval(this.timerInterval);
      this.isTimerRunning = false;
      if (btn) btn.textContent = 'Start Session ▶';
    } else {
      this.isTimerRunning = true;
      if (btn) btn.textContent = 'Pause ⏸';
      this.timerInterval = setInterval(() => {
        if (this.timeRemainingSecs > 0) {
          this.timeRemainingSecs--;
          this.updateTimerDisplay();
        } else {
          clearInterval(this.timerInterval);
          this.isTimerRunning = false;
          EduBuddy.playTone('beep');
          
          if (this.timerMode === 'focus') {
            EduBuddy.incrementStat('studyMinutesToday', 25);
            EduBuddy.showNotification('🎉 25-minute study focus interval completed! Time for a short break.');
            this.setPomodoroMode('break', 5);
          } else {
            EduBuddy.showNotification('☕ Break over! Ready to focus again?');
            this.setPomodoroMode('focus', 25);
          }
        }
      }, 1000);
    }
  },

  resetPomodoro() {
    clearInterval(this.timerInterval);
    this.isTimerRunning = false;
    this.timeRemainingSecs = (this.timerMode === 'focus' ? 25 : 5) * 60;
    this.updateTimerDisplay();
    const btn = document.getElementById('pomodoro-start-pause-btn');
    if (btn) btn.textContent = 'Start Session ▶';
  },

  setPomodoroMode(mode, mins) {
    this.timerMode = mode;
    clearInterval(this.timerInterval);
    this.isTimerRunning = false;
    this.timeRemainingSecs = mins * 60;
    this.updateTimerDisplay();

    const focusBtn = document.getElementById('pomodoro-mode-focus');
    const breakBtn = document.getElementById('pomodoro-mode-break');
    const startBtn = document.getElementById('pomodoro-start-pause-btn');

    if (focusBtn) focusBtn.classList.toggle('btn-primary', mode === 'focus');
    if (breakBtn) breakBtn.classList.toggle('btn-primary', mode === 'break');
    if (startBtn) startBtn.textContent = 'Start Session ▶';
  },

  updateTimerDisplay() {
    const timerDisplay = document.getElementById('pomodoro-timer-digits');
    if (!timerDisplay) return;

    const mins = Math.floor(this.timeRemainingSecs / 60);
    const secs = this.timeRemainingSecs % 60;
    timerDisplay.textContent = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
};
