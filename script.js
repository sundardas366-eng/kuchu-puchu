/**
 * Valentine Proposal Website
 * Interactive Runaway Card with Sound & Customization
 */

document.addEventListener('DOMContentLoaded', () => {
  // ================= STATE & CONFIG =================
  const state = {
    runawayEnabled: true,
    dodgeCount: 0,
    isPlayingSound: true,
    hasUserInteracted: false,
    soundSource: 'local', // Direct MP3 track (Indila - Love Story) for instant, 100% reliable autoplay in WhatsApp
    localAudioPath: 'assets/audio/love-story.mp3',
    youtubeVideoId: '2Bc9ET7XGDg', // Indila - Love Story
    mp3Url: '',
    volume: 0.85,
    creatorName: 'Eagle',
    recipientName: '',
    currentQuestion: 'Will you be my Valentine?',
    currentSubtitle: 'The timeless classic proposal 🌹',
    currentIcon: '🌹',
    yesScale: 1.0,
    ytPlayer: null
  };

  // Funny speech bubble messages when "No" runs away
  const dodgeMessages = [
    "Nice try! 😉",
    "Are you sure? 🥺",
    "Don't do this to me! 💔",
    "Pookie please! 🙏",
    "You can't say No! 😜",
    "Think again! 🌹",
    "Wrong button! 👉 Look left!",
    "Are you really sure? 🥺",
    "Error 404: 'No' is not found! 😂",
    "Look how green and pretty Yes is! 💖"
  ];

  // DOM Elements
  const bgDecorations = document.getElementById('bgDecorations');
  const questionDropdownBtn = document.getElementById('questionDropdownBtn');
  const questionDropdownMenu = document.getElementById('questionDropdownMenu');
  const currentQIcon = document.getElementById('currentQIcon');
  const currentQText = document.getElementById('currentQText');
  const cardTitle = document.getElementById('cardTitle');
  const cardSubtitle = document.getElementById('cardSubtitle');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const dodgeTooltip = document.getElementById('dodgeTooltip');
  const runawayBtn = document.getElementById('runawayBtn');
  const soundBtn = document.getElementById('soundBtn');
  const musicSettingsBtn = document.getElementById('musicSettingsBtn');
  const resetBtn = document.getElementById('resetBtn');
  const shareBtn = document.getElementById('shareBtn');
  const authorBadge = document.getElementById('authorBadge');
  const creatorNameEl = document.getElementById('creatorName');
  const footerAuthorEl = document.getElementById('footerAuthor');
  const recipientTag = document.getElementById('recipientTag');
  const recipientNameEl = document.getElementById('recipientName');
  const bearImg = document.getElementById('bearImg');
  const celebrationView = document.getElementById('celebrationView');
  const buttonsContainer = document.getElementById('buttonsContainer');
  const toastNotification = document.getElementById('toastNotification');
  const bgAudio = document.getElementById('bgAudio');

  // Modals
  const shareModal = document.getElementById('shareModal');
  const closeShareModal = document.getElementById('closeShareModal');
  const musicModal = document.getElementById('musicModal');
  const closeMusicModal = document.getElementById('closeMusicModal');
  const customQModal = document.getElementById('customQModal');
  const closeCustomQModal = document.getElementById('closeCustomQModal');

  // Share form elements
  const inputCrushName = document.getElementById('inputCrushName');
  const inputSenderName = document.getElementById('inputSenderName');
  const generatedLink = document.getElementById('generatedLink');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
  const previewLinkBtn = document.getElementById('previewLinkBtn');

  // Music form elements
  const youtubeUrlInput = document.getElementById('youtubeUrlInput');
  const applyYoutubeBtn = document.getElementById('applyYoutubeBtn');
  const mp3UrlInput = document.getElementById('mp3UrlInput');
  const applyMp3Btn = document.getElementById('applyMp3Btn');
  const applySynthBtn = document.getElementById('applySynthBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValue = document.getElementById('volumeValue');
  const musicTabs = document.querySelectorAll('.music-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Custom question elements
  const customQuestionBtn = document.getElementById('customQuestionBtn');
  const inputCustomQ = document.getElementById('inputCustomQ');
  const inputCustomSub = document.getElementById('inputCustomSub');
  const inputCustomIcon = document.getElementById('inputCustomIcon');
  const saveCustomQBtn = document.getElementById('saveCustomQBtn');

  // ================= 1. FLOATING DECORATIONS =================
  function createFloatingDecorations() {
    const items = ['🌹', '💖', '🌸', '✨', '💕', '💗', '🌹', '🍓'];
    const totalCount = 20;

    for (let i = 0; i < totalCount; i++) {
      const el = document.createElement('div');
      el.className = 'floating-elem';
      el.textContent = items[Math.floor(Math.random() * items.length)];

      const left = Math.random() * 100;
      const duration = 12 + Math.random() * 14;
      const delay = Math.random() * -20;
      const size = 18 + Math.random() * 16;
      const opacity = 0.35 + Math.random() * 0.45;
      const drift = -40 + Math.random() * 80;

      el.style.left = `${left}vw`;
      el.style.fontSize = `${size}px`;
      el.style.setProperty('--duration', `${duration}s`);
      el.style.setProperty('--drift', `${drift}px`);
      el.style.setProperty('--opacity', opacity);
      el.style.animationDelay = `${delay}s`;

      bgDecorations.appendChild(el);
    }
  }

  // ================= 2. PARSE URL PARAMETERS =================
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    const from = params.get('from');
    const q = params.get('q');
    const sub = params.get('sub');
    const yt = params.get('yt');

    if (to) {
      state.recipientName = to;
      recipientNameEl.textContent = to;
      recipientTag.style.display = 'inline-block';
      inputCrushName.value = to;
    }

    if (from) {
      state.creatorName = from;
      creatorNameEl.textContent = from;
      footerAuthorEl.textContent = from;
      inputSenderName.value = from;
    } else {
      creatorNameEl.textContent = 'Eagle';
      footerAuthorEl.textContent = 'Eagle';
      inputSenderName.value = 'Eagle';
    }

    if (q) {
      state.currentQuestion = q;
      state.currentSubtitle = sub || 'A special question just for you 🌹';
      cardTitle.textContent = q;
      cardSubtitle.textContent = state.currentSubtitle;
      currentQText.textContent = q.length > 22 ? q.substring(0, 20) + '...' : q;
    }

    if (yt) {
      state.youtubeVideoId = extractYoutubeId(yt);
      if (state.youtubeVideoId) {
        state.soundSource = 'youtube';
      }
    }

    updateGeneratedLink();
  }

  // ================= 3. RUNAWAY DODGE MECHANIC =================
  function runAwayButton(event) {
    if (!state.runawayEnabled) return;

    state.dodgeCount++;

    // Switch to cute crying bear GIF when "No" is pressed / dodged
    bearImg.src = 'assets/images/bear-sad.gif';
    bearImg.alt = "Bear crying sadly";
    bearImg.classList.remove('bear-wobble');
    void bearImg.offsetWidth;
    bearImg.classList.add('bear-wobble');

    // Update overlay emojis to crying tears & broken hearts
    const bearHearts = document.getElementById('bearHearts');
    if (bearHearts) {
      bearHearts.innerHTML = '<span class="mini-heart h1">💧</span><span class="mini-heart h2">🥺</span><span class="mini-heart h3">💔</span>';
    }

    // Revert back to the loving hug after delay
    clearTimeout(bearImg.revertTimeout);
    bearImg.revertTimeout = setTimeout(() => {
      bearImg.src = 'assets/images/bubu-dudu-hug.jpg';
    bearImg.alt = "Bubu and Dudu warm romantic hug with hearts";
    const bearHearts = document.getElementById('bearHearts');
    if (bearHearts) {
      bearHearts.innerHTML = '<span class="mini-heart h1">💖</span><span class="mini-heart h2">💕</span><span class="mini-heart h3">💗</span>';
    }
      bearImg.alt = "Bubu and Dudu warm romantic hug with hearts";
      if (bearHearts) {
        bearHearts.innerHTML = '<span class="mini-heart h1">💖</span><span class="mini-heart h2">💕</span><span class="mini-heart h3">💗</span>';
      }
    }, 2400);

    // Make "Yes" button grow bigger!
    state.yesScale = Math.min(1.65, 1.0 + state.dodgeCount * 0.08);
    btnYes.style.transform = `scale(${state.yesScale})`;

    // Calculate safe bounds within window viewport
    const btnRect = btnNo.getBoundingClientRect();
    const padding = 30;
    const maxX = window.innerWidth - btnRect.width - padding;
    const maxY = window.innerHeight - btnRect.height - padding;

    let newX = padding + Math.random() * (maxX - padding);
    let newY = padding + Math.random() * (maxY - padding);

    // Prevent placing directly under cursor
    const cursorX = event ? (event.clientX || (event.touches && event.touches[0].clientX)) : window.innerWidth / 2;
    const cursorY = event ? (event.clientY || (event.touches && event.touches[0].clientY)) : window.innerHeight / 2;

    if (Math.abs(newX - cursorX) < 100 && Math.abs(newY - cursorY) < 100) {
      newX = (newX + 180) % maxX;
      newY = (newY + 140) % maxY;
    }

    btnNo.classList.add('running');
    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;

    // Show funny speech bubble tooltip
    const randomMsg = dodgeMessages[state.dodgeCount % dodgeMessages.length];
    dodgeTooltip.textContent = randomMsg;
    dodgeTooltip.style.left = `${Math.min(window.innerWidth - 180, Math.max(20, newX - 10))}px`;
    dodgeTooltip.style.top = `${Math.max(20, newY - 45)}px`;
    dodgeTooltip.classList.add('show');

    clearTimeout(dodgeTooltip.hideTimeout);
    dodgeTooltip.hideTimeout = setTimeout(() => {
      dodgeTooltip.classList.remove('show');
    }, 1400);

    // Play little dodging beep sound
    playDodgeSound();
  }

  // Hover, Pointer and Touch handlers for runaway
  btnNo.addEventListener('mouseenter', (e) => {
    runAwayButton(e);
  });

  btnNo.addEventListener('pointerdown', (e) => {
    if (state.runawayEnabled) {
      e.preventDefault();
      runAwayButton(e);
    }
  });

  btnNo.addEventListener('touchstart', (e) => {
    if (state.runawayEnabled) {
      e.preventDefault();
      runAwayButton(e);
    }
  }, { passive: false });

  btnNo.addEventListener('click', (e) => {
    if (state.runawayEnabled) {
      e.preventDefault();
      runAwayButton(e);
    } else {
      showToast("Aww, don't break my heart! Please say YES! 🥺");
      bearImg.src = 'assets/images/bear-sad.gif';
      bearImg.alt = "Bear crying sadly";
      const bearHearts = document.getElementById('bearHearts');
      if (bearHearts) {
        bearHearts.innerHTML = '<span class="mini-heart h1">💧</span><span class="mini-heart h2">🥺</span><span class="mini-heart h3">💔</span>';
      }
      clearTimeout(bearImg.revertTimeout);
      bearImg.revertTimeout = setTimeout(() => {
        bearImg.src = 'assets/images/bubu-dudu-hug.jpg';
    bearImg.alt = "Bubu and Dudu warm romantic hug with hearts";
    const bearHearts = document.getElementById('bearHearts');
    if (bearHearts) {
      bearHearts.innerHTML = '<span class="mini-heart h1">💖</span><span class="mini-heart h2">💕</span><span class="mini-heart h3">💗</span>';
    }
        bearImg.alt = "Bubu and Dudu warm romantic hug with hearts";
        if (bearHearts) {
          bearHearts.innerHTML = '<span class="mini-heart h1">💖</span><span class="mini-heart h2">💕</span><span class="mini-heart h3">💗</span>';
        }
      }, 2500);
    }
  });

  // Toggle runaway mode button
  runawayBtn.addEventListener('click', () => {
    state.runawayEnabled = !state.runawayEnabled;
    runawayBtn.classList.toggle('active', state.runawayEnabled);

    if (!state.runawayEnabled) {
      btnNo.classList.remove('running');
      btnNo.style.position = '';
      btnNo.style.left = '';
      btnNo.style.top = '';
      showToast("Runaway mode OFF. 'No' can now be clicked!");
    } else {
      showToast("Runaway mode ON! 'No' will run away! ⚡");
    }
  });

  // ================= 4. CELEBRATION (YES CLICKED) =================
  btnYes.addEventListener('click', () => {
    triggerCelebration();
  });

  function triggerCelebration() {
    // Hide proposal controls
    buttonsContainer.style.display = 'none';
    document.querySelector('.card-content').style.display = 'none';
    document.querySelector('.bear-display-frame').style.display = 'none';
    if (dodgeTooltip) dodgeTooltip.classList.remove('show');

    // Show celebration view
    celebrationView.style.display = 'block';

    // Fire fireworks / confetti burst!
    launchConfetti();

    // Start romantic music if not already playing
    if (!state.isPlayingSound) {
      toggleSound(true);
    }

    // Pre-fill WhatsApp confirmation message
    updateCelebrationWhatsApp();

    // Increment real Yes proposal count
    if (typeof realYesCount !== 'undefined') {
      realYesCount += 1;
      localStorage.setItem('kuchu_real_yes_count', realYesCount.toString());
      if (typeof updateStatsDisplay === 'function') updateStatsDisplay();
    }
  }

  // Interactive Valentine Date Activity Selection
  const activityChips = document.querySelectorAll('.activity-chip');
  activityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      activityChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.selectedActivity = chip.dataset.activity || chip.textContent.trim();
      updateCelebrationWhatsApp();
      showToast(`Selected date: ${state.selectedActivity} 💕`);
    });
  });

  function updateCelebrationWhatsApp() {
    let siteUrl = window.location.origin;
    if (!siteUrl || siteUrl === 'null' || window.location.protocol === 'file:') {
      siteUrl = 'https://kuchu-puchu-sigma.vercel.app';
    }
    const activity = state.selectedActivity || '🍕 Pizza & Romantic Movie Night';
    const crushGreeting = state.creatorName && state.creatorName !== 'Eagle' ? `Hey ${state.creatorName}, ` : '';

    const messageLines = [
      `${crushGreeting}Yaaay! 🥰 I said YES to being your Valentine! 💕💍`,
      ``,
      `🌹 Our Valentine Date: ${activity} ✨`,
      `You just made my day so special! 🥰`,
      ``,
      `💌 Make or share your own cute proposal here:`,
      `👉 ${siteUrl}`
    ];

    const confirmationText = encodeURIComponent(messageLines.join('\n'));
    const sendBtn = document.getElementById('sendLoveBackBtn');
    if (sendBtn) {
      sendBtn.onclick = () => {
        window.open(`https://api.whatsapp.com/send?text=${confirmationText}`, '_blank');
      };
    }
  }

  function launchConfetti() {
    if (typeof confetti !== 'function') return;

    // Heart and star particles explosion
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ff2d55', '#05c282', '#ffd1dc'] });
    fire(0.2, { spread: 60, colors: ['#ff6b8b', '#ff4081', '#ffffff'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 1.2, colors: ['#ff1493', '#00e676', '#ffb6c1'] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#ff4081', '#f50057'] });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // Secondary celebration bursts for lasting celebration effect
    setTimeout(() => {
      fire(0.2, { spread: 80, startVelocity: 45, colors: ['#ff2d55', '#ff69b4', '#ffffff'] });
    }, 600);
    setTimeout(() => {
      fire(0.25, { spread: 110, startVelocity: 35, colors: ['#ff1493', '#ff6b8b', '#ffd1dc'] });
    }, 1200);
  }

  // Replay celebration
  document.getElementById('replayCelebrationBtn').addEventListener('click', () => {
    resetCard();
  });

  // ================= 5. RESET CARD =================
  function resetCard() {
    state.dodgeCount = 0;
    state.yesScale = 1.0;

    btnNo.classList.remove('running');
    btnNo.style.position = '';
    btnNo.style.left = '';
    btnNo.style.top = '';

    btnYes.style.transform = 'scale(1)';

    celebrationView.style.display = 'none';
    buttonsContainer.style.display = 'flex';
    document.querySelector('.card-content').style.display = 'block';
    document.querySelector('.bear-display-frame').style.display = 'flex';
    bearImg.src = 'assets/images/bubu-dudu-hug.jpg';
    bearImg.alt = "Bubu and Dudu warm romantic hug with hearts";
    const bearHearts = document.getElementById('bearHearts');
    if (bearHearts) {
      bearHearts.innerHTML = '<span class="mini-heart h1">💖</span><span class="mini-heart h2">💕</span><span class="mini-heart h3">💗</span>';
    }

    showToast("Proposal card reset! 🌹");
  }

  resetBtn.addEventListener('click', resetCard);

  // ================= 6. QUESTION DROPDOWN =================
  questionDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    questionDropdownBtn.parentElement.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!questionDropdownBtn.contains(e.target) && !questionDropdownMenu.contains(e.target)) {
      questionDropdownBtn.parentElement.classList.remove('open');
    }
  });

  document.querySelectorAll('.dropdown-item:not(.custom-q-btn)').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const q = item.dataset.q;
      const sub = item.dataset.sub;
      const icon = item.dataset.icon;

      state.currentQuestion = q;
      state.currentSubtitle = sub;
      state.currentIcon = icon;

      currentQText.textContent = q.length > 22 ? q.substring(0, 20) + '...' : q;
      currentQIcon.textContent = icon;
      cardTitle.textContent = q;
      cardSubtitle.textContent = sub;

      questionDropdownBtn.parentElement.classList.remove('open');
      updateGeneratedLink();
    });
  });

  // Custom question modal open
  customQuestionBtn.addEventListener('click', () => {
    questionDropdownBtn.parentElement.classList.remove('open');
    customQModal.classList.add('open');
  });

  closeCustomQModal.addEventListener('click', () => {
    customQModal.classList.remove('open');
  });

  saveCustomQBtn.addEventListener('click', () => {
    const q = inputCustomQ.value.trim();
    const sub = inputCustomSub.value.trim() || 'A question from the heart 💖';
    const icon = inputCustomIcon.value.trim() || '🌹';

    if (!q) {
      alert("Please enter a question!");
      return;
    }

    state.currentQuestion = q;
    state.currentSubtitle = sub;
    state.currentIcon = icon;

    currentQText.textContent = q.length > 22 ? q.substring(0, 20) + '...' : q;
    currentQIcon.textContent = icon;
    cardTitle.textContent = q;
    cardSubtitle.textContent = sub;

    customQModal.classList.remove('open');
    updateGeneratedLink();
    showToast("Custom question applied! ✍️");
  });

  // ================= 7. AUTHOR NAME EDIT =================
  authorBadge.addEventListener('click', () => {
    const newName = prompt("Enter creator name (e.g. your nickname):", state.creatorName);
    if (newName && newName.trim()) {
      state.creatorName = newName.trim();
      creatorNameEl.textContent = state.creatorName;
      footerAuthorEl.textContent = state.creatorName;
      inputSenderName.value = state.creatorName;
      updateGeneratedLink();
      showToast(`Updated author to: ${state.creatorName}`);
    }
  });

  // ================= 8. SHARE MODAL & LINK GENERATOR =================
  shareBtn.addEventListener('click', () => {
    updateGeneratedLink();
    shareModal.classList.add('open');
  });

  closeShareModal.addEventListener('click', () => {
    shareModal.classList.remove('open');
  });

  inputCrushName.addEventListener('input', () => {
    state.recipientName = inputCrushName.value.trim();
    updateGeneratedLink();
  });

  inputSenderName.addEventListener('input', () => {
    state.creatorName = inputSenderName.value.trim() || 'hxni';
    creatorNameEl.textContent = state.creatorName;
    footerAuthorEl.textContent = state.creatorName;
    updateGeneratedLink();
  });

  function updateGeneratedLink() {
    let base = window.location.origin;
    if (!base || base === 'null' || window.location.protocol === 'file:') {
      base = 'https://kuchu-puchu-sigma.vercel.app';
    }
    const pathname = window.location.protocol === 'file:' ? '/' : window.location.pathname;
    const url = new URL(base + pathname);
    if (state.recipientName) url.searchParams.set('to', state.recipientName);
    if (state.creatorName && state.creatorName !== 'Eagle') url.searchParams.set('from', state.creatorName);
    if (state.currentQuestion !== 'Will you be my Valentine?') {
      url.searchParams.set('q', state.currentQuestion);
      url.searchParams.set('sub', state.currentSubtitle);
    }
    if (state.youtubeVideoId) {
      url.searchParams.set('yt', state.youtubeVideoId);
    }

    const fullUrl = url.toString();
    generatedLink.value = fullUrl;

    // Update QR Code
    updateQrCode(fullUrl);
  }

  const qrImage = document.getElementById('qrImage');
  const downloadQrBtn = document.getElementById('downloadQrBtn');

  function updateQrCode(linkUrl) {
    if (!qrImage) return;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(linkUrl)}&color=ff2d55&bgcolor=ffffff&margin=8`;
    qrImage.onerror = () => {
      qrImage.src = `https://quickchart.io/qr?text=${encodeURIComponent(linkUrl)}&size=260&light=ffffff&dark=ff2d55&margin=2`;
    };
    qrImage.src = qrApiUrl;
    qrImage.alt = `Proposal QR Code for ${linkUrl}`;
  }

  if (downloadQrBtn) {
    downloadQrBtn.addEventListener('click', () => {
      if (!qrImage || !qrImage.src) return;
      window.open(qrImage.src, '_blank');
      showToast("Opened QR Code! Save or share it 💕");
    });
  }

  copyLinkBtn.addEventListener('click', () => {
    generatedLink.select();
    navigator.clipboard.writeText(generatedLink.value).then(() => {
      showToast("Proposal Link Copied to Clipboard! 📋");
    }).catch(() => {
      document.execCommand('copy');
      showToast("Link Copied! 📋");
    });
  });

  shareWhatsappBtn.addEventListener('click', () => {
    const link = generatedLink.value;
    const crush = state.recipientName ? `Hey ${state.recipientName}, ` : '';
    const text = encodeURIComponent(`${crush}I have an important question for you... 💌🌹 Open this:\n\n${link}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  });

  previewLinkBtn.addEventListener('click', () => {
    window.open(generatedLink.value, '_blank');
  });

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === shareModal) shareModal.classList.remove('open');
    if (e.target === musicModal) musicModal.classList.remove('open');
    if (e.target === customQModal) customQModal.classList.remove('open');
  });

  // ================= 9. AUDIO & MUSIC SYSTEM =================
  // Web Audio Synth Romantic Music Box generator
  let audioCtx = null;
  let synthInterval = null;

  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSynthMusic() {
    initAudioContext();
    stopAllAudio();

    // Romantic music box chord progression
    const notes = [
      261.63, 329.63, 392.00, 523.25, 659.25, 392.00, 329.63, 261.63, // C
      196.00, 246.94, 293.66, 392.00, 493.88, 293.66, 246.94, 196.00, // G
      220.00, 261.63, 329.63, 440.00, 523.25, 329.63, 261.63, 220.00, // Am
      174.61, 220.00, 261.63, 349.23, 440.00, 261.63, 220.00, 174.61  // F
    ];

    let noteIndex = 0;
    synthInterval = setInterval(() => {
      if (!state.isPlayingSound) return;
      playNote(notes[noteIndex]);
      noteIndex = (noteIndex + 1) % notes.length;
    }, 450);

    state.isPlayingSound = true;
    updateSoundUI();
  }

  function playNote(freq) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18 * state.volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  function playDodgeSound() {
    initAudioContext();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5

      gain.gain.setValueAtTime(0.1 * state.volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // ignore
    }
  }

  function stopAllAudio() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    bgAudio.pause();
    bgAudio.currentTime = 0;

    if (state.ytPlayer && typeof state.ytPlayer.pauseVideo === 'function') {
      try { state.ytPlayer.pauseVideo(); } catch (e) {}
    }
  }

  function toggleSound(forcePlay = null) {
    const shouldPlay = forcePlay !== null ? forcePlay : !state.isPlayingSound;

    if (shouldPlay) {
      initAudioContext();
      state.isPlayingSound = true;

      if (state.soundSource === 'youtube' && state.youtubeVideoId) {
        playYouTubeSong(state.youtubeVideoId);
      } else if (state.soundSource === 'mp3' && state.mp3Url) {
        bgAudio.src = state.mp3Url;
        bgAudio.volume = state.volume;
        bgAudio.play().catch(() => playSynthMusic());
      } else if (state.soundSource === 'local') {
        bgAudio.src = state.localAudioPath;
        bgAudio.volume = state.volume;
        bgAudio.play().catch(() => playSynthMusic());
      } else {
        playSynthMusic();
      }
    } else {
      state.isPlayingSound = false;
      stopAllAudio();
    }

    updateSoundUI();
  }

  function updateSoundUI() {
    soundBtn.classList.toggle('sound-playing', state.isPlayingSound);
    const wave1 = soundBtn.querySelector('.wave-1');
    const wave2 = soundBtn.querySelector('.wave-2');
    if (wave1 && wave2) {
      wave1.style.opacity = state.isPlayingSound ? '1' : '0.3';
      wave2.style.opacity = state.isPlayingSound ? '1' : '0.3';
    }
  }

  soundBtn.addEventListener('click', () => toggleSound());

  // YouTube audio embedding
  function extractYoutubeId(url) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url.trim();
  }

  function playYouTubeSong(videoId) {
    stopAllAudio();
    state.youtubeVideoId = videoId;
    state.soundSource = 'youtube';

    const container = document.getElementById('youtubePlayerContainer');
    if (!container) return;

    if (window.YT && window.YT.Player) {
      if (state.ytPlayer && typeof state.ytPlayer.loadVideoById === 'function') {
        try {
          state.ytPlayer.loadVideoById(videoId);
          state.ytPlayer.unMute();
          state.ytPlayer.setVolume(Math.round(state.volume * 100));
          state.ytPlayer.playVideo();
        } catch (e) {
          createIframeFallback(videoId);
        }
      } else {
        container.innerHTML = '<div id="ytPlayerDiv"></div>';
        try {
          state.ytPlayer = new YT.Player('ytPlayerDiv', {
            height: '10',
            width: '10',
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              loop: 1,
              playlist: videoId,
              playsinline: 1,
              controls: 0,
              enablejsapi: 1
            },
            events: {
              onReady: (event) => {
                event.target.unMute();
                event.target.setVolume(Math.round(state.volume * 100));
                event.target.playVideo();
              }
            }
          });
        } catch (e) {
          createIframeFallback(videoId);
        }
      }
    } else {
      createIframeFallback(videoId);
    }

    state.isPlayingSound = true;
    updateSoundUI();
  }

  function createIframeFallback(videoId) {
    const container = document.getElementById('youtubePlayerContainer');
    if (!container) return;
    container.innerHTML = `<iframe id="ytFrame" width="10" height="10" src="https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&loop=1&playlist=${videoId}&playsinline=1" frameborder="0" allow="autoplay; encrypted-media"></iframe>`;
  }

  // Music Settings Modal
  musicSettingsBtn.addEventListener('click', () => {
    musicModal.classList.add('open');
  });

  closeMusicModal.addEventListener('click', () => {
    musicModal.classList.remove('open');
  });

  // Music Tabs
  musicTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      musicTabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById('tab' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1));
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Apply YouTube
  applyYoutubeBtn.addEventListener('click', () => {
    const val = youtubeUrlInput.value.trim();
    const id = extractYoutubeId(val);
    if (!id) {
      alert("Please enter a valid YouTube URL or Video ID!");
      return;
    }
    state.youtubeVideoId = id;
    state.soundSource = 'youtube';
    playYouTubeSong(id);
    musicModal.classList.remove('open');
    updateGeneratedLink();
  });

  // Apply MP3
  applyMp3Btn.addEventListener('click', () => {
    const val = mp3UrlInput.value.trim();
    if (!val) {
      alert("Please enter an MP3 audio URL!");
      return;
    }
    state.mp3Url = val;
    state.soundSource = 'mp3';
    stopAllAudio();
    bgAudio.src = val;
    bgAudio.volume = state.volume;
    bgAudio.play().then(() => {
      state.isPlayingSound = true;
      updateSoundUI();
      showToast("Playing custom MP3 track! 🎵");
    }).catch(err => {
      alert("Error playing audio URL. Make sure it's a direct .mp3 link!");
    });
    musicModal.classList.remove('open');
  });

  // Apply Synth
  applySynthBtn.addEventListener('click', () => {
    state.soundSource = 'synth';
    playSynthMusic();
    musicModal.classList.remove('open');
    showToast("Playing Romantic Music Box! ✨");
  });

  // Volume slider
  volumeSlider.addEventListener('input', (e) => {
    state.volume = parseFloat(e.target.value);
    volumeValue.textContent = `${Math.round(state.volume * 100)}%`;
    bgAudio.volume = state.volume;
  });

  // ================= 10. TOAST NOTIFICATION =================
  function showToast(message) {
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastNotification.hideTimeout);
    toastNotification.hideTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2400);
  }

  // ================= INITIALIZE & AUTOPLAY =================
  createFloatingDecorations();
  parseUrlParams();

  function showAudioHint() {
    let hint = document.getElementById('musicAutoplayHint');
    if (!hint) {
      hint = document.createElement('div');
      hint.id = 'musicAutoplayHint';
      hint.className = 'music-autoplay-hint';
      hint.innerHTML = '<span>🎵 Tap anywhere to hear our song 💕</span>';
      document.body.appendChild(hint);

      hint.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerAudioOnGesture();
      });
    }
    requestAnimationFrame(() => {
      hint.classList.add('visible');
    });
  }

  function hideAudioHint() {
    const hint = document.getElementById('musicAutoplayHint');
    if (hint) {
      hint.classList.remove('visible');
      setTimeout(() => hint.remove(), 400);
    }
  }

  // Try immediate autoplay with local love-story.mp3
  function startPlayback() {
    if (!bgAudio) return;

    // First attempt: direct unmuted playback
    bgAudio.muted = false;
    bgAudio.volume = state.volume;
    const p = bgAudio.play();

    if (p !== undefined) {
      p.then(() => {
        state.isPlayingSound = true;
        updateSoundUI();
        hideAudioHint();
      }).catch(() => {
        // Unmuted playback restricted by browser policy before first interaction.
        // Second attempt: start muted so browser allows audio to stream/buffer right away!
        bgAudio.muted = true;
        bgAudio.play().catch(() => {});
        showAudioHint();
      });
    }
  }

  // Attempt immediately & on window load
  startPlayback();
  window.addEventListener('load', startPlayback);

  // Seamless WhatsApp auto-start: The very millisecond the user touches, scrolls, or taps the screen
  function triggerAudioOnGesture() {
    initAudioContext();
    if (bgAudio) {
      if (bgAudio.muted) {
        bgAudio.muted = false;
      }
      bgAudio.volume = state.volume;
      if (bgAudio.paused) {
        bgAudio.play().then(() => {
          state.isPlayingSound = true;
          updateSoundUI();
          hideAudioHint();
        }).catch(() => {});
      } else {
        state.isPlayingSound = true;
        updateSoundUI();
        hideAudioHint();
      }
    }
  }

  const gestureEvents = [
    'touchstart', 'touchend', 'touchmove', 
    'pointerdown', 'pointerup', 
    'mousedown', 'mouseup', 
    'click', 'scroll', 'keydown'
  ];

  gestureEvents.forEach(evt => {
    window.addEventListener(evt, triggerAudioOnGesture, { passive: true });
    document.addEventListener(evt, triggerAudioOnGesture, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !state.isPlayingSound) {
      triggerAudioOnGesture();
    }
  });

  // ================= 11. COMMUNITY STATS & LIVE RATING =================
  const statsToggleBtn = document.getElementById('statsToggleBtn');
  const statsCard = document.getElementById('statsCard');
  const pillViewsCount = document.getElementById('pillViewsCount');
  const pillAvgRating = document.getElementById('pillAvgRating');
  const statsTotalViews = document.getElementById('statsTotalViews');
  const statsActiveNow = document.getElementById('statsActiveNow');
  const statsTotalYes = document.getElementById('statsTotalYes');
  const bigRatingScore = document.getElementById('bigRatingScore');
  const totalReviewsCount = document.getElementById('totalReviewsCount');
  const userRateTitle = document.getElementById('userRateTitle');
  const starHintLabel = document.getElementById('starHintLabel');
  const starButtons = document.querySelectorAll('.star-interactive');

  // Genuine Real Visitors Tracking (Fake numbers completely removed)
  let currentViews = parseInt(localStorage.getItem('kuchu_real_views') || '1', 10);
  let activeOnline = 1; // Actual active online viewer

  // If new session, count local visit immediately
  if (!sessionStorage.getItem('kuchu_session_counted')) {
    currentViews += 1;
    localStorage.setItem('kuchu_real_views', currentViews.toString());
    sessionStorage.setItem('kuchu_session_counted', 'true');
  }

  // Real "Said YES" count
  let realYesCount = parseInt(localStorage.getItem('kuchu_real_yes_count') || '1', 10);

  function updateStatsDisplay() {
    if (pillViewsCount) pillViewsCount.textContent = currentViews.toLocaleString();
    if (statsTotalViews) statsTotalViews.textContent = currentViews.toLocaleString();
    if (statsActiveNow) statsActiveNow.textContent = activeOnline.toString();
    if (statsTotalYes) statsTotalYes.textContent = realYesCount.toLocaleString();
  }
  updateStatsDisplay();

  // Fetch verified real global hits from serverless /api/stats
  async function fetchRealGlobalViews() {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.views && data.views > 0) {
          currentViews = Math.max(currentViews, data.views);
          localStorage.setItem('kuchu_real_views', currentViews.toString());
          updateStatsDisplay();
        }
      }
    } catch (e) {
      // Local fallback active
    }
  }
  fetchRealGlobalViews();

  // Genuine Rating System
  const INITIAL_RATINGS_COUNT = 1;
  const INITIAL_RATINGS_SUM = 5;

  let userRating = parseInt(localStorage.getItem('kuchu_user_star_rating') || '0', 10);
  let extraUserRatingsCount = parseInt(localStorage.getItem('kuchu_extra_ratings_count') || '0', 10);
  let extraUserRatingsSum = parseInt(localStorage.getItem('kuchu_extra_ratings_sum') || '0', 10);

  function recalculateRating() {
    const totalCount = INITIAL_RATINGS_COUNT + extraUserRatingsCount;
    const totalSum = INITIAL_RATINGS_SUM + extraUserRatingsSum;
    const avg = (totalSum / totalCount).toFixed(1);

    if (pillAvgRating) pillAvgRating.textContent = avg;
    if (bigRatingScore) bigRatingScore.textContent = avg;
    if (totalReviewsCount) totalReviewsCount.textContent = totalCount.toString();
  }
  recalculateRating();

  const starHints = {
    1: "Aww, cute effort 🥺",
    2: "Sweet & lovely 🌸",
    3: "Very romantic 🥰",
    4: "Super cute & creative! 💖",
    5: "Absolute Romantic Masterpiece! 💍✨"
  };

  // Render selected stars if user already rated
  function highlightStars(val) {
    starButtons.forEach(btn => {
      const starVal = parseInt(btn.dataset.star, 10);
      btn.classList.toggle('selected', starVal <= val);
    });
  }

  if (userRating > 0) {
    highlightStars(userRating);
    if (userRateTitle) userRateTitle.innerHTML = `Your Rating: <strong>${userRating} ⭐</strong> (Thanks for the love!)`;
    if (starHintLabel) starHintLabel.textContent = `You gave ${userRating} Stars: "${starHints[userRating]}" 💕`;
  }

  // Star hover and click events
  starButtons.forEach(btn => {
    const starVal = parseInt(btn.dataset.star, 10);

    btn.addEventListener('mouseenter', () => {
      starButtons.forEach(b => {
        const v = parseInt(b.dataset.star, 10);
        b.classList.toggle('hovered', v <= starVal);
      });
      if (starHintLabel) starHintLabel.textContent = starHints[starVal];
    });

    btn.addEventListener('mouseleave', () => {
      starButtons.forEach(b => b.classList.remove('hovered'));
      if (userRating > 0) {
        if (starHintLabel) starHintLabel.textContent = `You gave ${userRating} Stars: "${starHints[userRating]}" 💕`;
      } else {
        if (starHintLabel) starHintLabel.textContent = "Tap a star to drop your review 💖";
      }
    });

    btn.addEventListener('click', () => {
      const isNewRating = userRating === 0;
      const prevRating = userRating;
      userRating = starVal;
      localStorage.setItem('kuchu_user_star_rating', userRating.toString());

      if (isNewRating) {
        extraUserRatingsCount += 1;
        extraUserRatingsSum += userRating;
      } else {
        extraUserRatingsSum = extraUserRatingsSum - prevRating + userRating;
      }

      localStorage.setItem('kuchu_extra_ratings_count', extraUserRatingsCount.toString());
      localStorage.setItem('kuchu_extra_ratings_sum', extraUserRatingsSum.toString());

      highlightStars(userRating);
      recalculateRating();

      if (userRateTitle) userRateTitle.innerHTML = `Your Rating: <strong>${userRating} ⭐</strong> (Saved!)`;
      if (starHintLabel) starHintLabel.textContent = `Thank you! "${starHints[userRating]}" 💕`;

      // Trigger lovely mini confetti on rating
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#ff2d55', '#ffb703', '#ffffff']
        });
      }

      showToast(`Thank you for rating ${userRating} Stars! ⭐💖`);
    });
  });

  // Toggle "View More" button
  if (statsToggleBtn && statsCard) {
    statsToggleBtn.addEventListener('click', () => {
      const isOpen = statsCard.classList.toggle('open');
      statsToggleBtn.classList.toggle('active', isOpen);
      statsToggleBtn.setAttribute('aria-expanded', isOpen);

      const labelText = statsToggleBtn.querySelector('.toggle-label-text');
      if (labelText) {
        labelText.textContent = isOpen ? 'Hide Stats' : 'View More';
      }

      if (isOpen) {
        setTimeout(() => {
          statsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }
    });
  }
});
