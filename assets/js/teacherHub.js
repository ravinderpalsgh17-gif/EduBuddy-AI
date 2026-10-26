// EduBuddy AI - Bonus Feature: Teacher Hub
window.TeacherHub = {
  init() {
    this.setupListeners();
  },

  setupListeners() {
    const generateQuizBtn = document.getElementById('teacher-gen-quiz-btn');
    const generateRubricBtn = document.getElementById('teacher-gen-rubric-btn');
    const printBtn = document.getElementById('teacher-print-btn');

    if (generateQuizBtn) {
      generateQuizBtn.addEventListener('click', () => this.generateClassroomQuiz());
    }

    if (generateRubricBtn) {
      generateRubricBtn.addEventListener('click', () => this.generateAssignmentRubric());
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  },

  generateClassroomQuiz() {
    const grade = document.getElementById('teacher-grade-select')?.value || 'High School (Grades 9-12)';
    const topic = document.getElementById('teacher-topic-input')?.value.trim() || 'Photosynthesis and Plant Respiration';
    const qCount = parseInt(document.getElementById('teacher-count-select')?.value || '5', 10);

    const outputContainer = document.getElementById('teacher-output-box');
    
    outputContainer.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: var(--radius-md);">
        <div style="border-bottom: 2px solid var(--primary); padding-bottom: 0.75rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 800;">Classroom Quiz: ${topic}</h3>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Target Level: ${grade} | Total Questions: ${qCount}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print / Save as PDF</button>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--primary); margin-bottom: 0.75rem;">Student Worksheet (Part 1):</h4>
          <ol style="padding-left: 1.25rem; font-size: 0.95rem; line-height: 1.7;">
            <li style="margin-bottom: 1rem;">
              <strong>What is the primary role of chlorophyll in plant cells?</strong><br>
              A) Water absorption from roots<br>
              B) Capturing solar photon energy in thylakoid membranes<br>
              C) Transporting sugar to fruits<br>
              D) Structural rigidity of the stem
            </li>
            <li style="margin-bottom: 1rem;">
              <strong>Which gas is consumed during the Calvin Cycle to synthesize carbohydrate precursors?</strong><br>
              A) Oxygen (O2)<br>
              B) Nitrogen (N2)<br>
              C) Carbon Dioxide (CO2)<br>
              D) Methane (CH4)
            </li>
            <li style="margin-bottom: 1rem;">
              <strong>Explain in 2-3 sentences the biological relationship between photosynthesis and cellular respiration.</strong><br>
              <div style="border-bottom: 1px dotted var(--border-color); height: 28px; margin-top: 4px;"></div>
              <div style="border-bottom: 1px dotted var(--border-color); height: 28px;"></div>
            </li>
          </ol>
        </div>

        <div style="background: var(--bg-main); border: 1px dashed var(--border-color); padding: 1rem; border-radius: var(--radius-sm);">
          <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--success); text-transform: uppercase; margin-bottom: 0.5rem;">
            Teacher Answer Key & Grading Rubric (Part 2):
          </h4>
          <ul style="font-size: 0.88rem; line-height: 1.6; padding-left: 1.15rem;">
            <li><strong>Q1:</strong> B (Chlorophyll pigments absorb photons in thylakoids).</li>
            <li><strong>Q2:</strong> C (CO2 is fixed by RuBisCO in the stroma).</li>
            <li><strong>Q3:</strong> <em>Acceptable answers must note:</em> The chemical outputs of photosynthesis (glucose and O2) serve as direct inputs for cellular respiration in mitochondria, while respiration outputs (CO2 and H2O) are recycled back into photosynthesis.</li>
          </ul>
        </div>
      </div>
    `;

    EduBuddy.playTone('success');
    EduBuddy.showNotification('Generated ready-to-print classroom quiz! 🍎');
  },

  generateAssignmentRubric() {
    const title = document.getElementById('teacher-rubric-title')?.value.trim() || 'Science Research Essay';
    const outputContainer = document.getElementById('teacher-output-box');

    outputContainer.innerHTML = `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: var(--radius-md);">
        <div style="border-bottom: 2px solid var(--primary); padding-bottom: 0.75rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 800;">4-Tier Grading Rubric: ${title}</h3>
            <span style="font-size: 0.85rem; color: var(--text-muted);">Standardized Academic Assessment Framework</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Rubric</button>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="background: var(--bg-main); border-bottom: 2px solid var(--border-color);">
                <th style="padding: 0.75rem;">Criteria</th>
                <th style="padding: 0.75rem; color: var(--success);">Exemplary (4 pts)</th>
                <th style="padding: 0.75rem; color: var(--primary);">Proficient (3 pts)</th>
                <th style="padding: 0.75rem; color: var(--warning);">Developing (2 pts)</th>
                <th style="padding: 0.75rem; color: var(--danger);">Beginning (1 pt)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem; font-weight: 700;">Conceptual Accuracy</td>
                <td style="padding: 0.75rem;">Flawless understanding of core principles, no scientific or logical errors.</td>
                <td style="padding: 0.75rem;">Minor inaccuracies that do not compromise overarching thesis.</td>
                <td style="padding: 0.75rem;">Noticeable misconceptions in foundational concepts.</td>
                <td style="padding: 0.75rem;">Major conceptual errors throughout.</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 0.75rem; font-weight: 700;">Evidence & Citations</td>
                <td style="padding: 0.75rem;">Integrates 4+ peer-reviewed sources with proper academic citation format.</td>
                <td style="padding: 0.75rem;">Includes 2-3 credible sources; citations mostly consistent.</td>
                <td style="padding: 0.75rem;">Minimal citation or reliance on unverified internet claims.</td>
                <td style="padding: 0.75rem;">No citations or evidence provided.</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; font-weight: 700;">Structure & Clarity</td>
                <td style="padding: 0.75rem;">Cohesive transitions, flawless grammar, compelling academic voice.</td>
                <td style="padding: 0.75rem;">Clear organization with rare mechanical or typographical errors.</td>
                <td style="padding: 0.75rem;">Disorganized paragraphs and frequent grammatical distractions.</td>
                <td style="padding: 0.75rem;">Incoherent structure and difficult to comprehend.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    EduBuddy.playTone('success');
    EduBuddy.showNotification('Generated assignment grading rubric! 📋');
  }
};
