/**
 * CHANDANA'S 23RD BIRTHDAY - INTERACTIVE EXPERIENCE
 * Features:
 * - Web Audio API synthesizer: Romantic background music box & Birthday song
 * - Interactive Cake Ceremony: Candle blowing, knife slice, smoke, slice serving
 * - Particle Systems: Confetti, Fireworks, Floating Sparkles & Cursor trail
 * - Photo Showcases: Her 25 Polaroid Photos & Couple Scrapbook Slider
 * - Interactive Love Jar & Origami Notes
 * - Wax-sealed Love Letter & Gift Box
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoveCounter();
  initBackgroundSparkles();
  initConfettiAndFireworks();
  initAudioEngine();
  initCakeCeremony();
  initLoveJar();
  initHerGallery();
  initCoupleScrapbook();
  initEnvelopeAndLetter();
  initGiftBox();
  initBackToTop();
});

/* ==========================================================================
   1. LOVE COUNTER (1 Year, 3 Months & Live Seconds)
   ========================================================================== */
function initLoveCounter() {
  // Approximate anniversary: 1 year, 3 months ago from Sep 2026 -> June 18, 2025
  const startDate = new Date('2025-06-18T00:00:00');

  function update() {
    const now = new Date();
    const diffMs = Math.max(0, now - startDate);

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const daysElem = document.getElementById('days-count');
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
   2. WEB AUDIO API SYNTHESIZER (No external audio file dependencies needed!)
   Plays:
   - Soft Romantic Music Box Ambient loop
   - "Happy Birthday To You" chime melody upon cake cutting
   - Candle blow whoosh, knife slice chime, cracker pops, heart clinks
   ========================================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let ambientInterval = null;

function initAudioEngine() {
  const toggleBtn = document.getElementById('music-toggle-btn');
  const btnText = document.getElementById('music-btn-text');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  toggleBtn.addEventListener('click', () => {
    const ctx = getAudioContext();
    if (!isMusicPlaying) {
      startAmbientMusic();
      isMusicPlaying = true;
      btnText.textContent = 'Pause Music ⏸';
      toggleBtn.classList.add('playing');
    } else {
      stopAmbientMusic();
      isMusicPlaying = false;
      btnText.textContent = 'Play Romantic Music 🎵';
      toggleBtn.classList.remove('playing');
    }
  });

  // Expose sound effects to window
  window.playSound = {
    blow: playCandleBlowSFX,
    slice: playSliceSFX,
    pop: playCrackerPopSFX,
    chime: playChimeSFX,
    birthdaySong: playHappyBirthdaySong
  };

  function playBellNote(freq, startTime, duration = 1.2, gainLevel = 0.15) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm harmonics
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);
    const gain2 = audioCtx.createGain();
    gain2.gain.setValueAtTime(gainLevel * 0.3, startTime);
    gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(audioCtx.destination);
    gain2.connect(audioCtx.destination);

    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  // Soft romantic music box arpeggios
  const romanticScale = [
    261.63, 329.63, 392.00, 523.25, // C E G C
    293.66, 349.23, 440.00, 587.33, // D F A D
    329.63, 392.00, 493.88, 659.25, // E G B E
    349.23, 440.00, 523.25, 698.46  // F A C F
  ];

  function startAmbientMusic() {
    const ctx = getAudioContext();
    let step = 0;
    const pattern = [0, 2, 1, 3, 2, 4, 3, 5, 2, 4, 1, 3, 6, 8, 7, 9];

    ambientInterval = setInterval(() => {
      if (!isMusicPlaying || !audioCtx) return;
      const noteIdx = pattern[step % pattern.length];
      const freq = romanticScale[noteIdx % romanticScale.length];
      playBellNote(freq, audioCtx.currentTime, 1.4, 0.1);
      step++;
    }, 420);
  }

  function stopAmbientMusic() {
    if (ambientInterval) {
      clearInterval(ambientInterval);
      ambientInterval = null;
    }
  }

  function playCandleBlowSFX() {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  function playSliceSFX() {
    const ctx = getAudioContext();
    playBellNote(587.33, ctx.currentTime, 0.6, 0.15); // D5
    playBellNote(880.00, ctx.currentTime + 0.08, 0.8, 0.12); // A5
  }

  function playCrackerPopSFX() {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }

  function playChimeSFX() {
    const ctx = getAudioContext();
    playBellNote(659.25, ctx.currentTime, 0.5, 0.12); // E5
    playBellNote(783.99, ctx.currentTime + 0.07, 0.7, 0.15); // G5
  }

  function playHappyBirthdaySong() {
    const ctx = getAudioContext();
    // Notes for "Happy Birthday To You":
    // G4 G4 A4 G4 C5 B4 | G4 G4 A4 G4 D5 C5 | G4 G4 G5 E5 C5 B4 A4 | F5 F5 E5 C5 D5 C5
    const song = [
      { note: 392.00, dur: 0.35, pause: 0.1 },  // Hap-
      { note: 392.00, dur: 0.25, pause: 0.05 }, // py
      { note: 440.00, dur: 0.6,  pause: 0.1 },  // birth-
      { note: 392.00, dur: 0.6,  pause: 0.1 },  // day
      { note: 523.25, dur: 0.6,  pause: 0.1 },  // to
      { note: 493.88, dur: 1.1,  pause: 0.3 },  // you
      
      { note: 392.00, dur: 0.35, pause: 0.1 },  // Hap-
      { note: 392.00, dur: 0.25, pause: 0.05 }, // py
      { note: 440.00, dur: 0.6,  pause: 0.1 },  // birth-
      { note: 392.00, dur: 0.6,  pause: 0.1 },  // day
      { note: 587.33, dur: 0.6,  pause: 0.1 },  // to
      { note: 523.25, dur: 1.1,  pause: 0.3 },  // you
      
      { note: 392.00, dur: 0.35, pause: 0.1 },  // Hap-
      { note: 392.00, dur: 0.25, pause: 0.05 }, // py
      { note: 783.99, dur: 0.6,  pause: 0.1 },  // birth-
      { note: 659.25, dur: 0.6,  pause: 0.1 },  // day
      { note: 523.25, dur: 0.6,  pause: 0.1 },  // dear
      { note: 493.88, dur: 0.6,  pause: 0.1 },  // Chan-
      { note: 440.00, dur: 1.0,  pause: 0.3 },  // da-na
      
      { note: 698.46, dur: 0.35, pause: 0.1 },  // Hap-
      { note: 698.46, dur: 0.25, pause: 0.05 }, // py
      { note: 659.25, dur: 0.6,  pause: 0.1 },  // birth-
      { note: 523.25, dur: 0.6,  pause: 0.1 },  // day
      { note: 587.33, dur: 0.8,  pause: 0.1 },  // to
      { note: 523.25, dur: 1.6,  pause: 0.5 },  // you!
    ];

    let cursor = ctx.currentTime + 0.1;
    song.forEach(item => {
      playBellNote(item.note, cursor, item.dur + 0.4, 0.22);
      cursor += item.dur + item.pause;
    });
  }
}

/* ==========================================================================
   3. BACKGROUND PARTICLES & CURSOR SPARKLES
   ========================================================================== */
function initBackgroundSparkles() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleIcons = ['🌸', '✨', '💖', '💕', '⭐'];

  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 14 + 10,
      icon: particleIcons[Math.floor(Math.random() * particleIcons.length)],
      speedY: Math.random() * 0.8 + 0.3,
      speedX: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.6 + 0.2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.5
    });
  }

  // Cursor trail
  const cursorSparks = [];
  window.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.4) {
      cursorSparks.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 12 + 8,
        icon: Math.random() > 0.5 ? '✨' : '💖',
        life: 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2 - 0.5
      });
    }
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Floating petals/hearts
    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      if (p.y > height + 20) p.y = -20;
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.icon, 0, 0);
      ctx.restore();
    });

    // Cursor sparks
    for (let i = cursorSparks.length - 1; i >= 0; i--) {
      const s = cursorSparks[i];
      s.x += s.speedX;
      s.y += s.speedY;
      s.life -= 0.025;

      if (s.life <= 0) {
        cursorSparks.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = s.life;
      ctx.font = `${s.size}px serif`;
      ctx.fillText(s.icon, s.x, s.y);
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   4. FULL-SCREEN CONFETTI & FIREWORKS SYSTEM
   ========================================================================== */
let triggerConfettiExplosion = () => {};
let triggerFireworksExplosion = () => {};

function initConfettiAndFireworks() {
  const confCanvas = document.getElementById('confetti-canvas');
  const fireCanvas = document.getElementById('fireworks-canvas');
  if (!confCanvas || !fireCanvas) return;

  const confCtx = confCanvas.getContext('2d');
  const fireCtx = fireCanvas.getContext('2d');

  function resize() {
    confCanvas.width = fireCanvas.width = window.innerWidth;
    confCanvas.height = fireCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Confetti Pieces
  let confettis = [];
  const confettiColors = ['#ff3366', '#ff758c', '#ffccd5', '#ffd700', '#70e000', '#00b4d8', '#ffffff'];

  triggerConfettiExplosion = function(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 180) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 5;
      confettis.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 9 + 5,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        tilt: Math.random() * 10,
        tiltSpeed: Math.random() * 0.2 + 0.05,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'heart'
      });
    }
  };

  // Fireworks rockets and particles
  let fireworks = [];

  triggerFireworksExplosion = function() {
    for (let f = 0; f < 5; f++) {
      setTimeout(() => {
        const targetX = Math.random() * (window.innerWidth * 0.7) + window.innerWidth * 0.15;
        const targetY = Math.random() * (window.innerHeight * 0.45) + 80;
        createFireworkBurst(targetX, targetY);
        if (window.playSound) window.playSound.pop();
      }, f * 350);
    }
  };

  function createFireworkBurst(x, y) {
    const pCount = 70;
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    for (let i = 0; i < pCount; i++) {
      const angle = (Math.PI * 2 * i) / pCount;
      const speed = Math.random() * 8 + 3;
      fireworks.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        life: 1,
        decay: Math.random() * 0.015 + 0.015,
        trail: []
      });
    }
  }

  function loop() {
    // Render confetti
    confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    for (let i = confettis.length - 1; i >= 0; i--) {
      const c = confettis[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.28; // gravity
      c.vx *= 0.98;
      c.tilt += c.tiltSpeed;
      c.opacity -= 0.004;

      if (c.y > confCanvas.height || c.opacity <= 0) {
        confettis.splice(i, 1);
        continue;
      }

      confCtx.save();
      confCtx.globalAlpha = c.opacity;
      confCtx.fillStyle = c.color;
      confCtx.translate(c.x, c.y);
      confCtx.rotate(c.tilt);

      if (c.shape === 'heart') {
        confCtx.font = `${c.size * 1.5}px serif`;
        confCtx.fillText('💖', 0, 0);
      } else {
        confCtx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 1.3);
      }
      confCtx.restore();
    }

    // Render fireworks
    fireCtx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    fireCtx.fillRect(0, 0, fireCanvas.width, fireCanvas.height);
    fireCtx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);

    for (let i = fireworks.length - 1; i >= 0; i--) {
      const p = fireworks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // light gravity
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= p.decay;

      if (p.life <= 0) {
        fireworks.splice(i, 1);
        continue;
      }

      fireCtx.save();
      fireCtx.globalAlpha = p.life;
      fireCtx.fillStyle = p.color;
      fireCtx.beginPath();
      fireCtx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      fireCtx.fill();
      fireCtx.restore();
    }

    requestAnimationFrame(loop);
  }

  loop();
}

/* ==========================================================================
   5. INTERACTIVE CAKE CEREMONY (BLOW CANDLES & CUT SLICE)
   ========================================================================== */
function initCakeCeremony() {
  const candles = document.querySelectorAll('.candle');
  const blowAllBtn = document.getElementById('blow-candles-btn');
  const cutCakeBtn = document.getElementById('cut-cake-btn');
  const replayBtn = document.getElementById('replay-ceremony-btn');
  const cakeKnife = document.getElementById('cake-knife');
  const cakeBody = document.getElementById('cake-body');
  const servedSlice = document.getElementById('served-slice');
  const celebrationBanner = document.getElementById('celebration-banner');
  const instruction = document.getElementById('cake-instruction');

  let blownCandlesCount = 0;
  const totalCandles = candles.length;
  let isSliced = false;

  // Candle blow interaction (click or tap)
  candles.forEach(candle => {
    candle.addEventListener('click', () => {
      blowOutCandle(candle);
    });

    // Also support hover blow on desktop
    candle.addEventListener('mouseenter', () => {
      blowOutCandle(candle);
    });
  });

  function blowOutCandle(candle) {
    if (candle.classList.contains('blown')) return;
    candle.classList.add('blown');
    blownCandlesCount++;

    if (window.playSound) window.playSound.blow();

    checkAllCandlesBlown();
  }

  // Blow All Button
  blowAllBtn.addEventListener('click', () => {
    candles.forEach((candle, idx) => {
      setTimeout(() => {
        blowOutCandle(candle);
      }, idx * 120);
    });
  });

  function checkAllCandlesBlown() {
    if (blownCandlesCount >= totalCandles) {
      instruction.textContent = "All candles are blown! ✨ Pick up the knife and cut your birthday cake! 🎂";
      blowAllBtn.classList.add('hidden');
      cutCakeBtn.classList.remove('hidden');
      cakeKnife.classList.add('visible');

      // Small celebration burst
      triggerConfettiExplosion(window.innerWidth / 2, window.innerHeight * 0.45, 60);
      if (window.playSound) window.playSound.chime();
    }
  }

  // Knife cutting interaction
  cutCakeBtn.addEventListener('click', performCakeCut);
  cakeKnife.addEventListener('click', performCakeCut);

  function performCakeCut() {
    if (isSliced) return;
    isSliced = true;

    instruction.textContent = "Happy 23rd Birthday Chandana! Making your wishes come true! ✨";
    cakeKnife.classList.add('cutting');

    if (window.playSound) {
      window.playSound.slice();
    }

    setTimeout(() => {
      cakeBody.classList.add('sliced');
      servedSlice.classList.add('active');
      cutCakeBtn.classList.add('hidden');
      replayBtn.classList.remove('hidden');
      celebrationBanner.classList.remove('hidden');

      // GRAND CELEBRATION!
      triggerConfettiExplosion(window.innerWidth / 2, window.innerHeight * 0.4, 250);
      triggerFireworksExplosion();

      // Recurring celebration showers
      const celebrationInterval = setInterval(() => {
        triggerConfettiExplosion(Math.random() * window.innerWidth, window.innerHeight * 0.35, 80);
      }, 1400);

      // Stop recurring confetti after 9 seconds
      setTimeout(() => clearInterval(celebrationInterval), 9000);

      // Play sweet Happy Birthday melody
      if (window.playSound) {
        window.playSound.birthdaySong();
      }
    }, 600);
  }

  // Replay Ceremony
  replayBtn.addEventListener('click', () => {
    isSliced = false;
    blownCandlesCount = 0;
    candles.forEach(c => c.classList.remove('blown'));
    cakeBody.classList.remove('sliced');
    servedSlice.classList.remove('active');
    cakeKnife.classList.remove('cutting');
    cakeKnife.classList.remove('visible');
    celebrationBanner.classList.add('hidden');
    replayBtn.classList.add('hidden');
    blowAllBtn.classList.remove('hidden');
    instruction.textContent = "Tap or hover over each candle to blow it out, or tap 'Blow All Candles' to make your 23rd wish!";
  });
}

/* ==========================================================================
   6. INTERACTIVE LOVE JAR ("WHY YOU'RE MY FAVOURITE")
   ========================================================================== */
function initLoveJar() {
  const loveJar = document.getElementById('love-jar');
  const nextNoteBtn = document.getElementById('next-note-btn');
  const cardTitle = document.getElementById('note-card-title');
  const cardText = document.getElementById('note-card-text');

  const loveNotes = [
    {
      title: "Reason #1: That Unmatched Smile ✨",
      text: "You're studying to be a BDS doctor, but honestly, your smile is already a masterpiece that cures everything!"
    },
    {
      title: "Reason #2: Your Caring Heart 💖",
      text: "The way you check in on me, worry about my meals, and put so much empathy into your patients and loved ones."
    },
    {
      title: "Reason #3: 1 Year & 3 Months of Us 🌸",
      text: "Every day with you feels as exciting and fluttery as day one. You are my safe place and favorite destination."
    },
    {
      title: "Reason #4: Your Hard Work in BDS 🩺",
      text: "Watching you balance lectures, clinical postings, teeth carvings, and revision with so much dedication inspires me constantly."
    },
    {
      title: "Reason #5: The Cutest Pouts & Laughs 🤭",
      text: "Whenever you get dramatic, laugh at my silly jokes, or make that adorable face—my heart just melts completely."
    },
    {
      title: "Reason #6: You're My Best Friend 💍",
      text: "I don't just love you as my girlfriend—you are the first person I want to tell everything to, good or bad."
    },
    {
      title: "Reason #7: You Look Stunning in Everything 👑",
      text: "Whether you're in scrubs, a gorgeous dress, traditional attire, or sleepy morning pajamas—you are effortlessly the prettiest girl."
    },
    {
      title: "Reason #8: Our Inside Jokes & Memories 💌",
      text: "15 months filled with shared secret glances, late night phone calls, food cravings, and memories I cherish forever."
    }
  ];

  let currentNoteIdx = 0;

  function pullNote() {
    currentNoteIdx = (currentNoteIdx + 1) % loveNotes.length;
    const note = loveNotes[currentNoteIdx];

    cardTitle.textContent = note.title;
    cardText.textContent = `"${note.text}"`;

    if (window.playSound) window.playSound.chime();
    triggerConfettiExplosion(window.innerWidth / 2, window.innerHeight * 0.6, 30);
  }

  loveJar.addEventListener('click', pullNote);
  nextNoteBtn.addEventListener('click', pullNote);
}

/* ==========================================================================
   7. HER POLAROID GALLERY (25 PHOTOS) & FULLSCREEN LIGHTBOX
   ========================================================================== */
function initHerGallery() {
  const grid = document.getElementById('her-photo-grid');
  const filterChips = document.querySelectorAll('.filter-chip');
  if (!grid) return;

  // The 25 photos of Chandana
  const photos = [
    { src: 'WhatsApp Image 2026-09-18 at 1.14.56 PM.jpeg', caption: 'The smile that lights up my whole universe 🌟', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.14.57 PM (2).jpeg', caption: 'Pure grace & birthday elegance ✨', category: 'glamour' },
    { src: 'WhatsApp Image 2026-09-18 at 1.14.58 PM (1).jpeg', caption: 'My gorgeous future Dr. Chandana 🩺', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.14.58 PM (2).jpeg', caption: 'Captivating eyes and endless charm 💖', category: 'glamour' },
    { src: 'WhatsApp Image 2026-09-18 at 1.14.58 PM.jpeg', caption: 'Cutest candid expression ever 🤭', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.14.59 PM.jpeg', caption: 'Radiating pure sunshine & joy ☀️', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.00 PM (1).jpeg', caption: 'Princess vibes, 23 & fabulous 👑', category: 'glamour' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.02 PM (1).jpeg', caption: 'How did I get this lucky? 💕', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.03 PM (1).jpeg', caption: 'Sweetest moments frozen in time 📸', category: 'glamour' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.03 PM (2).jpeg', caption: 'Effortlessly stunning from every angle ✨', category: 'glamour' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.03 PM.jpeg', caption: 'The queen of my heart 👸', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.04 PM (1).jpeg', caption: 'Gentle warmth and endless beauty 🌸', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.04 PM.jpeg', caption: 'My favorite portrait of you 🎨', category: 'glamour' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.05 PM (1).jpeg', caption: 'Happy, glowing, and thriving 🌟', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.05 PM.jpeg', caption: 'Every picture of you tells a love story 💌', category: 'glamour' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.06 PM (1).jpeg', caption: 'Natural beauty at its finest 💫', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.06 PM.jpeg', caption: 'The prettiest smile in the room 💖', category: 'glamour' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.07 PM (1).jpeg', caption: 'Charming me since day one ✨', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.07 PM.jpeg', caption: 'Perfection in a single frame 🌹', category: 'glamour' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.11 PM.jpeg', caption: 'Dazzling on your special day 🎉', category: 'glamour' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.12 PM (1).jpeg', caption: 'Forever my sweetest blessing 🎀', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.15.12 PM.jpeg', caption: 'Beauty, brains, and kindness combined 🩺', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.17.20 PM.jpeg', caption: 'Dreamy eyes and tender heart 🕊️', category: 'glamour' },
    { src: 'WhatsApp Image 2026-09-18 at 1.17.21 PM (1).jpeg', caption: 'Celebrating 23 wonderful years of you 🎂', category: 'favorites' },
    { src: 'WhatsApp Image 2026-09-18 at 1.17.21 PM.jpeg', caption: 'My forever birthday girl Chandana 💕', category: 'glamour' }
  ];

  function renderPhotos(filter = 'all') {
    grid.innerHTML = '';
    const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter);

    filtered.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      
      // Slight romantic tilt between -3.5deg and 3.5deg
      const randomTilt = ((idx % 5) - 2) * 1.6;
      card.style.transform = `rotate(${randomTilt}deg)`;

      card.innerHTML = `
        <div class="polaroid-img-wrapper">
          <img src="${encodeURI(p.src)}" alt="Chandana - Photo ${idx + 1}" loading="lazy">
        </div>
        <div class="polaroid-caption">${p.caption}</div>
        <button class="polaroid-heart-btn" title="Send love">💖</button>
      `;

      // Open Lightbox on card click
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('polaroid-heart-btn')) {
          e.stopPropagation();
          triggerConfettiExplosion(e.clientX, e.clientY, 25);
          if (window.playSound) window.playSound.chime();
          return;
        }
        openLightbox(photos.indexOf(p));
      });

      grid.appendChild(card);
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderPhotos(chip.dataset.filter);
    });
  });

  renderPhotos('all');

  // Lightbox Modal Logic
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const overlay = document.getElementById('lightbox-overlay');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const heartBtn = document.getElementById('lightbox-heart-btn');

  let activePhotoIndex = 0;

  function openLightbox(index) {
    activePhotoIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function updateLightbox() {
    const photo = photos[activePhotoIndex];
    lightboxImg.src = encodeURI(photo.src);
    lightboxCaption.innerHTML = `
      <h3>Chandana's 23rd Birthday ✨</h3>
      <p>${photo.caption}</p>
    `;
  }

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', closeLightbox);

  prevBtn.addEventListener('click', () => {
    activePhotoIndex = (activePhotoIndex - 1 + photos.length) % photos.length;
    updateLightbox();
  });

  nextBtn.addEventListener('click', () => {
    activePhotoIndex = (activePhotoIndex + 1) % photos.length;
    updateLightbox();
  });

  heartBtn.addEventListener('click', (e) => {
    triggerConfettiExplosion(e.clientX, e.clientY, 50);
    if (window.playSound) window.playSound.chime();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}

/* ==========================================================================
   8. COUPLE SCRAPBOOK SLIDER ('US/' FOLDER)
   ========================================================================== */
function initCoupleScrapbook() {
  const track = document.getElementById('couple-photo-track');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');
  const captionTitle = document.getElementById('memory-caption-title');
  const captionText = document.getElementById('memory-caption-text');
  if (!track) return;

  const couplePhotos = [
    { src: 'us/WhatsApp Image 2026-09-18 at 1.14.56 PM (1).jpeg', title: 'Chapter 1: The Beginning 💕', text: 'When two hearts clicked and a beautiful adventure started 15 months ago.' },
    { src: 'us/WhatsApp Image 2026-09-18 at 1.14.57 PM (1).jpeg', title: 'Sweetest Dates & Warm Smiles ☕', text: 'No place is ever boring as long as you are sitting across from me.' },
    { src: 'us/WhatsApp Image 2026-09-18 at 1.15.00 PM.jpeg', title: 'Walking Hand In Hand 👫', text: 'Through sunny days, dental exam stress, and every little victory.' },
    { src: 'us/WhatsApp Image 2026-09-18 at 1.15.01 PM (1).jpeg', title: 'Comfort & Peace In Your Arms 🌸', text: 'Where the world goes quiet and everything feels just right.' },
    { src: 'us/WhatsApp Image 2026-09-18 at 1.15.01 PM.jpeg', title: 'Our Favourite Memories ✨', text: 'Every picture captures just a fraction of the love we share.' },
    { src: 'us/WhatsApp Image 2026-09-18 at 1.15.02 PM.jpeg', title: 'Side By Side, Always 💖', text: 'Cheering for your BDS dreams while building our future together.' },
    { src: 'us/WhatsApp Image 2026-09-18 at 1.15.03 PM (3).jpeg', title: 'Unbreakable Bond 💍', text: '1 year and 3 months down, an entire lifetime of togetherness to go.' },
    { src: 'us/WhatsApp Image 2026-09-18 at 1.15.07 PM (2).jpeg', title: 'You & Me Against The World 🌟', text: 'My favourite travel partner, food buddy, and confidante.' },
    { src: 'us/WhatsApp Image 2026-09-18 at 1.15.08 PM.jpeg', title: 'Pure Happiness Captured 📸', text: 'Because loving you is the easiest, most natural thing in the world.' },
    { src: 'us/WhatsApp Image 2026-09-18 at 1.15.10 PM.jpeg', title: 'Forever My Person 💌', text: 'Happy 23rd Birthday to my forever love, Chandana!' }
  ];

  let currentSlide = 0;

  couplePhotos.forEach((item, idx) => {
    // Track slide
    const slide = document.createElement('div');
    slide.className = 'scrapbook-slide';
    slide.innerHTML = `
      <div class="scrapbook-img-box">
        <img src="${encodeURI(item.src)}" alt="Memory ${idx + 1}" loading="lazy">
      </div>
    `;
    track.appendChild(slide);

    // Dot
    const dot = document.createElement('span');
    dot.className = `dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    document.querySelectorAll('.slider-dots .dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });

    // Update caption
    captionTitle.textContent = couplePhotos[currentSlide].title;
    captionText.textContent = `"${couplePhotos[currentSlide].text}"`;
  }

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + couplePhotos.length) % couplePhotos.length;
    goToSlide(currentSlide);
  });

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % couplePhotos.length;
    goToSlide(currentSlide);
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) nextBtn.click();
    if (diff < -50) prevBtn.click();
  });
}

/* ==========================================================================
   9. ROMANTIC LOVE LETTER & WAX SEAL
   ========================================================================== */
function initEnvelopeAndLetter() {
  const waxSeal = document.getElementById('wax-seal');
  const envelopeFlap = document.getElementById('envelope-flap');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const letterPaper = document.getElementById('letter-paper');

  if (!waxSeal || !letterPaper) return;

  function unsealLetter() {
    envelopeFlap.style.transform = 'rotateX(180deg)';
    envelopeFlap.style.zIndex = '1';
    waxSeal.style.transform = 'translateX(-50%) translateY(-20px) scale(0.8)';
    waxSeal.style.opacity = '0';

    if (window.playSound) window.playSound.slice();

    setTimeout(() => {
      envelopeWrapper.style.display = 'none';
      letterPaper.classList.remove('hidden');
      triggerConfettiExplosion(window.innerWidth / 2, window.innerHeight * 0.7, 80);
    }, 450);
  }

  waxSeal.addEventListener('click', unsealLetter);
  envelopeWrapper.addEventListener('click', unsealLetter);
}

/* ==========================================================================
   10. VIRTUAL BIRTHDAY GIFT BOX UNWRAPPING
   ========================================================================== */
function initGiftBox() {
  const giftBox = document.getElementById('gift-box');
  const vouchersGrid = document.getElementById('vouchers-grid');
  if (!giftBox || !vouchersGrid) return;

  let isOpened = false;

  giftBox.addEventListener('click', () => {
    if (isOpened) return;
    isOpened = true;

    giftBox.classList.add('opened');
    if (window.playSound) window.playSound.pop();

    triggerConfettiExplosion(window.innerWidth / 2, window.innerHeight * 0.75, 120);

    setTimeout(() => {
      vouchersGrid.classList.remove('hidden');
    }, 400);
  });
}

/* ==========================================================================
   11. BACK TO TOP SCROLL
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
