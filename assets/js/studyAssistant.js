// EduBuddy AI - Feature 1: AI Study Assistant
window.StudyAssistant = {
  chatHistory: [],

  // Offline curated explanations for instant, zero-latency learning
  knowledgeBase: {
    "quantum superposition": {
      subject: "Physics",
      explanation: "Quantum superposition is the principle that a physical system, like an electron or photon, can exist in a combination of multiple states simultaneously until it is observed or measured.",
      step_by_step: [
        "1. Classical states are binary: A coin on a table is either definitely Heads or Tails.",
        "2. The Quantum Wavefunction: In quantum mechanics, particles are described by mathematical wavefunctions representing probabilities of states.",
        "3. Coexistence: Before a measurement forces the system into one definitive state, all potential outcomes interfere with each other.",
        "4. Wavefunction Collapse: Observing or measuring the particle forces it into a single deterministic eigenstate."
      ],
      analogy: "Imagine a spinning coin on a table. While it's spinning, it is a blur of both heads and tails at once. It only 'picks' one definitive side when you slap your hand down to stop it.",
      key_takeaway: "Particles can hold multiple possibilities at once until measurement forces an outcome.",
      followups: ["What is Schrödinger's Cat?", "How do quantum computers use qubits in superposition?", "What causes quantum decoherence?"]
    },
    "photosynthesis": {
      subject: "Biology",
      explanation: "Photosynthesis is the biochemical process by which green plants, algae, and cyanobacteria convert sunlight, carbon dioxide, and water into chemical energy stored in glucose, releasing oxygen as a byproduct.",
      step_by_step: [
        "1. Light Absorption: Chlorophyll in the chloroplast thylakoids captures photons from sunlight.",
        "2. Light-Dependent Reactions: Water molecules (H2O) are split into oxygen (released into air), protons, and ATP/NADPH energy carriers.",
        "3. The Calvin Cycle (Light-Independent): In the stroma, ATP and NADPH power the fixation of carbon dioxide (CO2) into 3-carbon sugar precursors.",
        "4. Glucose Synthesis: Precursors assemble into glucose (C6H12O6) used for plant growth and metabolic storage."
      ],
      analogy: "Think of chloroplasts as microscopic solar-powered bakeries. Sunlight provides electricity, CO2 and water are raw flour and sugar, and the baked bread is glucose.",
      key_takeaway: "6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2",
      followups: ["Why are leaves green instead of black?", "What happens to photosynthesis at night?", "How does cellular respiration relate to photosynthesis?"]
    },
    "calculus derivatives": {
      subject: "Mathematics",
      explanation: "A derivative measures the instantaneous rate of change of a function with respect to one of its variables — geometrically, the slope of the tangent line to the curve at any single point.",
      step_by_step: [
        "1. Average Rate vs Instantaneous: Calculating speed over 2 hours is average speed; checking your speedometer at an exact millisecond is the derivative.",
        "2. Secant to Tangent: As the interval Δx shrinks toward 0 (limit), the secant line between two points approaches the tangent line at one point.",
        "3. Power Rule: If f(x) = x^n, then the derivative f'(x) = n · x^(n-1).",
        "4. Physical Interpretation: Position → Derivative = Velocity; Velocity → Derivative = Acceleration."
      ],
      analogy: "If a function is a video of a road trip, the derivative is taking a freeze-frame photograph and looking at the speedometer reading.",
      key_takeaway: "Derivatives turn continuous motion into instantaneous rates of change.",
      followups: ["What is the difference between derivative and integral?", "How do we find local maximums using derivatives?", "Can you explain the product rule with an example?"]
    },
    "recursion": {
      subject: "Computer Science",
      explanation: "Recursion is a programming and mathematical problem-solving technique where a function solves a problem by calling a smaller instance of itself until reaching a terminating base case.",
      step_by_step: [
        "1. The Base Case: The stopping condition that returns a value directly without making further calls.",
        "2. The Recursive Step: Reducing the current problem into smaller sub-problems and invoking itself.",
        "3. The Call Stack: Each recursive call pauses and pushes a new frame onto the execution stack.",
        "4. Unwinding: Once the base case returns, values bubble back up the stack to construct the final solution."
      ],
      analogy: "Like Russian nesting dolls (Matryoshka): you open each doll to find a slightly smaller doll inside, until you hit the tiny solid wooden doll (the base case) that cannot be opened.",
      key_takeaway: "Every recursive algorithm requires a base case to prevent infinite loops (stack overflow).",
      followups: ["What is stack overflow and how do we prevent it?", "When is iteration better than recursion?", "How does divide-and-conquer use recursion?"]
    }
  },

  init() {
    this.setupListeners();
  },

  setupListeners() {
    const askBtn = document.getElementById('ask-tutor-btn');
    const inputEl = document.getElementById('tutor-question-input');
    const presetBtns = document.querySelectorAll('.tutor-preset-chip');

    if (askBtn && inputEl) {
      askBtn.addEventListener('click', () => this.handleUserQuestion());
      inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleUserQuestion();
      });
    }

    presetBtns.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        const subject = chip.getAttribute('data-subject') || 'General';
        const subjSelect = document.getElementById('tutor-subject-select');
        if (subjSelect) subjSelect.value = subject;
        if (inputEl) {
          inputEl.value = query;
          this.handleUserQuestion();
        }
      });
    });
  },

  async handleUserQuestion() {
    const inputEl = document.getElementById('tutor-question-input');
    const query = inputEl ? inputEl.value.trim() : '';
    if (!query) return;

    const subject = document.getElementById('tutor-subject-select')?.value || 'General';
    const level = document.getElementById('tutor-level-select')?.value || 'High School';

    // Append user message
    this.appendMessage('user', query);
    inputEl.value = '';

    // Show loading assistant indicator
    const loadingId = this.showLoadingIndicator();

    try {
      let responseData = null;

      // 1. Check if Gemini API Key is configured for live AI
      const apiKey = EduBuddy.state.geminiApiKey;
      if (apiKey) {
        responseData = await this.callGeminiApi(query, subject, level, apiKey);
      }

      // 2. Fallback to knowledge base / smart heuristics
      if (!responseData) {
        responseData = this.getSmartOfflineExplanation(query, subject, level);
      }

      this.removeLoadingIndicator(loadingId);
      this.renderAssistantResponse(responseData);
      EduBuddy.incrementStat('studyMinutesToday', 5);
      EduBuddy.playTone('success');
    } catch (err) {
      this.removeLoadingIndicator(loadingId);
      this.renderAssistantResponse(this.getSmartOfflineExplanation(query, subject, level));
    }
  },

  async callGeminiApi(question, subject, level, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `You are EduBuddy AI, an empathetic, encouraging, and brilliant study tutor.
Subject: ${subject}
Level: ${level}
Student question: ${question}

Provide your response in raw valid JSON format without markdown code fences:
{
  "explanation": "Clear, friendly, conversational explanation tailored to the requested grade/level",
  "step_by_step": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "analogy": "A relatable real-world analogy",
  "key_takeaway": "One sentence key takeaway formula or concept",
  "followups": ["Question 1", "Question 2", "Question 3"]
}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7 }
      })
    });

    if (!res.ok) throw new Error("API call failed");
    const json = await res.json();
    let text = json.candidates[0].content.parts[0].text.trim();
    if (text.startsWith("```json")) text = text.replace(/^```json\s*/, '');
    if (text.endsWith("```")) text = text.replace(/\s*```$/, '');
    return JSON.parse(text);
  },

  getSmartOfflineExplanation(query, subject, level) {
    const qLower = query.toLowerCase();

    // Match in knowledgeBase
    for (const [key, data] of Object.entries(this.knowledgeBase)) {
      if (qLower.includes(key)) {
        return data;
      }
    }

    // Heuristic generator
    return {
      subject: subject,
      explanation: `Great question regarding **${query}**! In ${subject}, understanding this begins by identifying the core components, their interrelationships, and how they apply in exam problem-solving.`,
      step_by_step: [
        `1. Fundamental Definition: Define the core terms and scope of "${query}".`,
        `2. Underlying Mechanism: Examine how inputs, equations, or causes produce the observed effects.`,
        `3. Real-world Context: Test this concept against concrete scenarios and problem sets.`,
        `4. Synthesis: Connect this back to your overarching ${subject} syllabus.`
      ],
      analogy: `Think of learning "${query}" like assembling a high-performance bicycle: each gear and linkage must be understood individually before you can ride smoothly.`,
      key_takeaway: `Master the vocabulary and basic rules of ${query} before moving on to multi-variable applications.`,
      followups: [
        `Can you give me a step-by-step example problem on ${query}?`,
        `What are the most common mistakes students make with ${query}?`,
        `How is ${query} tested on final exams?`
      ]
    };
  },

  appendMessage(role, text) {
    const history = document.getElementById('tutor-chat-history');
    if (!history) return;

    const msg = document.createElement('div');
    msg.className = `chat-msg ${role}`;
    msg.innerHTML = `
      <div class="chat-bubble">
        <strong>${role === 'user' ? 'You' : 'EduBuddy AI'}:</strong><br>
        ${this.escapeHtml(text)}
      </div>
    `;
    history.appendChild(msg);
    history.scrollTop = history.scrollHeight;
  },

  renderAssistantResponse(data) {
    const history = document.getElementById('tutor-chat-history');
    if (!history) return;

    const msg = document.createElement('div');
    msg.className = `chat-msg assistant`;

    let stepsHtml = (data.step_by_step || []).map(s => `
      <div class="step-card">${this.escapeHtml(s)}</div>
    `).join('');

    let followupsHtml = (data.followups || []).map(f => `
      <button class="btn btn-secondary btn-sm" onclick="document.getElementById('tutor-question-input').value='${this.escapeAttr(f)}'; window.StudyAssistant.handleUserQuestion();" style="margin-right: 0.35rem; margin-top: 0.4rem;">
        💡 ${this.escapeHtml(f)}
      </button>
    `).join('');

    msg.innerHTML = `
      <div class="chat-bubble">
        <div style="font-weight: 700; color: var(--primary); margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
          <span>🤖 EduBuddy AI Tutor (${data.subject || 'Study Assistant'})</span>
          <span class="tag-badge">Step-by-Step</span>
        </div>
        <p style="margin-bottom: 0.75rem;">${this.escapeHtml(data.explanation)}</p>
        
        <div style="font-weight: 600; font-size: 0.85rem; margin: 0.75rem 0 0.25rem;">🔍 Step-by-Step Breakdown:</div>
        ${stepsHtml}

        ${data.analogy ? `
          <div class="analogy-box">
            <strong>💡 Helpful Analogy:</strong> ${this.escapeHtml(data.analogy)}
          </div>
        ` : ''}

        ${data.key_takeaway ? `
          <div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid var(--success); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); margin-top: 0.75rem; font-size: 0.88rem;">
            <strong>🎯 Key Takeaway:</strong> ${this.escapeHtml(data.key_takeaway)}
          </div>
        ` : ''}

        ${followupsHtml ? `
          <div style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
            <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Suggested Next Steps:</div>
            ${followupsHtml}
          </div>
        ` : ''}
      </div>
    `;

    history.appendChild(msg);
    history.scrollTop = history.scrollHeight;
  },

  showLoadingIndicator() {
    const history = document.getElementById('tutor-chat-history');
    const id = 'loading-' + Date.now();
    const msg = document.createElement('div');
    msg.id = id;
    msg.className = 'chat-msg assistant';
    msg.innerHTML = `
      <div class="chat-bubble" style="font-style: italic; color: var(--text-muted);">
        🤖 EduBuddy is structuring a step-by-step breakdown...
      </div>
    `;
    history.appendChild(msg);
    history.scrollTop = history.scrollHeight;
    return id;
  },

  removeLoadingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  },

  escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);
  },

  escapeAttr(str) {
    return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }
};
