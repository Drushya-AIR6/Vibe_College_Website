/**
 * Vibe College - Ship's Helm Soundscape & Weather Atmosphere Engine
 * Zero-dependency procedural Web Audio & CSS-driven weather simulation.
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER ---
  let audioCtx = null;
  let waveGain = null;
  let windGain = null;
  let masterGain = null;
  let isSoundActive = false;
  let waveTimer = null;
  let windTimer = null;

  function initAudio() {
    if (audioCtx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioCtx = new AudioContextClass();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Wave Gain
    waveGain = audioCtx.createGain();
    waveGain.gain.setValueAtTime(0, audioCtx.currentTime);
    waveGain.connect(masterGain);

    // Wind Gain
    windGain = audioCtx.createGain();
    windGain.gain.setValueAtTime(0, audioCtx.currentTime);
    windGain.connect(masterGain);
  }

  function createNoiseBuffer() {
    if (!audioCtx) return null;
    const bufferSize = audioCtx.sampleRate * 3;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink/Brown noise filter
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
    return buffer;
  }

  function startWaveSynthesis() {
    if (!audioCtx || !waveGain) return;
    const noiseBuffer = createNoiseBuffer();
    if (!noiseBuffer) return;

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);

    noiseSource.connect(filter);
    filter.connect(waveGain);
    noiseSource.start();

    // Procedural wave surge cycles
    function swellWave() {
      if (!isSoundActive || !audioCtx) return;
      const now = audioCtx.currentTime;
      const period = 4.5 + Math.random() * 2;
      waveGain.gain.cancelScheduledValues(now);
      waveGain.gain.setValueAtTime(waveGain.gain.value, now);
      waveGain.gain.linearRampToValueAtTime(0.65, now + period * 0.4);
      waveGain.gain.linearRampToValueAtTime(0.12, now + period);
      waveTimer = setTimeout(swellWave, period * 1000);
    }
    swellWave();
  }

  function startWindSynthesis() {
    if (!audioCtx || !windGain) return;
    const noiseBuffer = createNoiseBuffer();
    if (!noiseBuffer) return;

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, audioCtx.currentTime);
    filter.Q.setValueAtTime(3.0, audioCtx.currentTime);

    noiseSource.connect(filter);
    filter.connect(windGain);
    noiseSource.start();

    function gustWind() {
      if (!isSoundActive || !audioCtx) return;
      const now = audioCtx.currentTime;
      const period = 5 + Math.random() * 4;
      windGain.gain.cancelScheduledValues(now);
      windGain.gain.setValueAtTime(windGain.gain.value, now);
      windGain.gain.linearRampToValueAtTime(0.28, now + period * 0.5);
      windGain.gain.linearRampToValueAtTime(0.05, now + period);
      windTimer = setTimeout(gustWind, period * 1000);
    }
    gustWind();
  }

  // Ship's Eight-Bells Chime
  function playShipBell() {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const freqs = [880, 1760, 2640];
    const decay = 2.4;

    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(idx === 0 ? 0.35 : 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  }

  function toggleSound(enable) {
    initAudio();
    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isSoundActive = enable !== undefined ? enable : !isSoundActive;
    localStorage.setItem('vc_sound_enabled', isSoundActive ? 'true' : 'false');

    if (isSoundActive) {
      startWaveSynthesis();
      startWindSynthesis();
    } else {
      if (waveTimer) clearTimeout(waveTimer);
      if (windTimer) clearTimeout(windTimer);
      if (waveGain) waveGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
      if (windGain) windGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    }
    updateWidgetUI();
  }

  function setVolume(val) {
    if (!audioCtx || !masterGain) return;
    masterGain.gain.setValueAtTime(parseFloat(val), audioCtx.currentTime);
    localStorage.setItem('vc_sound_vol', val);
  }

  // --- WEATHER STATE ENGINE ---
  let currentWeather = localStorage.getItem('vc_weather') || 'clear';

  function applyWeather(mode) {
    currentWeather = mode;
    localStorage.setItem('vc_weather', mode);

    document.body.classList.remove('weather-fog', 'weather-storm');
    let overlay = document.querySelector('#weather-overlay');

    if (mode === 'clear') {
      if (overlay) overlay.innerHTML = '';
    } else if (mode === 'fog') {
      document.body.classList.add('weather-fog');
      if (!overlay) overlay = createWeatherOverlay();
      overlay.innerHTML = `
        <div class="fog-layer fog-layer-1"></div>
        <div class="fog-layer fog-layer-2"></div>
      `;
    } else if (mode === 'storm') {
      document.body.classList.add('weather-storm');
      if (!overlay) overlay = createWeatherOverlay();
      overlay.innerHTML = `
        <div class="storm-rain-canvas" id="rain-drops"></div>
        <div class="storm-flash" id="storm-flash"></div>
      `;
      createRainDrops();
      startLightningLoop();
    }
    updateWidgetUI();
  }

  function createWeatherOverlay() {
    let overlay = document.querySelector('#weather-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'weather-overlay';
      overlay.className = 'weather-overlay-container';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function createRainDrops() {
    const rainContainer = document.querySelector('#rain-drops');
    if (!rainContainer) return;
    rainContainer.innerHTML = '';
    const dropCount = 45;
    for (let i = 0; i < dropCount; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDuration = `${0.5 + Math.random() * 0.4}s`;
      drop.style.animationDelay = `${Math.random() * 0.8}s`;
      rainContainer.appendChild(drop);
    }
  }

  let lightningTimer = null;
  function startLightningLoop() {
    if (lightningTimer) clearTimeout(lightningTimer);
    function flash() {
      if (currentWeather !== 'storm') return;
      const flashEl = document.querySelector('#storm-flash');
      if (flashEl) {
        flashEl.classList.add('is-flashing');
        setTimeout(() => flashEl.classList.remove('is-flashing'), 180);
      }
      lightningTimer = setTimeout(flash, 6000 + Math.random() * 9000);
    }
    lightningTimer = setTimeout(flash, 3000);
  }

  // --- FLOATING SHIP'S HELM WIDGET ---
  let widgetContainer = null;
  let isPanelOpen = false;

  function renderHelmWidget() {
    if (document.querySelector('#ships-helm-widget')) return;

    widgetContainer = document.createElement('div');
    widgetContainer.id = 'ships-helm-widget';
    widgetContainer.className = 'ships-helm-container';
    widgetContainer.innerHTML = `
      <div class="helm-panel" id="helm-panel" hidden>
        <div class="helm-panel-header">
          <span class="helm-panel-title">☸ THE SHIP'S HELM</span>
          <button type="button" class="helm-close-btn" id="helm-close-btn" aria-label="Close Ship's Helm">×</button>
        </div>
        
        <div class="helm-section">
          <label class="helm-label">HIGH SEAS SOUNDSCAPE</label>
          <div class="helm-sound-row">
            <button type="button" class="helm-action-btn ${isSoundActive ? 'is-active' : ''}" id="btn-toggle-sound">
              ${isSoundActive ? '🔊 Sound: ON' : '🔈 Sound: MUTED'}
            </button>
            <button type="button" class="helm-chime-btn" id="btn-ring-bell" title="Toll the ship's bell">
              🔔 Toll Bell
            </button>
          </div>
          <div class="helm-slider-row">
            <span style="font-size: 10px; color: #a4b5a2;">Vol:</span>
            <input type="range" id="helm-volume-slider" min="0" max="1" step="0.05" value="${localStorage.getItem('vc_sound_vol') || '0.4'}" />
          </div>
        </div>

        <div class="helm-section">
          <label class="helm-label">MARITIME WEATHER</label>
          <div class="helm-weather-grid">
            <button type="button" class="helm-weather-btn ${currentWeather === 'clear' ? 'is-active' : ''}" data-weather="clear">
              ☀️ Clear
            </button>
            <button type="button" class="helm-weather-btn ${currentWeather === 'fog' ? 'is-active' : ''}" data-weather="fog">
              🌫️ Fog
            </button>
            <button type="button" class="helm-weather-btn ${currentWeather === 'storm' ? 'is-active' : ''}" data-weather="storm">
              ⛈️ Storm
            </button>
          </div>
        </div>
      </div>

      <button type="button" class="helm-fab" id="helm-fab" aria-label="Open Ship's Helm Atmosphere Controls" title="Ship's Helm: Audio & Weather">
        <span class="helm-wheel-icon">☸</span>
        <span class="helm-tooltip">Ship's Helm</span>
      </button>
    `;

    document.body.appendChild(widgetContainer);

    // Event listeners
    const fab = widgetContainer.querySelector('#helm-fab');
    const panel = widgetContainer.querySelector('#helm-panel');
    const closeBtn = widgetContainer.querySelector('#helm-close-btn');
    const toggleSoundBtn = widgetContainer.querySelector('#btn-toggle-sound');
    const ringBellBtn = widgetContainer.querySelector('#btn-ring-bell');
    const volSlider = widgetContainer.querySelector('#helm-volume-slider');

    function openHelm() {
      isPanelOpen = true;
      panel.hidden = false;
      panel.style.display = 'block';
      fab.classList.add('is-open');
    }

    function closeHelm() {
      isPanelOpen = false;
      panel.hidden = true;
      panel.style.display = 'none';
      fab.classList.remove('is-open');
    }

    fab.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPanelOpen) {
        closeHelm();
      } else {
        openHelm();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeHelm();
      });
    }

    document.addEventListener('click', (e) => {
      if (isPanelOpen && !widgetContainer.contains(e.target)) {
        closeHelm();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isPanelOpen) {
        closeHelm();
      }
    });

    toggleSoundBtn.addEventListener('click', () => {
      toggleSound();
    });

    ringBellBtn.addEventListener('click', () => {
      playShipBell();
    });

    volSlider.addEventListener('input', (e) => {
      setVolume(e.target.value);
    });

    widgetContainer.querySelectorAll('.helm-weather-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyWeather(btn.dataset.weather);
      });
    });
  }

  function updateWidgetUI() {
    if (!widgetContainer) return;
    const toggleSoundBtn = widgetContainer.querySelector('#btn-toggle-sound');
    if (toggleSoundBtn) {
      toggleSoundBtn.textContent = isSoundActive ? '🔊 Sound: ON' : '🔈 Sound: MUTED';
      toggleSoundBtn.classList.toggle('is-active', isSoundActive);
    }
    widgetContainer.querySelectorAll('.helm-weather-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.weather === currentWeather);
    });
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
      createWeatherOverlay();
      if (currentWeather !== 'clear') {
        applyWeather(currentWeather);
      }
      renderHelmWidget();
    });
  } else {
    createWeatherOverlay();
    if (currentWeather !== 'clear') {
      applyWeather(currentWeather);
    }
    renderHelmWidget();
  }

  // Export API to window for other components
  window.VibeAtmosphere = {
    playShipBell,
    toggleSound,
    applyWeather,
    getWeather: () => currentWeather,
    isSoundActive: () => isSoundActive,
  };
})();
