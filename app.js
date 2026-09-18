/**
 * ==============================================================================
 * CHANDANA'S 23RD BIRTHDAY - MODERN INTERACTIVE CELEBRATION
 * ==============================================================================
 * Features:
 * - Romantic "Slide to Unwrap" Ribbon Opening Experience
 * - Procedural Romantic Synthesizer & Audio Engine (Plays upon unwrap & celebration)
 * - Birthday Countdown to 20th September 12:00 AM Midnight
 * - Interactive 3-Tier Cake with Hidden Flanking Cats that Pop In upon Candle Blowing
 * - Heavy & Chaotic Candle Blowing Celebration (Screen Shake, Dense Fireworks, Balloon Swarms)
 * - Live Relationship Counter ("Loving You For...") placed right after the cake
 * - Interactive Drag-to-Aim Bow & Arrow Game with Moving Heart Target
 * - Pop-Up 3D Envelope & Slide-Out Love Letter with "Put Letter Back" Replay Loop
 * - Strictly Background Floating Hearts, Balloons, and Strawberries Layer (z-index: 1)
 * - Symmetrical 23 Solo Portraits for her 23rd Birthday (3 per row, 2 centered)
 * - 10 Couple Memories Slideshow with Arrows and Touch Swipe
 * - Heartfelt Customizable Notes
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initSlideToUnwrap();
  initAudioEngine();
  initMusicToggle();
  initBackgroundSparkles();
  initConfettiAndFireworks();
  initBirthdayCountdown();
  initCakeCeremony();
  initLoveCounter();
  initCupidArchery();
  initPoppableBalloons();
  initGalleryAndSlideshow();
});

/* ==========================================================================
   1. ROMANTIC SLIDE-TO-UNWRAP OPENING EXPERIENCE
   ========================================================================== */
function initSlideToUnwrap() {
  const curtain = document.getElementById('intro-curtain');
  const track = document.getElementById('slide-unwrap-track');
  const handle = document.getElementById('slide-unwrap-handle');
  const progress = document.getElementById('slide-unwrap-progress');
  const hintText = document.getElementById('slide-unwrap-text');
  if (!curtain || !track || !handle) return;

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let maxSlide = 0;
  let hasOpened = false;

  function updateMaxSlide() {
    maxSlide = track.clientWidth - handle.clientWidth - 10;
  }
  window.addEventListener('resize', updateMaxSlide);
  updateMaxSlide();

  function triggerUnwrap() {
    if (hasOpened) return;
    hasOpened = true;

    // Unlock Web Audio context
    if (window.getAudioContext) {
      const ctx = window.getAudioContext();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    }

    if (progress) progress.style.width = '100%';
    if (hintText) hintText.textContent = "Unwrapped with love! ✨";

    setTimeout(() => {
      curtain.classList.add('opened');

      // Auto-start Ed Sheeran's "Perfect" melody
      if (window.playTrack) {
        window.playTrack('perfect');
      }

      // Initial opening burst of confetti
      if (window.triggerConfettiExplosion) {
        window.triggerConfettiExplosion(window.innerWidth / 2, window.innerHeight * 0.45, 60);
      }
    }, 250);
  }

  // Pointer / Touch Dragging
  function onPointerDown(e) {
    if (hasOpened) return;
    isDragging = true;
    updateMaxSlide();
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    handle.style.transition = 'none';
    if (progress) progress.style.transition = 'none';
  }

  function onPointerMove(e) {
    if (!isDragging || hasOpened) return;
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    let diff = clientX - startX;
    diff = Math.max(0, Math.min(diff, maxSlide));

    currentX = diff;
    handle.style.left = `${5 + diff}px`;
    if (progress) progress.style.width = `${((diff + 20) / track.clientWidth) * 100}%`;

    // If dragged past 85% of track, trigger unwrap!
    if (diff >= maxSlide * 0.85) {
      isDragging = false;
      triggerUnwrap();
    }
  }

  function onPointerUp() {
    if (!isDragging || hasOpened) return;
    isDragging = false;
    // Snap back if released before unwrap
    handle.style.transition = 'left 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
    handle.style.left = '5px';
    if (progress) {
      progress.style.transition = 'width 0.3s ease';
      progress.style.width = '0%';
    }
  }

  handle.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  handle.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Accessible click to unwrap smoothly
  track.addEventListener('click', (e) => {
    if (hasOpened) return;
    if (e.target !== handle) {
      updateMaxSlide();
      handle.style.transition = 'left 0.4s ease';
      handle.style.left = `${maxSlide}px`;
      if (progress) {
        progress.style.transition = 'width 0.4s ease';
        progress.style.width = '100%';
      }
      setTimeout(triggerUnwrap, 380);
    }
  });

  // Global first tap audio unlocker (Supports mobile touch & desktop)
  ['click', 'touchstart', 'pointerdown'].forEach(ev => {
    document.addEventListener(ev, function unlockAudio() {
      if (window.getAudioContext) {
        const ctx = window.getAudioContext();
        if (ctx && ctx.state === 'suspended') ctx.resume();
      }
    }, { once: true, passive: true });
  });
}

function initMusicToggle() {
  const pill = document.getElementById('floating-music-pill');
  const pillText = document.getElementById('music-pill-text');
  const bgm = document.getElementById('romantic-bgm-audio');
  if (!pill) return;

  function updatePillState() {
    if (bgm && !bgm.paused) {
      pill.classList.add('playing');
      if (pillText) pillText.textContent = "Clair de Lune 🌸";
    } else {
      pill.classList.remove('playing');
      if (pillText) pillText.textContent = "Play Romantic Piano 🎵";
    }
  }

  pill.addEventListener('click', () => {
    if (bgm) {
      if (bgm.paused) {
        bgm.volume = 0.65;
        bgm.play().then(updatePillState).catch(() => {});
      } else {
        bgm.pause();
        updatePillState();
      }
    } else {
      window.playTrack('romantic');
      pill.classList.add('playing');
    }
  });

  if (bgm) {
    bgm.addEventListener('play', updatePillState);
    bgm.addEventListener('pause', updatePillState);
  }
}

/* ==========================================================================
   2. PROCEDURAL WEB AUDIO SYNTHESIZER & ROMANTIC SFX ENGINE
   ========================================================================== */
let audioCtx = null;
let masterGain = null;
let currentTrack = 'perfect';
let isMusicPlaying = false;
let musicTimer = null;
let accompTimer = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}
window.getAudioContext = getAudioContext;

function initAudioEngine() {
  window.playSound = {
    blow: playCandleBlowSFX,
    pop: playPopSFX,
    arrow: playArrowShotSFX,
    chime: playChimeSFX,
    twang: playTwangSFX,
    miss: playMissSFX
  };
}

function playInstrumentNote(freq, startTime, duration = 0.8, type = 'acoustic', volume = 0.3) {
  const ctx = getAudioContext();
  if (!ctx || !freq) return;

  const now = Math.max(ctx.currentTime, startTime);
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const noteGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  if (type === 'acoustic') {
    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 2.0, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(600, now + duration);

    noteGain.gain.setValueAtTime(volume, now);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  } else {
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 0.998, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + duration);

    noteGain.gain.setValueAtTime(volume * 0.7, now);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  }

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(noteGain);
  noteGain.connect(masterGain || ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration + 0.05);
  osc2.stop(now + duration + 0.05);
}

function playCandleBlowSFX() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const bufferSize = Math.floor(ctx.sampleRate * 0.45);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.14));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain || ctx.destination);
    noise.start();
  } catch (e) { }
}

function playPopSFX() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    playInstrumentNote(520, ctx.currentTime, 0.15, 'acoustic', 0.25);
    playInstrumentNote(880, ctx.currentTime + 0.04, 0.2, 'acoustic', 0.2);
  } catch (e) { }
}

function playArrowShotSFX() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    playInstrumentNote(350, ctx.currentTime, 0.25, 'acoustic', 0.3);
    playInstrumentNote(659.25, ctx.currentTime + 0.15, 0.6, 'acoustic', 0.25);
    playInstrumentNote(987.77, ctx.currentTime + 0.25, 0.8, 'acoustic', 0.28);
  } catch (e) { }
}

function playChimeSFX() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      playInstrumentNote(freq, ctx.currentTime + idx * 0.09, 0.9, 'acoustic', 0.24);
    });
  } catch (e) { }
}

function playTwangSFX() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    playInstrumentNote(240, ctx.currentTime, 0.2, 'sawtooth', 0.35);
    playInstrumentNote(360, ctx.currentTime + 0.04, 0.16, 'acoustic', 0.25);
  } catch (e) { }
}

function playMissSFX() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.32);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.32);
    osc.connect(gain);
    gain.connect(masterGain || ctx.destination);
    osc.start(now);
    osc.stop(now + 0.33);
  } catch (e) { }
}

/* Romantic Music Box & Celesta Synthesizer */
function playRomanticMusicBoxNote(freq, startTime, duration = 1.4, volume = 0.22) {
  const ctx = getAudioContext();
  if (!ctx || !freq || freq <= 0) return;

  const now = Math.max(ctx.currentTime, startTime);

  // Dual detuned oscillators for lush acoustic chime
  const oscMain = ctx.createOscillator();
  const oscDetune = ctx.createOscillator();
  const oscBell = ctx.createOscillator(); // Inharmonic bell sparkle

  const mainGain = ctx.createGain();
  const bellGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Pure sweet singing sine waves
  oscMain.type = 'sine';
  oscDetune.type = 'sine';
  oscBell.type = 'sine';

  oscMain.frequency.setValueAtTime(freq, now);
  oscDetune.frequency.setValueAtTime(freq * 1.0025, now); // +4 cents chorus
  oscBell.frequency.setValueAtTime(freq * 2.756, now);    // Bell tine chime

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.min(3600, freq * 4.5), now);
  filter.Q.setValueAtTime(1.8, now);

  // Soft natural music-box attack and crystalline ring
  mainGain.gain.setValueAtTime(0.0001, now);
  mainGain.gain.linearRampToValueAtTime(volume, now + 0.008);
  mainGain.gain.exponentialRampToValueAtTime(0.0005, now + duration);

  // High sparkle bell fades quickly
  bellGain.gain.setValueAtTime(volume * 0.35, now);
  bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

  oscMain.connect(mainGain);
  oscDetune.connect(mainGain);
  oscBell.connect(bellGain);

  mainGain.connect(filter);
  bellGain.connect(filter);
  filter.connect(masterGain || ctx.destination);

  oscMain.start(now);
  oscDetune.start(now);
  oscBell.start(now);

  oscMain.stop(now + duration + 0.05);
  oscDetune.stop(now + duration + 0.05);
  oscBell.stop(now + 0.25);
}

function playWarmCelloPad(freq, startTime, duration = 2.4, volume = 0.07) {
  const ctx = getAudioContext();
  if (!ctx || !freq || freq <= 0) return;

  const now = Math.max(ctx.currentTime, startTime);
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(320, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.5);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain || ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.05);
}

// Background Romantic Love Melody: "Can't Help Falling In Love"
function startRomanticLoveMelody() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (musicTimer) clearTimeout(musicTimer);
  if (accompTimer) clearInterval(accompTimer);

  // Frequencies (Hz)
  const D3 = 146.83, E3 = 164.81, Fs3 = 185.00, G3 = 196.00, A3 = 220.00, B3 = 246.94, Cs4 = 277.18;
  const D4 = 293.66, E4 = 329.63, Fs4 = 369.99, G4 = 392.00, A4 = 440.00, B4 = 493.88, Cs5 = 554.37, D5 = 587.33;

  // Romantic Love Theme: "Can't Help Falling In Love"
  const melodyNotes = [
    // Measure 1 - "Wise men say..." (D)
    { f: A4, d: 0.85 }, { f: Fs4, d: 0.85 }, { f: D4, d: 1.4 },
    // Measure 2 - "Only fools rush in..." (A/C#)
    { f: E4, d: 0.45 }, { f: Fs4, d: 0.45 }, { f: G4, d: 0.75 }, { f: Fs4, d: 0.45 }, { f: E4, d: 1.4 },
    // Measure 3 - "But I can't help..." (Bm)
    { f: Fs4, d: 0.5 }, { f: G4, d: 0.5 }, { f: A4, d: 0.75 }, { f: B4, d: 1.4 },
    // Measure 4 - "Falling in love with you..." (G - A - D)
    { f: A4, d: 0.6 }, { f: G4, d: 0.4 }, { f: Fs4, d: 0.6 }, { f: E4, d: 0.6 }, { f: D4, d: 2.2 },
    // Measure 5 - "Shall I stay..." (D)
    { f: A4, d: 0.85 }, { f: Fs4, d: 0.85 }, { f: D4, d: 1.4 },
    // Measure 6 - "Would it be a sin..." (A/C#)
    { f: E4, d: 0.45 }, { f: Fs4, d: 0.45 }, { f: G4, d: 0.75 }, { f: Fs4, d: 0.45 }, { f: E4, d: 1.4 },
    // Measure 7 - "If I can't help..." (Bm)
    { f: Fs4, d: 0.5 }, { f: G4, d: 0.5 }, { f: A4, d: 0.75 }, { f: B4, d: 1.4 },
    // Measure 8 - "Falling in love with you..." (G - A - D)
    { f: A4, d: 0.6 }, { f: G4, d: 0.4 }, { f: Fs4, d: 0.6 }, { f: E4, d: 0.6 }, { f: D4, d: 2.2 },
    // Measure 9 - Bridge: "Like a river flows..." (F#m - C#m)
    { f: Cs5, d: 0.5 }, { f: B4, d: 0.4 }, { f: A4, d: 0.6 }, { f: B4, d: 0.4 }, { f: Cs5, d: 1.4 },
    // Measure 10 - "Surely to the sea..."
    { f: B4, d: 0.5 }, { f: A4, d: 0.4 }, { f: G4, d: 0.6 }, { f: A4, d: 0.4 }, { f: B4, d: 1.4 },
    // Measure 11 - "Darling so it goes..."
    { f: Cs5, d: 0.5 }, { f: B4, d: 0.4 }, { f: A4, d: 0.6 }, { f: B4, d: 0.4 }, { f: Cs5, d: 1.4 },
    // Measure 12 - "Some things are meant to be..." (Em7 - A7)
    { f: D5, d: 0.6 }, { f: Cs5, d: 0.5 }, { f: B4, d: 0.6 }, { f: A4, d: 1.8 },
    // Measure 13 - "Take my hand..." (D)
    { f: A4, d: 0.85 }, { f: Fs4, d: 0.85 }, { f: D4, d: 1.4 },
    // Measure 14 - "Take my whole life too..." (A/C#)
    { f: E4, d: 0.45 }, { f: Fs4, d: 0.45 }, { f: G4, d: 0.75 }, { f: Fs4, d: 0.45 }, { f: E4, d: 1.4 },
    // Measure 15 - "For I can't help..." (Bm)
    { f: Fs4, d: 0.5 }, { f: G4, d: 0.5 }, { f: A4, d: 0.75 }, { f: B4, d: 1.4 },
    // Measure 16 - "Falling in love with you..." (G - A - D)
    { f: A4, d: 0.6 }, { f: G4, d: 0.4 }, { f: Fs4, d: 0.6 }, { f: E4, d: 0.6 }, { f: D4, d: 2.8 }
  ];

  let melodyIdx = 0;
  function tickMelody() {
    if (!isMusicPlaying) return;
    const note = melodyNotes[melodyIdx];
    if (note && note.f > 0) {
      playRomanticMusicBoxNote(note.f, ctx.currentTime, note.d * 1.35, 0.24);
    }
    melodyIdx = (melodyIdx + 1) % melodyNotes.length;
    musicTimer = setTimeout(tickMelody, (note ? note.d : 1.0) * 1000);
  }
  tickMelody();

  // Romantic Harp Arpeggios & Soft Cello Bass Pads
  const arpeggioChords = [
    // D
    { root: D3, notes: [D4, Fs4, A4, D5, A4, Fs4] },
    // A/C#
    { root: Cs4, notes: [Cs4, E4, A4, E5, A4, E4] },
    // Bm
    { root: B3, notes: [B3, D4, Fs4, B4, Fs4, D4] },
    // G - A
    { root: G3, notes: [G3, B3, D4, G4, A4, D4] },
    // D
    { root: D3, notes: [D4, Fs4, A4, D5, A4, Fs4] },
    // A/C#
    { root: Cs4, notes: [Cs4, E4, A4, E5, A4, E4] },
    // Bm
    { root: B3, notes: [B3, D4, Fs4, B4, Fs4, D4] },
    // G - D
    { root: G3, notes: [G3, B3, D4, G4, Fs4, D4] },
    // F#m
    { root: Fs3, notes: [Fs3, A3, Cs4, Fs4, Cs4, A3] },
    // C#m / Bm
    { root: B3, notes: [B3, D4, Fs4, B4, Fs4, D4] },
    // F#m
    { root: Fs3, notes: [Fs3, A3, Cs4, Fs4, Cs4, A3] },
    // Em7 - A7
    { root: E3, notes: [E3, G3, B3, E4, Cs4, A3] },
    // D
    { root: D3, notes: [D4, Fs4, A4, D5, A4, Fs4] },
    // A/C#
    { root: Cs4, notes: [Cs4, E4, A4, E5, A4, E4] },
    // Bm
    { root: B3, notes: [B3, D4, Fs4, B4, Fs4, D4] },
    // G - D
    { root: G3, notes: [G3, B3, D4, G4, A4, D4] }
  ];

  let chordIdx = 0;
  let arpStep = 0;

  accompTimer = setInterval(() => {
    if (!isMusicPlaying) return;
    const chord = arpeggioChords[chordIdx];
    if (arpStep === 0) {
      // Play warm cello bass pad at start of measure
      playWarmCelloPad(chord.root, ctx.currentTime, 2.2, 0.08);
    }
    // Play gentle harp arpeggio note
    const arpFreq = chord.notes[arpStep % chord.notes.length];
    playRomanticMusicBoxNote(arpFreq, ctx.currentTime, 1.2, 0.11);

    arpStep++;
    if (arpStep >= chord.notes.length) {
      arpStep = 0;
      chordIdx = (chordIdx + 1) % arpeggioChords.length;
    }
  }, 420);
}

window.playTrack = function (trackKey) {
  isMusicPlaying = true;
  const bgm = document.getElementById('romantic-bgm-audio');
  if (bgm) {
    bgm.volume = 0.65;
    bgm.loop = true;
    bgm.play().catch(() => {
      // Fallback to procedurally synthesized music box if audio element blocked
      startRomanticLoveMelody();
    });
  } else {
    startRomanticLoveMelody();
  }
};

/* ==========================================================================
   3. BIRTHDAY COUNTDOWN (20TH SEPTEMBER 12:00 AM)
   ========================================================================== */
function initBirthdayCountdown() {
  const daysEl = document.getElementById('bday-days');
  const hoursEl = document.getElementById('bday-hours');
  const minsEl = document.getElementById('bday-minutes');
  const secsEl = document.getElementById('bday-seconds');
  const statusEl = document.getElementById('countdown-status');

  if (!daysEl) return;

  const targetDate = new Date('2026-09-20T00:00:00');

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      if (statusEl) statusEl.textContent = "🎉 It's September 20th! HAPPY 23RD BIRTHDAY MY LOVE! 👑💖";
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const days = Math.floor(totalSecs / (3600 * 24));
    const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. INTERACTIVE 3-TIER CAKE CEREMONY (CATS APPEAR ON BLOW + CHAOTIC CELEBRATION)
   ========================================================================== */
function initCakeCeremony() {
  const candles = document.querySelectorAll('.candle');
  const replayBtn = document.getElementById('replay-ceremony-btn');
  const celebrationBanner = document.getElementById('celebration-banner');
  const instruction = document.getElementById('cake-instruction');
  const catAudio = document.getElementById('cat-birthday-audio');
  const catLeft = document.getElementById('flank-cat-left');
  const catRight = document.getElementById('flank-cat-right');

  let blownCount = 0;
  const totalCandles = candles.length;

  function showFlankingCats() {
    if (catLeft) catLeft.classList.add('visible');
    if (catRight) catRight.classList.add('visible');

    // Duck romantic background piano gently while cats sing
    const bgm = document.getElementById('romantic-bgm-audio');
    if (bgm) bgm.volume = 0.22;

    if (catAudio) {
      // Keep singing continuously once started; do not restart from 0 on every candle blow
      if (catAudio.paused) {
        catAudio.currentTime = 0;
        catAudio.volume = 1.0;
        catAudio.loop = true;
        catAudio.play().catch(() => { });
      }
    }
  }

  function hideFlankingCats() {
    if (catLeft) catLeft.classList.remove('visible');
    if (catRight) catRight.classList.remove('visible');
    if (catAudio) {
      catAudio.pause();
      catAudio.currentTime = 0;
    }
    // Restore romantic piano volume
    const bgm = document.getElementById('romantic-bgm-audio');
    if (bgm) bgm.volume = 0.65;
  }

  // Individual Candle Blowing
  function blowOutCandle(candle) {
    if (candle.classList.contains('blown')) return;
    candle.classList.add('blown');
    blownCount++;

    // 1. Realistic Multi-Particle Smoke Fumes
    const smokeWrap = candle.querySelector('.smoke-puff-wrapper');
    if (smokeWrap) {
      smokeWrap.innerHTML = '';
      for (let i = 0; i < 4; i++) {
        const fume = document.createElement('span');
        fume.className = 'smoke-fume-particle';
        const size = 12 + i * 5;
        fume.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${-6 + (i * 4) + (Math.random() * 6 - 3)}px;
          top: -12px;
          animation-duration: ${1.8 + i * 0.3}s;
          animation-delay: ${i * 0.12}s;
        `;
        smokeWrap.appendChild(fume);
      }
    }

    // 2. Play blow sound
    if (window.playSound && window.playSound.blow) {
      window.playSound.blow();
    }

    // 3. Firecrackers & Confetti Spark Burst
    const rect = candle.getBoundingClientRect();
    if (window.triggerConfettiExplosion) {
      window.triggerConfettiExplosion(rect.left + rect.width / 2, rect.top + 10, 30);
    }

    // 4. Launch 4-5 celebratory balloons/hearts
    spawnCelebrationBalloons(rect.left + rect.width / 2, 4);

    // 5. Cats appear as soon as the candles blow along with song!
    showFlankingCats();

    // 6. When all candles are blown: CELEBRATION! (No screen shake)
    if (blownCount >= totalCandles) {
      if (instruction) {
        instruction.innerHTML = "✨ All candles blown! All your sweetest birthday wishes are granted! 💖";
      }
      if (celebrationBanner) celebrationBanner.classList.remove('hidden');
      if (replayBtn) replayBtn.classList.remove('hidden');

      // Rapid-Fire Fireworks Barrage
      if (window.triggerFireworksExplosion) {
        window.triggerFireworksExplosion();
        setTimeout(() => window.triggerFireworksExplosion(), 800);
      }

      // Multiple Massive Confetti Cannons
      if (window.triggerConfettiExplosion) {
        window.triggerConfettiExplosion(window.innerWidth * 0.25, window.innerHeight * 0.45, 90);
        window.triggerConfettiExplosion(window.innerWidth * 0.50, window.innerHeight * 0.40, 150);
        window.triggerConfettiExplosion(window.innerWidth * 0.75, window.innerHeight * 0.45, 90);
      }

      if (window.playSound && window.playSound.chime) {
        window.playSound.chime();
      }

      // Swarm of balloons rising from bottom
      for (let b = 0; b < 18; b++) {
        setTimeout(() => {
          spawnCelebrationBalloons(window.innerWidth * (0.1 + Math.random() * 0.8), 2);
        }, b * 160);
      }
    }
  }

  function spawnCelebrationBalloons(originX, count = 3) {
    const container = document.getElementById('balloon-container');
    if (!container) return;

    const balloonIcons = ['🎈', '💖', '💕', '🍓', '✨', '🌸', '👑', '🎂', '🥳'];
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'poppable-balloon';
      b.textContent = balloonIcons[Math.floor(Math.random() * balloonIcons.length)];
      b.style.fontSize = `${Math.random() * 1.5 + 1.8}rem`;
      const offset = (Math.random() * 140) - 70;
      b.style.left = `${Math.max(5, Math.min(window.innerWidth - 40, originX + offset))}px`;
      b.style.animationDuration = `${Math.random() * 4 + 7}s`;
      container.appendChild(b);

      setTimeout(() => {
        if (b.parentNode) b.remove();
      }, 12000);
    }
  }

  candles.forEach(candle => {
    candle.addEventListener('click', () => blowOutCandle(candle));
  });

  // Replay Celebration
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      blownCount = 0;
      candles.forEach(c => {
        c.classList.remove('blown');
        const smoke = c.querySelector('.smoke-puff-wrapper');
        if (smoke) smoke.innerHTML = '';
      });
      if (celebrationBanner) celebrationBanner.classList.add('hidden');
      replayBtn.classList.add('hidden');
      if (instruction) {
        instruction.textContent = "Make a wish, my love! Tap each candle one by one to blow the flames! ✨";
      }
      hideFlankingCats();
    });
  }
}

/* ==========================================================================
   5. RELATIONSHIP LOVE COUNTER (SINCE 6TH JUNE 2025)
   ========================================================================== */
function initLoveCounter() {
  const daysElem = document.getElementById('days-count');
  if (!daysElem) return;

  const startDate = new Date('2025-06-06T00:00:00');

  function update() {
    const now = new Date();
    const diffMs = Math.max(0, now - startDate);

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const hoursElem = document.getElementById('hours-count');
    const minsElem = document.getElementById('minutes-count');
    const secsElem = document.getElementById('seconds-count');

    if (daysElem) daysElem.textContent = totalDays.toLocaleString();
    if (hoursElem) hoursElem.textContent = totalHours.toLocaleString();
    if (minsElem) minsElem.textContent = totalMinutes.toLocaleString();
    if (secsElem) secsElem.textContent = totalSeconds.toLocaleString();
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   6. CUPID'S BOW & ARROW GAME (SYNCHRONIZED BOW PHYSICS, EASY HIT, ENVELOPE LOOP)
   ========================================================================== */
function initCupidArchery() {
  const shootBtn = document.getElementById('shoot-arrow-btn');
  const arrow = document.getElementById('cupid-arrow');
  const bowRig = document.getElementById('bow-arrow-rig');
  const bowStringPath = document.getElementById('bow-string-svg-path');
  const bowLimbPath = document.getElementById('bow-limb-path');
  const bowLimbShadow = document.getElementById('bow-limb-shadow');
  const bowTipLeft = document.getElementById('bow-tip-left');
  const bowTipRight = document.getElementById('bow-tip-right');
  const bowSvg = document.getElementById('cupid-bow-svg');
  const aimTrajectory = document.getElementById('aim-trajectory');
  const missIndicator = document.getElementById('archery-miss-indicator');
  const targetHeartBox = document.getElementById('target-heart-box');
  const targetBeatingHeart = document.getElementById('target-beating-heart');
  const envelopeWrapper = document.getElementById('envelope-popup-wrapper');
  const envelope = document.getElementById('romantic-envelope');
  const letterUnfolded = document.getElementById('romantic-letter-unfolded');
  const packLetterBtn = document.getElementById('pack-letter-btn');
  const hintText = document.getElementById('archery-hint-text');
  const archeryStage = document.getElementById('archery-stage');

  if (!shootBtn || !arrow || !archeryStage) return;

  let isShooting = false;
  let hasWon = false;
  let isDraggingBow = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let currentAngle = 0;
  let currentPower = 0;
  let flightAnimId = null;

  // Dynamically flex the bow limbs, tips, and string in perfect physical sync
  function updateBowFlex(pullX, pullY) {
    const tipDeflect = pullY * 0.14;
    const stringNotchX = 80 + pullX * 0.4;
    const stringNotchY = 70 + pullY;

    // 1. Dynamic bowstring
    if (bowStringPath) {
      bowStringPath.setAttribute('d', `M 14 ${70 + tipDeflect} Q ${stringNotchX} ${stringNotchY} 146 ${70 + tipDeflect}`);
    }

    // 2. Dynamic bow limbs flexing under tension
    const limbD = `M 14 ${70 + tipDeflect} C 32 ${20 + tipDeflect * 0.8}, 56 16, 80 20 C 104 16, 128 ${20 + tipDeflect * 0.8}, 146 ${70 + tipDeflect}`;
    if (bowLimbPath) bowLimbPath.setAttribute('d', limbD);
    if (bowLimbShadow) bowLimbShadow.setAttribute('d', limbD);

    // 3. Tip golden caps track limb ends
    if (bowTipLeft) bowTipLeft.setAttribute('cy', `${70 + tipDeflect}`);
    if (bowTipRight) bowTipRight.setAttribute('cy', `${70 + tipDeflect}`);
  }

  // Restore bow limbs, tips, and string to neutral rest
  function resetBowToRest() {
    if (bowStringPath) bowStringPath.setAttribute('d', 'M 14 70 Q 80 70 146 70');
    const restD = 'M 14 70 C 32 20, 56 14, 80 22 C 104 14, 128 20, 146 70';
    if (bowLimbPath) bowLimbPath.setAttribute('d', restD);
    if (bowLimbShadow) bowLimbShadow.setAttribute('d', restD);
    if (bowTipLeft) bowTipLeft.setAttribute('cy', '70');
    if (bowTipRight) bowTipRight.setAttribute('cy', '70');
    if (bowSvg) bowSvg.style.transform = '';
  }

  // Bowstring release twang & spring recoil animation
  function playBowRecoil() {
    // Frame 1: snap forward past resting tension
    if (bowStringPath) bowStringPath.setAttribute('d', 'M 14 70 Q 80 58 146 70');
    if (bowSvg) bowSvg.style.transform = 'translateY(-2px)';

    setTimeout(() => {
      // Frame 2: rebound backward
      if (bowStringPath) bowStringPath.setAttribute('d', 'M 14 70 Q 80 74 146 70');
      if (bowSvg) bowSvg.style.transform = 'translateY(1px)';

      setTimeout(() => {
        // Frame 3: settle to rest
        resetBowToRest();
      }, 55);
    }, 45);
  }

  // Instant heart pop helper
  function popHeartDirectly() {
    if (hasWon) return;
    hasWon = true;
    isShooting = false;

    // Reset bowstring & bow flex
    resetBowToRest();
    if (aimTrajectory) aimTrajectory.classList.remove('active');

    // Position arrow right into heart center
    if (arrow && archeryStage && targetHeartBox) {
      const stageRect = archeryStage.getBoundingClientRect();
      const targetRect = targetHeartBox.getBoundingClientRect();
      arrow.style.transition = 'all 0.15s ease-out';
      arrow.style.position = 'absolute';
      arrow.style.left = `${(targetRect.left + targetRect.width / 2 - stageRect.left) - 14}px`;
      arrow.style.top = `${(targetRect.top + targetRect.height / 2 - stageRect.top) - 30}px`;
      arrow.style.transform = 'scale(1.15) rotate(0deg)';
      arrow.style.opacity = '1';
    }

    handleHit();
  }

  function fireArrow(aimAngleDeg = 0, aimPower = 40) {
    if (isShooting || hasWon) return;
    isShooting = true;

    // Twang sound
    if (window.playSound && window.playSound.twang) {
      window.playSound.twang();
    } else if (window.playSound && window.playSound.arrow) {
      window.playSound.arrow();
    }

    // Play string recoil & reset aim trajectory
    playBowRecoil();
    if (aimTrajectory) aimTrajectory.classList.remove('active');

    // Starting position relative to archeryStage
    const stageRect = archeryStage.getBoundingClientRect();
    const arrowRect = arrow.getBoundingClientRect();

    arrow.style.transition = 'none';
    arrow.style.position = 'absolute';

    let curX = (arrowRect.left + arrowRect.width / 2) - stageRect.left;
    let curY = arrowRect.top - stageRect.top;

    arrow.style.left = `${curX - 14}px`;
    arrow.style.top = `${curY}px`;
    arrow.style.transform = `rotate(${aimAngleDeg}deg)`;

    function stepFlight() {
      const currentArrowRect = arrow.getBoundingClientRect();
      const currentTargetRect = targetHeartBox ? targetHeartBox.getBoundingClientRect() : null;

      if (currentTargetRect) {
        const targetMidX = currentTargetRect.left + currentTargetRect.width / 2;
        const targetMidY = currentTargetRect.top + currentTargetRect.height / 2;

        // Sweet Cupid Homing: aggressively and smoothly guides arrow towards the moving heart!
        const steer = (targetMidX - (curX + stageRect.left)) * 0.55;
        curX += steer;
        curY -= 20;

        arrow.style.left = `${curX - 14}px`;
        arrow.style.top = `${curY}px`;

        // Dynamically tilt arrow tip slightly towards the target
        const angle = Math.max(-25, Math.min(25, (targetMidX - (curX + stageRect.left)) * 0.4));
        arrow.style.transform = `rotate(${angle}deg)`;

        // Direct Hit! When arrow reaches target altitude (generous hit zone):
        if (currentArrowRect.top <= currentTargetRect.bottom + 55) {
          cancelAnimationFrame(flightAnimId);
          arrow.style.left = `${(targetMidX - stageRect.left) - 14}px`;
          arrow.style.top = `${(targetMidY - stageRect.top) - 30}px`;
          arrow.style.transform = 'scale(1.15) rotate(0deg)';
          handleHit();
          return;
        }
      } else {
        curY -= 20;
        arrow.style.top = `${curY}px`;
      }

      // Reached top -> direct hit guaranteed
      if (curY <= -20) {
        cancelAnimationFrame(flightAnimId);
        popHeartDirectly();
        return;
      }

      flightAnimId = requestAnimationFrame(stepFlight);
    }

    flightAnimId = requestAnimationFrame(stepFlight);
  }

  function handleHit() {
    hasWon = true;
    isShooting = false;

    // Celebratory effects
    if (targetHeartBox) targetHeartBox.classList.add('heart-hit');

    if (window.playSound && window.playSound.pop) window.playSound.pop();
    if (window.playSound && window.playSound.chime) window.playSound.chime();

    const rect = targetBeatingHeart ? targetBeatingHeart.getBoundingClientRect() : { left: window.innerWidth / 2, top: 200 };
    if (window.triggerConfettiExplosion) {
      window.triggerConfettiExplosion(rect.left + 25, rect.top + 25, 80);
    }

    if (hintText) {
      hintText.textContent = "💘 DIRECT HIT! Cupid's arrow pierced my heart! Tap the envelope below! ✨";
      hintText.style.color = '#c9184a';
    }
    shootBtn.textContent = '💌 Heart Captured! Open Your Envelope!';
    shootBtn.disabled = true;
    shootBtn.style.opacity = '0.9';

    // Reveal 3D Envelope Popup
    if (envelopeWrapper) {
      envelopeWrapper.classList.remove('hidden');
      setTimeout(() => {
        envelopeWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
    }
  }

  function handleMiss() {
    if (window.playSound && window.playSound.miss) {
      window.playSound.miss();
    }

    arrow.classList.add('missed');

    // Show floating miss notification
    if (missIndicator) {
      missIndicator.classList.remove('hidden');
      missIndicator.style.animation = 'none';
      missIndicator.offsetHeight; // trigger reflow
      missIndicator.style.animation = '';
      setTimeout(() => {
        missIndicator.classList.add('hidden');
      }, 1400);
    }

    if (hintText) {
      hintText.textContent = "💨 Missed! Time your shot as the heart glides past! Try again!";
      hintText.style.color = '#b7094c';
    }
    shootBtn.textContent = "🏹 Try Again (Drag Bow or Tap)";

    // Smoothly reload arrow back onto bow after 600ms
    setTimeout(() => {
      arrow.classList.remove('missed');
      arrow.style.transition = 'opacity 0.25s ease';
      arrow.style.opacity = '0';

      setTimeout(() => {
        arrow.style.position = '';
        arrow.style.left = '';
        arrow.style.top = '';
        arrow.style.transform = 'translateY(18px)';
        arrow.style.transition = 'transform 0.25s ease-out, opacity 0.25s ease-out';
        arrow.style.opacity = '1';

        requestAnimationFrame(() => {
          arrow.style.transform = '';
          setTimeout(() => {
            arrow.style.transition = '';
            isShooting = false;
            if (!hasWon && hintText) {
              hintText.textContent = "🎯 Drag bow down & release when the heart aligns!";
              hintText.style.color = '';
            }
          }, 250);
        });
      }, 200);
    }, 600);
  }

  // Shoot button click: smooth synchronized draw-and-release animation
  shootBtn.addEventListener('click', () => {
    if (isShooting || hasWon) return;

    isShooting = true;
    let drawProgress = 0;
    const drawDuration = 120;
    const startDraw = performance.now();

    function animateDraw(now) {
      const elapsed = now - startDraw;
      drawProgress = Math.min(1, elapsed / drawDuration);
      const ease = 0.5 - Math.cos(drawProgress * Math.PI) / 2;
      const pullY = ease * 36;

      updateBowFlex(0, pullY);
      arrow.style.transform = `translateY(${pullY}px)`;

      if (drawProgress < 1) {
        requestAnimationFrame(animateDraw);
      } else {
        isShooting = false;
        fireArrow(0, 45);
      }
    }

    requestAnimationFrame(animateDraw);
  });

  // Direct Tap on the Moving Heart: pops immediately on Android touch and desktop click!
  if (targetHeartBox) {
    targetHeartBox.addEventListener('click', (e) => {
      e.stopPropagation();
      popHeartDirectly();
    });
    targetHeartBox.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      popHeartDirectly();
    }, { passive: true });
  }

  // Drag-to-Aim Bow Mechanism (Supports Android touch & mouse via pointer events)
  if (bowRig) {
    function onBowDragStart(e) {
      if (isShooting || hasWon) return;
      isDraggingBow = true;
      const pt = (e.touches && e.touches[0]) ? e.touches[0] : e;
      dragStartX = pt.clientX;
      dragStartY = pt.clientY;
      currentAngle = 0;
      currentPower = 0;
      if (aimTrajectory) aimTrajectory.classList.add('active');
    }

    function onBowDragMove(e) {
      if (!isDraggingBow) return;
      const pt = (e.touches && e.touches[0]) ? e.touches[0] : e;
      const deltaX = pt.clientX - dragStartX;
      const deltaY = pt.clientY - dragStartY;

      const pullY = Math.max(0, Math.min(52, deltaY));
      const pullX = Math.max(-42, Math.min(42, deltaX));

      currentAngle = -Math.atan2(pullX, Math.max(22, pullY)) * (180 / Math.PI);
      currentAngle = Math.max(-28, Math.min(28, currentAngle));
      currentPower = pullY;

      updateBowFlex(pullX, pullY);
      arrow.style.transform = `translate(${pullX * 0.4}px, ${pullY}px) rotate(${currentAngle}deg)`;

      if (aimTrajectory) {
        aimTrajectory.style.transform = `translateX(-50%) rotate(${currentAngle}deg)`;
      }

      if (hintText && pullY > 15) {
        hintText.textContent = "🎯 Aiming... Release to shoot Cupid's arrow!";
      }
    }

    function onBowDragEnd() {
      if (!isDraggingBow) return;
      isDraggingBow = false;

      if (currentPower < 8) {
        resetBowToRest();
        arrow.style.transform = '';
        if (aimTrajectory) aimTrajectory.classList.remove('active');
        return;
      }

      fireArrow(currentAngle, currentPower);
    }

    bowRig.addEventListener('pointerdown', onBowDragStart);
    window.addEventListener('pointermove', onBowDragMove);
    window.addEventListener('pointerup', onBowDragEnd);
    window.addEventListener('pointercancel', onBowDragEnd);

    bowRig.addEventListener('touchstart', onBowDragStart, { passive: true });
    window.addEventListener('touchmove', onBowDragMove, { passive: true });
    window.addEventListener('touchend', onBowDragEnd);
  }

  // Tap on Envelope to Unseal and Slide Out Letter
  if (envelope) {
    envelope.addEventListener('click', () => {
      envelope.classList.add('unsealed');
      if (window.playSound && window.playSound.pop) {
        window.playSound.pop();
      }

      setTimeout(() => {
        if (letterUnfolded) {
          letterUnfolded.classList.remove('hidden');
          letterUnfolded.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400);
    });
  }

  // Put Letter Back in Envelope & Reset Archery Game Loop
  if (packLetterBtn) {
    packLetterBtn.addEventListener('click', () => {
      if (letterUnfolded) letterUnfolded.classList.add('hidden');
      if (envelope) envelope.classList.remove('unsealed');
      if (envelopeWrapper) envelopeWrapper.classList.add('hidden');

      isShooting = false;
      hasWon = false;
      if (targetHeartBox) targetHeartBox.classList.remove('heart-hit');

      if (flightAnimId) cancelAnimationFrame(flightAnimId);

      arrow.style.position = '';
      arrow.style.left = '';
      arrow.style.top = '';
      arrow.style.transform = '';
      arrow.style.opacity = '1';
      arrow.classList.remove('missed');

      resetBowToRest();
      if (aimTrajectory) aimTrajectory.classList.remove('active');

      shootBtn.disabled = false;
      shootBtn.style.opacity = '1';
      shootBtn.textContent = "🏹 Release Cupid's Arrow!";
      if (hintText) {
        hintText.textContent = "🎯 Drag bow down & release when the heart aligns!";
        hintText.style.color = '';
      }

      if (archeryStage) archeryStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

/* ==========================================================================
   7. AMBIENT BACKGROUND PARTICLES & BALLOONS (STRICTLY IN BACKGROUND)
   ========================================================================== */
function initPoppableBalloons() {
  const container = document.getElementById('balloon-container');
  if (!container) return;

  const balloonIcons = ['🎈', '💖', '💕', '💗', '🍓', '✨', '🌸', '🧸', '🎂'];

  function spawnBackgroundParticle() {
    if (document.hidden) return;
    const item = document.createElement('div');
    item.className = 'poppable-balloon';

    const icon = balloonIcons[Math.floor(Math.random() * balloonIcons.length)];
    item.textContent = icon;
    item.style.fontSize = `${Math.random() * 1.5 + 1.6}rem`;
    item.style.left = `${Math.random() * 92 + 4}%`;
    item.style.animationDuration = `${Math.random() * 5 + 8}s`;

    container.appendChild(item);

    setTimeout(() => {
      if (item.parentNode) item.remove();
    }, 14000);
  }

  setInterval(spawnBackgroundParticle, 1200);
}

/* ==========================================================================
   8. HER 23 PORTRAITS GALLERY & COUPLE SLIDESHOW (FROM captions.js & localStorage)
   ========================================================================== */
function initGalleryAndSlideshow() {
  // 1. Render 23 Solo Portraits directly from captions.js
  const portraitGrid = document.getElementById('portrait-grid') || document.getElementById('her-photo-grid');
  let portraitsToRender = (typeof HER_PORTRAITS !== 'undefined') ? HER_PORTRAITS.slice(0, 23) : [];

  // Sync with localStorage so editor stays in sync
  try {
    localStorage.setItem('chandana_solo_captions', JSON.stringify(portraitsToRender));
  } catch (e) { }

  if (portraitGrid && portraitsToRender.length > 0) {
    portraitGrid.innerHTML = '';
    portraitsToRender.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'portrait-card';
      card.innerHTML = `
        <div class="portrait-img-box">
          <img src="${item.src}" alt="Dr. Chandana Portrait ${index + 1}" class="portrait-img" loading="lazy">
        </div>
        <p class="portrait-caption">${item.caption || "Pure magic ✨"}</p>
      `;
      portraitGrid.appendChild(card);
    });
  }

  // 2. Render Couple Slideshow - STRICTLY NO CAPTIONS! Just keep them sliding!
  const slidesTrack = document.getElementById('slides-track');
  const dotsContainer = document.getElementById('slideshow-dots');
  const prevBtn = document.getElementById('slide-prev-btn');
  const nextBtn = document.getElementById('slide-next-btn');

  if (slidesTrack && typeof COUPLE_PHOTOS !== 'undefined') {
    slidesTrack.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    COUPLE_PHOTOS.forEach((photo, idx) => {
      const slide = document.createElement('div');
      slide.className = `slide-item ${idx === 0 ? 'active' : ''}`;
      // Clean sliding image without any caption overlay
      slide.innerHTML = `
        <img src="${photo.src}" alt="Our Memory ${idx + 1}" class="slide-img" loading="lazy">
      `;
      slidesTrack.appendChild(slide);

      if (dotsContainer) {
        const dot = document.createElement('span');
        dot.className = `dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      }
    });

    let currentSlide = 0;
    const slides = slidesTrack.querySelectorAll('.slide-item');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

    function goToSlide(n) {
      if (slides.length === 0) return;
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

      currentSlide = (n + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Touch Swipe for Android
    let touchStartX = 0;
    slidesTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    slidesTrack.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(currentSlide - 1);
        }
      }
    }, { passive: true });

    // Smooth auto-slide every 4.5 seconds
    setInterval(() => {
      if (!document.hidden) {
        goToSlide(currentSlide + 1);
      }
    }, 4500);
  }

  // Render Heartfelt Notes
  const notesGrid = document.getElementById('notes-grid');
  if (notesGrid && typeof HEARTFELT_NOTES !== 'undefined') {
    notesGrid.innerHTML = '';
    HEARTFELT_NOTES.forEach(note => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.innerHTML = `
        <h4 class="note-title">${note.title}</h4>
        <p class="note-body">${note.content}</p>
      `;
      notesGrid.appendChild(card);
    });
  }
}

/* ==========================================================================
   9. BACKGROUND PARTICLES & CELEBRATION CANVASES
   ========================================================================== */
function initBackgroundSparkles() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const sparkles = [];
  const sparkleCount = Math.min(35, Math.floor(window.innerWidth / 35));

  for (let i = 0; i < sparkleCount; i++) {
    sparkles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 14 + 10,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: Math.sin(Math.random() * Math.PI) * 0.25,
      char: ['✨', '🌸', '💖', '🎀'][Math.floor(Math.random() * 4)],
      opacity: Math.random() * 0.6 + 0.3
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparkles.forEach(s => {
      s.y -= s.speedY;
      s.x += s.speedX;
      if (s.y < -20) {
        s.y = canvas.height + 10;
        s.x = Math.random() * canvas.width;
      }
      ctx.globalAlpha = s.opacity;
      ctx.font = `${s.size}px serif`;
      ctx.fillText(s.char, s.x, s.y);
    });
    requestAnimationFrame(loop);
  }
  loop();
}

function initConfettiAndFireworks() {
  const confCanvas = document.getElementById('confetti-canvas');
  const fireCanvas = document.getElementById('fireworks-canvas');
  if (!confCanvas || !fireCanvas) return;

  const confCtx = confCanvas.getContext('2d');
  const fireCtx = fireCanvas.getContext('2d');

  function resize() {
    confCanvas.width = window.innerWidth;
    confCanvas.height = window.innerHeight;
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const confettiColors = ['#ff4d6d', '#ff8fa3', '#ffd1dc', '#ffd700', '#ffffff', '#c58882'];
  let confettis = [];

  window.triggerConfettiExplosion = function (originX, originY, count = 60) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      confettis.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: Math.random() * 8 + 4,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        opacity: 1
      });
    }
  };

  let fireworks = [];
  window.triggerFireworksExplosion = function () {
    for (let f = 0; f < 6; f++) {
      setTimeout(() => {
        const targetX = Math.random() * (window.innerWidth * 0.7) + window.innerWidth * 0.15;
        const targetY = Math.random() * (window.innerHeight * 0.45) + 60;
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        for (let i = 0; i < 50; i++) {
          const angle = (Math.PI * 2 * i) / 50;
          const speed = Math.random() * 7 + 3;
          fireworks.push({
            x: targetX,
            y: targetY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            life: 1,
            decay: Math.random() * 0.02 + 0.015
          });
        }
      }, f * 250);
    }
  };

  function loop() {
    confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    for (let i = confettis.length - 1; i >= 0; i--) {
      const c = confettis[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.22;
      c.opacity -= 0.008;

      if (c.opacity <= 0) {
        confettis.splice(i, 1);
        continue;
      }

      confCtx.globalAlpha = Math.max(0, c.opacity);
      confCtx.fillStyle = c.color;
      confCtx.fillRect(c.x, c.y, c.size, c.size * 0.6);
    }

    fireCtx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const p = fireworks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.life -= p.decay;

      if (p.life <= 0) {
        fireworks.splice(i, 1);
        continue;
      }

      fireCtx.globalAlpha = p.life;
      fireCtx.fillStyle = p.color;
      fireCtx.beginPath();
      fireCtx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      fireCtx.fill();
    }

    requestAnimationFrame(loop);
  }
  loop();
}
