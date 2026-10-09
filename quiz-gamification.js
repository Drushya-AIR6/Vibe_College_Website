/**
 * Vibe College - Astrolabe Department Sorting Quiz & Cadet Gamification System
 * Provides the interactive quiz for index.html, and the XP/Badges/Assignment Scroll Drop desk for student.html.
 */

(function () {
  'use strict';

  // ==============================================================
  // 1. ASTROLABE DEPARTMENT SORTING QUIZ (index.html)
  // ==============================================================
  const QUIZ_QUESTIONS = [
    {
      q: 'When a sudden squall strikes your galleon on the high seas, what is your instinct?',
      choices: [
        { text: '📡 Hack into the astrolabe sensors and compute the optimal escape vector.', dept: 'cs' },
        { text: '⚙️ Rerig the sails, reinforce hull bulkheads, and overhaul the propulsion.', dept: 'mech' },
        { text: '🪙 Negotiate an alliance with a nearby fleet to protect the high-value cargo.', dept: 'comm' },
        { text: '📜 Consult celestial scrolls, record the storm in the ship’s log, and inspire the crew.', dept: 'arts' },
      ],
    },
    {
      q: 'What legendary treasure would you seek across uncharted waters?',
      choices: [
        { text: '🤖 The Autonomous Vision Astrolabe that maps reef depths without human hand.', dept: 'cs' },
        { text: '⚓ The Unsinkable Galleon Engine with hydrodynamic wave-glider fins.', dept: 'mech' },
        { text: '💰 The Sovereign Golden Charter granting supreme high-seas trade routes.', dept: 'comm' },
        { text: '🗺️ The Lost Parchment of Magellan revealing forgotten archipelago civilizations.', dept: 'arts' },
      ],
    },
    {
      q: 'What command position would you choose aboard the flagship HMS Discovery?',
      choices: [
        { text: '💻 Chief Cryptographer & Autonomous AI Systems Commander', dept: 'cs' },
        { text: '🛠️ Chief Naval Architect & Hydrodynamic Propulsion Master', dept: 'mech' },
        { text: '⚖️ Grand Purser & Sovereign Maritime Trade Diplomat', dept: 'comm' },
        { text: '🖋️ Fleet Chief Cartographer, Lore-Keeper & Chronicler', dept: 'arts' },
      ],
    },
    {
      q: 'Your indispensable companion on a 6-month ocean voyage?',
      choices: [
        { text: '🔬 A portable computing terminal analyzing satellite ocean winds.', dept: 'cs' },
        { text: '🔧 A custom leather roll of titanium calipers, wrenches, and welding torches.', dept: 'mech' },
        { text: '📊 A cryptographic ledger tracking global commodity prices and doubloon bullion.', dept: 'comm' },
        { text: '🔭 An antique brass telescope and bound leather sketchbook inked in sepia.', dept: 'arts' },
      ],
    },
  ];

  const DEPT_RESULTS = {
    cs: {
      title: 'Computing Atoll — School of Navigational Tech',
      badge: '💻 Technologist Navigator',
      lead: 'Dr. Alistair Finch (Ph.D. Cambridge)',
      motto: '“In the digital fog, algorithms are the stars by which we steer.”',
      courses: 'B.Tech Computer Science & Maritime AI (CS-301, CS-302)',
      color: '#27ae60',
    },
    mech: {
      title: 'Mechanics Isle — Marine Robotics & Naval Systems',
      badge: '⚙️ Iron Architect',
      lead: 'Dr. Evelyn Drake (Ph.D. MIT Robotics)',
      motto: '“We engineer vessels that brave any tempest without surrender.”',
      courses: 'B.Tech Naval Architecture & Marine Mechatronics (NA-101)',
      color: '#e67e22',
    },
    comm: {
      title: 'Commerce Reef — Global Maritime Logistics & Trade',
      badge: '⚖️ Sovereign Merchant Commander',
      lead: 'Capt. Marcus Sterling (MBA Wharton)',
      motto: '“Commerce is the bloodstream of global empires.”',
      courses: 'B.B.A. Maritime Commerce & International Fleet Logistics',
      color: '#f39c12',
    },
    arts: {
      title: 'Cartography Cay — Humanities & Maritime Lore',
      badge: '📜 Master Cartographer & Storyteller',
      lead: 'Prof. Corinne Beaufort (D.Litt. Sorbonne)',
      motto: '“Without stories, art, and philosophy, a voyage has direction but no purpose.”',
      courses: 'B.A. Hons Maritime Lore, Cartography & Maritime Ethics',
      color: '#8e44ad',
    },
  };

  let currentQuestionIdx = 0;
  const quizScores = { cs: 0, mech: 0, comm: 0, arts: 0 };

  function initAstrolabeQuiz() {
    const container = document.querySelector('#astrolabe-quiz-container');
    if (!container) return;

    renderQuizQuestion(container);
  }

  function renderQuizQuestion(container) {
    if (currentQuestionIdx >= QUIZ_QUESTIONS.length) {
      renderQuizResult(container);
      return;
    }

    const qData = QUIZ_QUESTIONS[currentQuestionIdx];
    const progress = Math.round(((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100);

    container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-progress-bar-wrap">
          <div class="quiz-progress-bar" style="width: ${progress}%;"></div>
        </div>
        <div class="quiz-step-indicator">
          <span>COMPASS TRIAL ${currentQuestionIdx + 1} OF ${QUIZ_QUESTIONS.length}</span>
          <span>${progress}% Calibrated</span>
        </div>
        <h3 class="quiz-question-title">${qData.q}</h3>
        <div class="quiz-choices-grid">
          ${qData.choices
            .map(
              (c, i) => `
            <button type="button" class="quiz-choice-btn" data-dept="${c.dept}">
              <span class="quiz-choice-key">${['A', 'B', 'C', 'D'][i]}</span>
              <span class="quiz-choice-text">${c.text}</span>
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.quiz-choice-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dept = btn.dataset.dept;
        quizScores[dept] = (quizScores[dept] || 0) + 1;
        currentQuestionIdx++;
        renderQuizQuestion(container);
      });
    });
  }

  function renderQuizResult(container) {
    // Find winner department
    let maxDept = 'cs';
    let maxScore = -1;
    for (const d in quizScores) {
      if (quizScores[d] > maxScore) {
        maxScore = quizScores[d];
        maxDept = d;
      }
    }

    const result = DEPT_RESULTS[maxDept];

    container.innerHTML = `
      <div class="quiz-result-parchment">
        <div class="quiz-seal">⚜️</div>
        <p class="quiz-result-kicker">ASTROLABE COMMISSION DECREE</p>
        <h2 class="quiz-result-title">${result.title}</h2>
        <div class="quiz-result-badge-pill" style="border-color: ${result.color}; color: ${result.color};">
          ${result.badge}
        </div>
        <p class="quiz-result-motto">${result.motto}</p>
        <div class="quiz-result-details">
          <p><strong>Faculty Mentor:</strong> ${result.lead}</p>
          <p><strong>Commissioned Voyage:</strong> ${result.courses}</p>
        </div>
        <div class="quiz-result-actions">
          <a href="#admissions" class="button button-gold">Claim Your Berth & Apply Now →</a>
          <button type="button" class="button button-dark" id="btn-retake-quiz">Recalibrate Compass ↺</button>
        </div>
      </div>
    `;

    const retakeBtn = container.querySelector('#btn-retake-quiz');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        currentQuestionIdx = 0;
        quizScores.cs = 0;
        quizScores.mech = 0;
        quizScores.comm = 0;
        quizScores.arts = 0;
        renderQuizQuestion(container);
      });
    }
  }

  // ==============================================================
  // 2. CADET GAMIFICATION & ASSIGNMENT DESK (student.html)
  // ==============================================================
  const CADET_BADGES = [
    { id: 'b_orient', name: 'Astrolabe Initiate', icon: '🧭', desc: 'Sworn into the Vibe College Fleet', unlocked: true },
    { id: 'b_board', name: 'Boarding Veteran', icon: '⚔️', desc: 'Successfully climbed the gangplank', unlocked: true },
    { id: 'b_storm', name: 'Storm Conqueror', icon: '🌊', desc: 'Maintained 100% duty attendance', unlocked: true },
    { id: 'b_bounty', name: 'Doubloon Scholar', icon: '💰', desc: 'Tuition charter verified with bursar', unlocked: true },
    { id: 'b_scroll', name: 'Scroll Master', icon: '📜', desc: 'Submitted assignment scroll for appraisal', unlocked: false },
  ];

  function getCadetXP() {
    return parseInt(localStorage.getItem('vc_cadet_xp') || '420', 10);
  }

  function addCadetXP(pts, reason) {
    let current = getCadetXP();
    current += pts;
    localStorage.setItem('vc_cadet_xp', String(current));

    if (reason) {
      showToast(`⚓ +${pts} Nautical XP! (${reason})`);
    }
    renderCadetGamificationUI();
  }

  function getCadetBadges() {
    try {
      const stored = localStorage.getItem('vc_cadet_badges');
      if (stored) return JSON.parse(stored);
      localStorage.setItem('vc_cadet_badges', JSON.stringify(CADET_BADGES));
      return CADET_BADGES;
    } catch (e) {
      return CADET_BADGES;
    }
  }

  function unlockBadge(badgeId) {
    const badges = getCadetBadges();
    const target = badges.find((b) => b.id === badgeId);
    if (target && !target.unlocked) {
      target.unlocked = true;
      localStorage.setItem('vc_cadet_badges', JSON.stringify(badges));
      showToast(`🏆 NEW BADGE UNLOCKED: ${target.name} (${target.icon})!`);
      renderCadetGamificationUI();
    }
  }

  function getRankDetails(xp) {
    if (xp >= 1400) return { rank: 'High Sovereign Privateer', level: 5, nextXP: 2000, pct: 100 };
    if (xp >= 900) return { rank: 'Fleet Navigator', level: 4, nextXP: 1400, pct: Math.round(((xp - 900) / 500) * 100) };
    if (xp >= 500) return { rank: 'Sailing Master', level: 3, nextXP: 900, pct: Math.round(((xp - 500) / 400) * 100) };
    if (xp >= 200) return { rank: 'Quartermaster', level: 2, nextXP: 500, pct: Math.round(((xp - 200) / 300) * 100) };
    return { rank: 'Deck Hand', level: 1, nextXP: 200, pct: Math.round((xp / 200) * 100) };
  }

  function renderCadetGamificationUI() {
    const xpContainer = document.querySelector('#cadet-xp-hub');
    const badgesContainer = document.querySelector('#cadet-badges-hub');
    if (!xpContainer && !badgesContainer) return;

    const xp = getCadetXP();
    const rankInfo = getRankDetails(xp);
    const badges = getCadetBadges();

    if (xpContainer) {
      xpContainer.innerHTML = `
        <div class="xp-banner-card">
          <div class="xp-header-row">
            <div>
              <span class="xp-rank-pill">LEVEL ${rankInfo.level} · ${rankInfo.rank}</span>
              <h3 style="margin: 6px 0 0; color: #fff; font-size: 20px;">Nautical Prestige: ${xp} XP</h3>
            </div>
            <span style="font-size: 32px;">⚓</span>
          </div>
          <div class="xp-meter-wrap">
            <div class="xp-meter-fill" style="width: ${rankInfo.pct}%;"></div>
          </div>
          <div class="xp-footer-row">
            <small style="color: #9bb09b;">Current Rank: ${rankInfo.rank}</small>
            <small style="color: var(--gold);">${rankInfo.nextXP - xp > 0 ? rankInfo.nextXP - xp + ' XP to Next Rank' : 'Max Rank Achieved'}</small>
          </div>
        </div>
      `;
    }

    if (badgesContainer) {
      badgesContainer.innerHTML = `
        <div class="badges-grid">
          ${badges
            .map(
              (b) => `
            <div class="badge-card ${b.unlocked ? 'is-unlocked' : 'is-locked'}" title="${b.desc}">
              <div class="badge-icon-wrap">${b.icon}</div>
              <strong>${b.name}</strong>
              <small>${b.unlocked ? 'Unlocked' : 'Locked'}</small>
            </div>
          `
            )
            .join('')}
        </div>
      `;
    }
  }

  function initAssignmentScrollDesk() {
    const form = document.querySelector('#scroll-drop-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const course = document.querySelector('#scroll-course')?.value;
      const title = document.querySelector('#scroll-title')?.value;
      const content = document.querySelector('#scroll-content')?.value;

      if (!title || !content) return;

      // Unlock badge & give XP!
      unlockBadge('b_scroll');
      addCadetXP(150, 'Assignment Scroll Appraised');

      const receiptEl = document.querySelector('#scroll-receipt-box');
      if (receiptEl) {
        receiptEl.innerHTML = `
          <div style="padding: 16px; background: #eafaf1; border: 1.5px solid #2ecc71; border-radius: 6px; margin-top: 14px;">
            <p style="margin: 0; color: #27ae60; font-weight: bold; font-size: 13px;">
              ✓ VOYAGE SCROLL RECEIVED & SEALED IN FLEET ARCHIVES
            </p>
            <small style="color: #2c3e50; display: block; margin-top: 4px;">
              Course: <strong>${course}</strong> · Title: <strong>${title}</strong>
            </small>
            <p style="margin: 6px 0 0; font-size: 11px; color: #16a085;">
              Evaluator: Admiralty Faculty Review Board · Status: <strong>Under Appraisal (Grade: A Pending)</strong>
            </p>
          </div>
        `;
      }

      form.reset();
    });
  }

  function showToast(msg) {
    let toast = document.querySelector('#vibe-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'vibe-toast';
      toast.className = 'vibe-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4000);
  }

  // Auto initialize on DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    initAstrolabeQuiz();
    renderCadetGamificationUI();
    initAssignmentScrollDesk();
  });

  window.VibeGamification = {
    addXP: addCadetXP,
    unlockBadge: unlockBadge,
    getXP: getCadetXP,
  };
})();
