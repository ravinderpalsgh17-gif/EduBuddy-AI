// EduBuddy AI - Main Application Core
const EduBuddy = {
  state: {
    theme: localStorage.getItem('edubuddy_theme') || 'light',
    geminiApiKey: localStorage.getItem('edubuddy_gemini_key') || '',
    activeTab: 'dashboard',
    stats: {
      studyStreak: parseInt(localStorage.getItem('edubuddy_streak') || '3', 10),
      quizzesTaken: parseInt(localStorage.getItem('edubuddy_quizzes') || '8', 10),
      notesSummarized: parseInt(localStorage.getItem('edubuddy_notes') || '5', 10),
      studyMinutesToday: parseInt(localStorage.getItem('edubuddy_minutes') || '45', 10)
    }
  },

  init() {
    this.applyTheme(this.state.theme);
    this.setupNavigation();
    this.setupThemeToggle();
    this.setupSettingsModal();
    this.updateStatsDisplay();

    // Initialize modules
    if (window.StudyAssistant) window.StudyAssistant.init();
    if (window.ExamPrep) window.ExamPrep.init();
    if (window.SmartNotes) window.SmartNotes.init();
    if (window.StudyTimetable) window.StudyTimetable.init();
    if (window.CareerGuidance) window.CareerGuidance.init();
    if (window.TeacherHub) window.TeacherHub.init();
  },

  setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });

    // Feature card click routing
    document.querySelectorAll('[data-route]').forEach(card => {
      card.addEventListener('click', () => {
        const target = card.getAttribute('data-route');
        this.switchTab(target);
      });
    });
  },

  switchTab(tabId) {
    this.state.activeTab = tabId;
    
    // Update nav buttons
    document.querySelectorAll('.nav-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setupThemeToggle() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const nextTheme = this.state.theme === 'light' ? 'dark' : 'light';
      this.applyTheme(nextTheme);
    });
  },

  applyTheme(theme) {
    this.state.theme = theme;
    localStorage.setItem('edubuddy_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  },

  setupSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('open-settings-btn');
    const closeBtn = document.getElementById('close-settings-btn');
    const saveBtn = document.getElementById('save-settings-btn');
    const apiKeyInput = document.getElementById('gemini-api-key-input');

    if (apiKeyInput) {
      apiKeyInput.value = this.state.geminiApiKey;
    }

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        if (apiKeyInput) apiKeyInput.value = this.state.geminiApiKey;
        modal.classList.add('open');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.state.geminiApiKey = apiKeyInput.value.trim();
        localStorage.setItem('edubuddy_gemini_key', this.state.geminiApiKey);
        modal.classList.remove('open');
        this.showNotification('API Settings saved successfully! ✨');
      });
    }

    // Close on backdrop click
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    }
  },

  updateStatsDisplay() {
    const streakEl = document.getElementById('stat-streak');
    const quizEl = document.getElementById('stat-quizzes');
    const notesEl = document.getElementById('stat-notes');
    const timeEl = document.getElementById('stat-time');

    if (streakEl) streakEl.textContent = `${this.state.stats.studyStreak} Days`;
    if (quizEl) quizEl.textContent = this.state.stats.quizzesTaken;
    if (notesEl) notesEl.textContent = this.state.stats.notesSummarized;
    if (timeEl) timeEl.textContent = `${this.state.stats.studyMinutesToday}m`;
  },

  incrementStat(key, amount = 1) {
    if (this.state.stats[key] !== undefined) {
      this.state.stats[key] += amount;
      localStorage.setItem(`edubuddy_${key}`, this.state.stats[key]);
      this.updateStatsDisplay();
    }
  },

  // Audio tone generator using HTML5 Web Audio API (Zero external audio files needed!)
  playTone(type = 'success') {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'beep') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } else if (type === 'error') {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(160, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  },

  showNotification(message, type = 'info') {
    const existing = document.querySelector('.edubuddy-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `edubuddy-toast`;
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--bg-card);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      border-left: 5px solid var(--primary);
      padding: 0.85rem 1.25rem;
      border-radius: var(--radius-md);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2);
      z-index: 9999;
      font-size: 0.9rem;
      font-weight: 600;
      animation: fadeIn 0.25s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }
};

window.addEventListener('DOMContentLoaded', () => EduBuddy.init());
