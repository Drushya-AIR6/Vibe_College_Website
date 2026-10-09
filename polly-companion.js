/**
 * Vibe College - Captain Polly Interactive AI Companion
 * An intelligent, pirate-lore chatbot with campus guidance, fast deep-links, and speech synthesis.
 */

(function () {
  'use strict';

  const POLLY_KNOWLEDGE = [
    {
      triggers: ['course', 'program', 'degree', 'study', 'major', 'tech', 'b.tech', 'bba', 'curriculum', 'learn'],
      reply: 'Ahoy! We offer four legendary voyage disciplines across our archipelago:\n• **Computing Atoll**: Navigational Tech & AI (CS-301, CS-302)\n• **Mechanics Isle**: Naval Robotics & Marine Systems (NA-101)\n• **Commerce Reef**: Global Maritime Trade & Logistics\n• **Cartography Cay**: Lore, History & Maritime Arts.',
      action: { text: 'View All Courses ↗', href: '#courses' },
    },
    {
      triggers: ['fee', 'cost', 'doubloon', 'tuition', 'scholarship', 'hostel', 'waiver', 'price', 'calculator'],
      reply: 'Aye, grab yer coin pouch! Base tuition is ₹1,80,000 to ₹2,40,000 per annum. We grant up to **30% Merit Doubloon Waivers** for distinction scholars, and hostel berths are ₹75,000.',
      action: { text: 'Open Doubloon Calculator ↗', href: '#admissions' },
    },
    {
      triggers: ['map', 'where', 'direction', 'library', 'cafe', 'dock', 'hall', 'quad', 'garden', 'find', 'location'],
      reply: 'Squawk! Never lose yer bearings on this campus! Captain Polly knows every harbor stone: The Old Library, Founders Hall, The Galley Café, Arts Dock, and Harbour Gardens.',
      action: { text: 'Open Secret Map ⌖', href: 'map.html' },
    },
    {
      triggers: ['placement', 'job', 'salary', 'package', 'bounty', 'recruit', 'hire', 'career'],
      reply: 'By Blackbeard\'s beard! Our fleet commands highest bounties reaching **₹48.5 LPA**, with a 94.8% placement embarkation rate across 180+ global allied maritime corporations!',
      action: { text: 'Inspect Bounty Board ↗', href: '#placements' },
    },
    {
      triggers: ['login', 'portal', 'cadet', 'deck', 'attendance', 'mark', 'grade', 'account', 'sign in', 'student'],
      reply: 'Permission to board! Cadets can check their duty timetable, sea-readiness attendance gauge, and course berths in the Pirate Student Deck. Swear in at the gangplank!',
      action: { text: 'Board the Ship ☸', href: 'login.html' },
    },
    {
      triggers: ['quiz', 'sort', 'which island', 'astrolabe', 'test', 'recommend'],
      reply: 'Take the **Astrolabe Department Sorting Quiz**! Answer 4 nautical questions to discover whether you belong at Computing Atoll, Mechanics Isle, Commerce Reef, or Cartography Cay!',
      action: { text: 'Take Astrolabe Quiz ✳', href: '#astrolabe-quiz-section' },
    },
    {
      triggers: ['shanty', 'sing', 'song', 'music'],
      reply: '🎶 *Soon may the Wellerman come, to bring us sugar and tea and rum! One day, when the tongue-in\' is done, we\'ll take our leave and go!* 🎶 (Squawk! What a tune!)',
    },
    {
      triggers: ['joke', 'funny', 'laugh'],
      reply: 'Why did the pirate become an engineer?\n...Because he was an expert in high-C programming! Squawk! Har har har! 🦜🏴‍☠️',
    },
    {
      triggers: ['secret', 'easter egg', 'hidden', 'treasure'],
      reply: 'Whisper this to the tides: Visit `map.html` while authenticated as a cadet, or ring the ship\'s bell 8 times during a midnight storm to awaken the ancient Kraken! 🦑',
      action: { text: 'Visit Secret Map ⌖', href: 'map.html' },
    },
    {
      triggers: ['captain', 'admiral', 'head', 'principal', 'sterling'],
      reply: 'High Admiral Sterling stands at the helm in Captain\'s Quarters. A veteran commander of global waters, steering Vibe College toward bold new horizons.',
      action: { text: "Captain's Quarters ↗", href: '#captain' },
    },
    {
      triggers: ['contact', 'bottle', 'phone', 'email', 'help', 'message'],
      reply: 'Cast a message into the ocean! Fill out our **Message in a Bottle** contact post and our harbor watch pigeons will return word within 24 tide turns.',
      action: { text: 'Send Bottle Post ↗', href: '#bottle-enquiry' },
    },
  ];

  let isDrawerOpen = false;
  let voiceEnabled = false;

  function speakText(text) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#•]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.pitch = 1.35; // Parrot squeak pitch
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  function renderPollyUI() {
    if (document.querySelector('#polly-companion-container')) return;

    const container = document.createElement('div');
    container.id = 'polly-companion-container';
    container.className = 'polly-container';
    container.innerHTML = `
      <!-- FLOATING CHAT DRAWER -->
      <div class="polly-drawer" id="polly-drawer" hidden>
        <div class="polly-drawer-header">
          <div class="polly-avatar-badge">
            <span class="polly-avatar-icon">🦜</span>
            <div>
              <strong>Captain Polly</strong>
              <small class="polly-status">Campus Navigational AI · Online</small>
            </div>
          </div>
          <div class="polly-header-actions">
            <label class="polly-voice-toggle" title="Toggle Polly Voice Synthesis">
              <input type="checkbox" id="polly-voice-chk" />
              <span style="font-size: 11px;">🗣️ Voice</span>
            </label>
            <button type="button" class="polly-close-btn" id="polly-close-btn" aria-label="Close Captain Polly">×</button>
          </div>
        </div>

        <!-- QUICK CHIPS -->
        <div class="polly-chips-bar" id="polly-chips-bar">
          <button type="button" class="polly-chip" data-msg="Tell me about courses">📜 Courses</button>
          <button type="button" class="polly-chip" data-msg="How much are fees and scholarships?">💰 Fees & Aid</button>
          <button type="button" class="polly-chip" data-msg="Where is the campus library?">🗺️ Campus Map</button>
          <button type="button" class="polly-chip" data-msg="Sing me a pirate shanty">🎶 Shanty</button>
          <button type="button" class="polly-chip" data-msg="Tell me a pirate joke">🦜 Joke</button>
        </div>

        <!-- MESSAGES FEED -->
        <div class="polly-messages" id="polly-messages">
          <div class="polly-msg polly-msg-bot">
            <span class="polly-bot-avatar">🦜</span>
            <div class="polly-bubble">
              <p>Squawk! Ahoy there, curious voyager! I’m <strong>Captain Polly</strong>, your personal campus navigator. How may I chart your course today?</p>
            </div>
          </div>
        </div>

        <!-- INPUT BAR -->
        <form class="polly-input-bar" id="polly-input-form">
          <input type="text" id="polly-input-text" placeholder="Ask Polly about courses, fees, map..." autocomplete="off" />
          <button type="submit" id="polly-send-btn" aria-label="Send message to Captain Polly">➤</button>
        </form>
      </div>

      <!-- FLOATING LAUNCHER BUTTON -->
      <button type="button" class="polly-fab" id="polly-fab" aria-label="Open Captain Polly Campus Assistant">
        <span class="polly-fab-avatar">🦜</span>
        <span class="polly-fab-badge">Polly AI</span>
        <span class="polly-idle-bubble" id="polly-idle-bubble">Squawk! Need bearings?</span>
      </button>
    `;

    document.body.appendChild(container);

    // Event listeners
    const fab = container.querySelector('#polly-fab');
    const drawer = container.querySelector('#polly-drawer');
    const closeBtn = container.querySelector('#polly-close-btn');
    const form = container.querySelector('#polly-input-form');
    const input = container.querySelector('#polly-input-text');
    const voiceChk = container.querySelector('#polly-voice-chk');
    const idleBubble = container.querySelector('#polly-idle-bubble');

    // Hide idle bubble after 6s
    setTimeout(() => {
      if (idleBubble) idleBubble.style.opacity = '0';
    }, 6000);

    fab.addEventListener('click', () => {
      isDrawerOpen = !isDrawerOpen;
      drawer.hidden = !isDrawerOpen;
      fab.classList.toggle('is-active', isDrawerOpen);
      if (idleBubble) idleBubble.remove();
      if (isDrawerOpen) {
        input.focus();
        scrollToBottom();
      }
    });

    closeBtn.addEventListener('click', () => {
      isDrawerOpen = false;
      drawer.hidden = true;
      fab.classList.remove('is-active');
    });

    if (voiceChk) {
      voiceChk.addEventListener('change', (e) => {
        voiceEnabled = e.target.checked;
        if (voiceEnabled) {
          speakText("Squawk! Polly's voice is ready, matey!");
        }
      });
    }

    container.querySelectorAll('.polly-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const text = chip.dataset.msg;
        handleUserMessage(text);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = (input.value || '').trim();
      if (!val) return;
      input.value = '';
      handleUserMessage(val);
    });
  }

  function handleUserMessage(userText) {
    appendMessage('user', userText);

    // Determine Polly answer
    const lower = userText.toLowerCase();
    let bestMatch = null;

    for (const item of POLLY_KNOWLEDGE) {
      if (item.triggers.some((t) => lower.includes(t))) {
        bestMatch = item;
        break;
      }
    }

    setTimeout(() => {
      if (bestMatch) {
        appendMessage('bot', bestMatch.reply, bestMatch.action);
        speakText(bestMatch.reply);
      } else {
        const fallback =
          "Squawk! Polly didn’t quite catch that wind! Try asking about **courses**, **doubloon fees**, **campus map landmarks**, or take the **astrolabe quiz**!";
        appendMessage('bot', fallback, { text: 'Browse Courses ↗', href: '#courses' });
        speakText(fallback);
      }
    }, 450);
  }

  function appendMessage(sender, text, action) {
    const feed = document.querySelector('#polly-messages');
    if (!feed) return;

    const row = document.createElement('div');
    row.className = `polly-msg polly-msg-${sender}`;

    if (sender === 'bot') {
      const avatar = document.createElement('span');
      avatar.className = 'polly-bot-avatar';
      avatar.textContent = '🦜';
      row.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'polly-bubble';

    // Format Markdown-like bold / lines
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');

    bubble.innerHTML = `<p>${formatted}</p>`;

    if (action && action.href) {
      const actBtn = document.createElement('a');
      actBtn.className = 'polly-action-link';
      actBtn.href = action.href;
      actBtn.textContent = action.text;
      actBtn.addEventListener('click', () => {
        const drawer = document.querySelector('#polly-drawer');
        if (drawer) drawer.hidden = true;
      });
      bubble.appendChild(actBtn);
    }

    row.appendChild(bubble);
    feed.appendChild(row);
    scrollToBottom();
  }

  function scrollToBottom() {
    const feed = document.querySelector('#polly-messages');
    if (feed) feed.scrollTop = feed.scrollHeight;
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', renderPollyUI);
  } else {
    renderPollyUI();
  }

  window.CaptainPolly = {
    ask: (q) => handleUserMessage(q),
    open: () => {
      const drawer = document.querySelector('#polly-drawer');
      if (drawer) drawer.hidden = false;
    },
  };
})();
