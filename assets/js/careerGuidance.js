// EduBuddy AI - Feature 5: Career Guidance & Pathways
window.CareerGuidance = {
  careerProfiles: [
    {
      id: "ai-engineer",
      title: "AI & Machine Learning Engineer",
      category: "Computer Science & Engineering",
      matchScore: 96,
      salary: "$120,000 - $175,000",
      outlook: "🚀 +38% growth over the next decade (Extremely High)",
      summary: "Designs and trains artificial intelligence algorithms, deep neural networks, and generative models that power autonomous vehicles, language processing, and medical diagnostics.",
      highSchoolFocus: ["AP/IB Calculus", "Computer Science Principles", "Physics", "Statistics"],
      collegeDegrees: ["B.S. in Computer Science", "Data Science & AI", "Computer Engineering"],
      essentialSkills: ["Python", "PyTorch / TensorFlow", "Linear Algebra", "Data Structures", "Model Evaluation"],
      firstProjects: [
        "Train an image classification model using Kaggle open datasets",
        "Build a fine-tuned domain chatbot with LLM APIs"
      ]
    },
    {
      id: "biomedical-engineer",
      title: "Biomedical & Neural Engineer",
      category: "Healthcare & Life Sciences",
      matchScore: 92,
      salary: "$95,000 - $140,000",
      outlook: "📈 +12% steady growth with expanding biotechnology investments",
      summary: "Bridges engineering principles with medical sciences to design artificial organs, neural prosthetics, advanced medical imaging devices, and biomaterials.",
      highSchoolFocus: ["AP Biology", "AP Chemistry", "Pre-Calculus / Calculus", "Physics"],
      collegeDegrees: ["B.S. in Biomedical Engineering", "Bioengineering", "Biotechnology"],
      essentialSkills: ["Biocompatible Materials", "CAD / SolidWorks", "Bioinstrumentation", "Organic Chemistry", "Biomechanics"],
      firstProjects: [
        "3D print an assistive prosthetic hand using open-source e-NABLE designs",
        "Analyze physiological ECG signals using MATLAB or Python"
      ]
    },
    {
      id: "data-scientist-fintech",
      title: "Quantitative Analyst & Financial Data Scientist",
      category: "Business & Mathematics",
      matchScore: 89,
      salary: "$110,000 - $165,000",
      outlook: "📊 +28% surging growth in algorithmic finance and fintech",
      summary: "Uses mathematical models, stochastic calculus, and machine learning to analyze financial markets, forecast risk, and engineer algorithmic trading systems.",
      highSchoolFocus: ["AP Statistics", "AP Calculus BC", "Economics", "Computer Science"],
      collegeDegrees: ["B.S. in Financial Engineering", "Applied Mathematics", "Economics & CS"],
      essentialSkills: ["Stochastic Modeling", "Python & SQL", "Time Series Forecasting", "Financial Derivatives", "Econometrics"],
      firstProjects: [
        "Backtest a moving average algorithmic trading strategy on historical equities",
        "Build a personal portfolio risk optimizer dashboard"
      ]
    },
    {
      id: "renewable-energy",
      title: "Renewable Energy & Grid Systems Engineer",
      category: "Environmental & Sustainability",
      matchScore: 87,
      salary: "$88,000 - $130,000",
      outlook: "🌱 +32% exponential growth driven by the global clean energy transition",
      summary: "Designs solar photovoltaic fields, wind turbine mechanics, battery energy storage systems, and resilient smart electrical power grids.",
      highSchoolFocus: ["Physics", "Calculus", "Environmental Science", "Chemistry"],
      collegeDegrees: ["B.S. in Electrical Engineering", "Mechanical Engineering", "Renewable Energy Systems"],
      essentialSkills: ["Power Electronics", "Thermodynamics", "Smart Grid Protocols", "Battery Chemistry", "Environmental Lifecycle Assessment"],
      firstProjects: [
        "Design a solar micro-inverter circuit schematic in KiCAD",
        "Model residential solar payback periods and energy efficiency in Python"
      ]
    },
    {
      id: "product-designer",
      title: "Product Designer & UX Architect",
      category: "Design & Technology",
      matchScore: 85,
      salary: "$85,000 - $135,000",
      outlook: "✨ +16% sustained demand across consumer tech, SaaS, and gaming",
      summary: "Shapes how humans interact with digital products, conducting user research, wireframing interaction flows, and crafting beautiful design systems.",
      highSchoolFocus: ["Graphic Design / Visual Arts", "Psychology", "Computer Science", "English / Communications"],
      collegeDegrees: ["B.S./B.A. in Human-Computer Interaction (HCI)", "Design & Media Arts", "Cognitive Science"],
      essentialSkills: ["Figma / Design Systems", "User Research & Usability Testing", "Information Architecture", "HTML/CSS Basics", "Rapid Prototyping"],
      firstProjects: [
        "Redesign a clunky educational app interface and publish a case study on Behance/Figma",
        "Conduct a 5-person usability interview session for an open-source tool"
      ]
    }
  ],

  init() {
    this.renderCareerCards(this.careerProfiles);
    this.setupListeners();
  },

  setupListeners() {
    const filterSelect = document.getElementById('career-category-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'all') {
          this.renderCareerCards(this.careerProfiles);
        } else {
          const filtered = this.careerProfiles.filter(c => c.category.toLowerCase().includes(val.toLowerCase()));
          this.renderCareerCards(filtered);
        }
      });
    }

    const quizSubmitBtn = document.getElementById('submit-career-quiz-btn');
    if (quizSubmitBtn) {
      quizSubmitBtn.addEventListener('click', () => this.evaluateCareerQuiz());
    }
  },

  renderCareerCards(profiles) {
    const container = document.getElementById('careers-grid-container');
    if (!container) return;

    container.innerHTML = '';
    profiles.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card career-card';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.2rem;">
              ${p.category}
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main);">
              ${p.title}
            </h3>
          </div>
          <div style="background: rgba(79, 70, 229, 0.1); color: var(--primary); font-weight: 800; font-size: 0.85rem; padding: 0.25rem 0.65rem; border-radius: 9999px;">
            Match: ${p.matchScore}%
          </div>
        </div>

        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.55; margin-bottom: 1rem;">
          ${p.summary}
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: var(--bg-main); padding: 0.85rem; border-radius: var(--radius-sm); margin-bottom: 1rem; font-size: 0.85rem;">
          <div><strong>💰 Entry Salary:</strong><br><span style="color: var(--success); font-weight: 700;">${p.salary}</span></div>
          <div><strong>📈 10-Yr Outlook:</strong><br>${p.outlook}</div>
        </div>

        <div style="margin-bottom: 0.75rem;">
          <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.35rem;">
            🏫 High School Subjects to Prioritize:
          </div>
          <div>
            ${p.highSchoolFocus.map(sub => `<span class="tag-badge">${sub}</span>`).join('')}
          </div>
        </div>

        <div style="margin-bottom: 0.75rem;">
          <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.35rem;">
            🎓 Recommended College Degrees:
          </div>
          <div>
            ${p.collegeDegrees.map(deg => `<span class="tag-badge" style="background: rgba(6, 182, 212, 0.1); color: var(--secondary);">${deg}</span>`).join('')}
          </div>
        </div>

        <div style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
          <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.35rem;">
            🚀 Starter Projects for Your Resume:
          </div>
          <ul style="font-size: 0.85rem; padding-left: 1.15rem; color: var(--text-main);">
            ${p.firstProjects.map(proj => `<li style="margin-bottom: 0.25rem;">${proj}</li>`).join('')}
          </ul>
        </div>
      `;
      container.appendChild(card);
    });
  },

  evaluateCareerQuiz() {
    const q1 = document.querySelector('input[name="career_q1"]:checked')?.value || 'stem';
    const q2 = document.querySelector('input[name="career_q2"]:checked')?.value || 'logic';

    // Boost scores based on student answers
    const scores = {
      "ai-engineer": 85 + (q1 === 'stem' ? 10 : 0) + (q2 === 'logic' ? 5 : 0),
      "biomedical-engineer": 80 + (q1 === 'life' ? 15 : 0) + (q2 === 'hands' ? 5 : 0),
      "data-scientist-fintech": 80 + (q1 === 'business' ? 15 : 0) + (q2 === 'logic' ? 5 : 0),
      "renewable-energy": 78 + (q1 === 'stem' ? 10 : 0) + (q2 === 'hands' ? 10 : 0),
      "product-designer": 75 + (q1 === 'arts' ? 20 : 0) + (q2 === 'creative' ? 10 : 0)
    };

    const reordered = [...this.careerProfiles].map(p => ({
      ...p,
      matchScore: Math.min(99, scores[p.id] || p.matchScore)
    })).sort((a, b) => b.matchScore - a.matchScore);

    this.renderCareerCards(reordered);
    EduBuddy.playTone('success');
    EduBuddy.showNotification(`Top Match: ${reordered[0].title} (${reordered[0].matchScore}% Fit)! 🎯`);

    const resultBox = document.getElementById('career-quiz-results-banner');
    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 1.25rem 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
          <h4 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 0.35rem;">
            🎉 Recommended Career Path: ${reordered[0].title}
          </h4>
          <p style="font-size: 0.92rem; opacity: 0.95;">
            Based on your answers, your profile shows a <strong>${reordered[0].matchScore}% match</strong>. Check out the roadmap below for high school electives and portfolio projects!
          </p>
        </div>
      `;
    }
  }
};
