// EduBuddy AI - Feature 3: Smart Notes
window.SmartNotes = {
  samples: {
    "biology": {
      title: "Cell Membrane & Transport Mechanisms",
      text: `The cell membrane, also termed the plasma membrane, is a selectively permeable phospholipid bilayer embedded with proteins, cholesterol, and carbohydrates according to the Fluid Mosaic Model. Phospholipids have hydrophilic (water-attracting) phosphate heads and hydrophobic (water-repelling) fatty acid tails, arranging tail-to-tail in an aqueous cellular environment. Passive transport allows substances like oxygen, carbon dioxide, and water (via aquaporins) to move down their concentration gradients without cellular energy expenditure (ATP). Simple diffusion applies to small, nonpolar molecules, while facilitated diffusion relies on channel or carrier proteins like GLUT glucose transporters. In contrast, active transport pumps ions against their electrochemical gradients using ATP energy, exemplified by the Sodium-Potassium pump (Na+/K+ ATPase), which exports 3 Na+ ions and imports 2 K+ ions per cycle, maintaining cell resting membrane potential and osmotic balance.`
    },
    "history": {
      title: "The Industrial Revolution & Socio-Economic Shift",
      text: `Beginning in Great Britain during the mid-18th century, the Industrial Revolution marked a profound transformation from agrarian, handcrafted economies to mechanized manufacturing powered by steam and fossil fuels. Key inventions included James Watt's refined steam engine, James Hargreaves' spinning jenny, and Richard Arkwright's water frame. The advent of steam locomotives and rail networks revolutionized trade logistics and human mobility. Demographically, millions migrated from rural countryside into rapidly growing industrial urban hubs like Manchester and Birmingham, fostering urban overcrowding, sanitation challenges, and child labor controversies. These social pressures spurred labor union formation, parliamentary safety reforms (such as the British Factory Acts), and the emergence of modern economic theories including Adam Smith's capitalism and Karl Marx's critique of industrial wage labor.`
    },
    "cs": {
      title: "Foundations of Artificial Intelligence & Machine Learning",
      text: `Artificial Intelligence (AI) refers to computer systems designed to emulate human cognitive tasks such as visual perception, natural language understanding, reasoning, and autonomous decision making. Machine Learning (ML), a core subfield of AI, focuses on developing statistical models and algorithms that learn patterns from empirical training datasets without explicit rule programming. Supervised learning utilizes ground-truth labeled training data to perform classification (predicting discrete categories) and regression (predicting continuous numerical quantities). Common algorithms include Linear Regression, Support Vector Machines, Random Forests, and Deep Artificial Neural Networks. Unsupervised learning identifies latent structures and clusters in unlabeled data using methods like K-Means clustering and Principal Component Analysis (PCA). Reinforcement learning trains autonomous software agents to optimize cumulative rewards through iterative trial-and-error environmental interactions.`
    }
  },

  init() {
    this.setupListeners();
  },

  setupListeners() {
    const summarizeBtn = document.getElementById('summarize-notes-btn');
    const loadSampleBtns = document.querySelectorAll('.load-note-sample-btn');
    const exportBtn = document.getElementById('export-notes-btn');

    if (summarizeBtn) {
      summarizeBtn.addEventListener('click', () => this.handleSummarize());
    }

    loadSampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-sample');
        const sample = this.samples[key];
        if (sample) {
          const titleInput = document.getElementById('note-title-input');
          const textInput = document.getElementById('note-raw-textarea');
          if (titleInput) titleInput.value = sample.title;
          if (textInput) textInput.value = sample.text;
          EduBuddy.showNotification(`Loaded sample: ${sample.title}`);
        }
      });
    });

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportCurrentSummary());
    }
  },

  async handleSummarize() {
    const title = document.getElementById('note-title-input')?.value.trim() || 'Study Notes';
    const rawText = document.getElementById('note-raw-textarea')?.value.trim() || '';

    if (!rawText) {
      EduBuddy.showNotification('Please paste or type study notes first!', 'error');
      return;
    }

    const outputContainer = document.getElementById('smart-notes-output');
    outputContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        ✨ EduBuddy is analyzing the text, identifying key concepts, and formatting smart bullet points...
      </div>
    `;

    try {
      let data = null;
      if (EduBuddy.state.geminiApiKey) {
        data = await this.summarizeWithGemini(title, rawText, EduBuddy.state.geminiApiKey);
      }

      if (!data) {
        data = this.summarizeLocally(title, rawText);
      }

      this.renderSummary(data);
      EduBuddy.incrementStat('notesSummarized', 1);
      EduBuddy.playTone('success');
    } catch (e) {
      this.renderSummary(this.summarizeLocally(title, rawText));
    }
  },

  async summarizeWithGemini(title, text, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `You are EduBuddy Smart Notes Engine. Summarize the following study material.
Title: ${title}
Text:
${text}

Respond in pure valid JSON without markdown fences:
{
  "title": "${title}",
  "executive_summary": "Concise 2-3 sentence overview",
  "key_points": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "glossary": [
    {"term": "Term 1", "definition": "Short crisp definition"}
  ],
  "high_yield_exam_tips": ["Exam tip 1", "Exam tip 2"]
}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!res.ok) throw new Error("API call failed");
    const json = await res.json();
    let resText = json.candidates[0].content.parts[0].text.trim();
    if (resText.startsWith("```json")) resText = resText.replace(/^```json\s*/, '');
    if (resText.endsWith("```")) resText = resText.replace(/\s*```$/, '');
    return JSON.parse(resText);
  },

  summarizeLocally(title, text) {
    // Sentence extraction & basic token frequency
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const cleanSentences = sentences.map(s => s.trim()).filter(s => s.length > 20);

    const execSummary = cleanSentences.slice(0, 2).join(' ') || text.slice(0, 200);

    const keyPoints = cleanSentences.slice(1, 5).map(s => s.replace(/^[a-z]/, m => m.toUpperCase()));

    // Extract potential bold/capital terms
    const terms = [];
    const wordMatches = text.match(/\b[A-Z][a-zA-Z0-9-]+\b/g) || [];
    const uniqueWords = [...new Set(wordMatches)].filter(w => !['The', 'This', 'In', 'And', 'For', 'With', 'Under', 'By'].includes(w));

    uniqueWords.slice(0, 4).forEach(w => {
      terms.push({
        term: w,
        definition: `Crucial subject terminology highlighted in the lecture material regarding ${w}.`
      });
    });

    return {
      title,
      executive_summary: execSummary,
      key_points: keyPoints.length > 0 ? keyPoints : [
        "Core thesis: Primary concepts clearly established in notes.",
        "System mechanics: Key causal relationships identified.",
        "Examination relevance: Crucial definitions to commit to memory."
      ],
      glossary: terms,
      high_yield_exam_tips: [
        "Be ready to contrast this concept with adjacent topics on short-answer questions.",
        "Memorize specific equations, dates, and terminology verbatim for multiple choice tests."
      ]
    };
  },

  renderSummary(data) {
    const outputContainer = document.getElementById('smart-notes-output');
    this.lastSummary = data;

    const pointsHtml = (data.key_points || []).map(p => `
      <li style="margin-bottom: 0.5rem; line-height: 1.5;">${p}</li>
    `).join('');

    const glossaryHtml = (data.glossary || []).map(g => `
      <div style="background: var(--bg-main); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-bottom: 0.5rem;">
        <span style="font-weight: 700; color: var(--primary);">${g.term}:</span>
        <span style="color: var(--text-main); font-size: 0.9rem;"> ${g.definition}</span>
      </div>
    `).join('');

    const tipsHtml = (data.high_yield_exam_tips || []).map(t => `
      <div style="display: flex; gap: 0.5rem; align-items: flex-start; margin-bottom: 0.4rem; font-size: 0.88rem;">
        <span>🎯</span>
        <span>${t}</span>
      </div>
    `).join('');

    outputContainer.innerHTML = `
      <div class="card" style="margin-bottom: 0;">
        <div class="card-header">
          <div class="card-title">
            <span>📝</span> ${data.title}
          </div>
          <button class="btn btn-secondary btn-sm" id="export-notes-btn">
            📥 Export / Download Markdown
          </button>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.4rem;">
            ⚡ Executive Summary
          </h4>
          <p style="line-height: 1.6; font-size: 0.95rem; background: var(--bg-main); padding: 1rem; border-radius: var(--radius-sm); border-left: 4px solid var(--primary);">
            ${data.executive_summary}
          </p>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.4rem;">
            📌 Core Study Points
          </h4>
          <ul style="padding-left: 1.25rem; font-size: 0.92rem;">
            ${pointsHtml}
          </ul>
        </div>

        ${data.glossary && data.glossary.length > 0 ? `
          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.4rem;">
              📖 Key Terms & Definitions
            </h4>
            ${glossaryHtml}
          </div>
        ` : ''}

        ${data.high_yield_exam_tips && data.high_yield_exam_tips.length > 0 ? `
          <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid var(--warning); border-radius: var(--radius-sm); padding: 1rem;">
            <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--warning); text-transform: uppercase; margin-bottom: 0.5rem;">
              ⚠️ High-Yield Exam Traps & Tips
            </h4>
            ${tipsHtml}
          </div>
        ` : ''}
      </div>
    `;

    document.getElementById('export-notes-btn').addEventListener('click', () => this.exportCurrentSummary());
  },

  exportCurrentSummary() {
    if (!this.lastSummary) {
      EduBuddy.showNotification('Generate a summary first before exporting!', 'error');
      return;
    }

    const s = this.lastSummary;
    let md = `# ${s.title}\n*Generated by EduBuddy AI - Smart Notes*\n\n`;
    md += `## Executive Summary\n${s.executive_summary}\n\n`;
    md += `## Key Study Points\n`;
    (s.key_points || []).forEach(p => md += `- ${p}\n`);
    md += `\n## Vocabulary & Terms\n`;
    (s.glossary || []).forEach(g => md += `**${g.term}**: ${g.definition}\n\n`);
    md += `## Exam Tips\n`;
    (s.high_yield_exam_tips || []).forEach(t => md += `- 🎯 ${t}\n`);

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${s.title.toLowerCase().replace(/\s+/g, '_')}_summary.md`;
    a.click();
    URL.revokeObjectURL(url);
    EduBuddy.showNotification('Downloaded Markdown Study Sheet! 📄');
  }
};
