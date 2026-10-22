const photoFiles = ["1792662203486.webp","1792662205138.webp","1792662205464.webp","1792662205616.webp","1792662205692.webp","1792662206058.webp","1792662206254.webp","1792662208375.webp","1792662209795.webp","1792662217551.webp","1792662217890.webp","1792662220241.webp","1792662220358.webp","1792662220481.webp","1792662220825.webp","1792662221156.webp","1792662221457.webp","1792662221601.webp","1792662221905.webp","1792662223040.webp","1792662223265.webp","1792662223478.webp","1792662223782.webp","1792662223914.webp","1792662224866.webp","1792662224932.webp","1792662225164.webp","1792662227254.webp","1792662228330.webp","1792662229321.webp","1792662230190.webp","1792662230552.webp","1792662230717.webp","1792662232055.webp","1792662232285.webp","1792662233120.webp","1792662234261.webp","1792662234489.webp","1792662234827.webp","1792662245596.webp","1792662248708.webp","1792662248831.webp","1792662250241.webp","1792662252503.webp","1792662252772.webp","1792662252975.webp","1792662253093.webp","1792662253404.webp","1792662253465.webp","1792662253536.webp","1792662253668.webp","1792662255244.webp","1792662256602.webp","1792662256924.webp","1792662257209.webp","1792662257296.webp","1792662258789.webp","1792662259069.webp","1792662261868.webp","1792662261989.webp","1792662265367.webp","1792662265569.webp","1792662265935.webp","1792662266147.webp","1792662266897.webp","1792662267273.webp","20261016_191900_242_1x.webp","LS20260816164021.webp","LS20260816164105.webp","Messenger_creation_1057896746981332.webp","Messenger_creation_1168047468858203.webp","Messenger_creation_1554961526406451.webp","Messenger_creation_2349015365917868.webp","Messenger_creation_872448298603185.webp","Messenger_creation_B28A34C0-7192-4635-A092-1E1E6C60D0C1.webp","Messenger_creation_D4BCDE99-B4A1-415D-A667-1BBC6F1AFE4D.webp","Messenger_creation_EA80CB21-EA4A-411A-883D-ED244A022581.webp","Messenger_creation_EF8EE8CD-4940-47C6-9D29-F692154204CE.webp","received_1066904436406027.webp","received_1166613392106260.webp","received_1320702416365111.webp","received_1425309425662966.webp","received_1439288761460768.webp","received_1463132349017390.webp","received_1547669210170585.webp","received_1596605812478880.webp","received_1614868916276732.webp","received_1622791159095142.webp","received_1686133872822261.webp","received_1743799229916947.webp","received_1799704877578114.webp","received_2180952869066085.webp","received_716361911533237.webp","received_741172165604227.webp","received_851647030811012.webp","received_851759250749825.webp","received_856769807074243.webp","received_892928490200395.webp","received_998606686666378.webp"];
const photos = photoFiles.map((file, index) => ({ file, number: index + 1 }));
const grid = document.querySelector('#gallery-grid');
const dialog = document.querySelector('#lightbox');
let visiblePhotos = [...photos];
let activePhoto = 0;
let activeCarouselIndex = 0;
let suppressCardClick = false;
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const SOUND_STORAGE_KEY = 'mayorNamingBaduySoundEnabled';
const soundToggle = document.querySelector('#sound-toggle');
const popAudio = document.querySelector('#pop-sound');
let soundsEnabled = true;
let soundContext;
let activeEffectNodes = [];
try { soundsEnabled = localStorage.getItem(SOUND_STORAGE_KEY) !== 'off'; } catch { /* Sound remains available for this visit. */ }
function updateSoundToggle() {
  soundToggle.setAttribute('aria-pressed', String(soundsEnabled));
  soundToggle.setAttribute('aria-label', soundsEnabled ? 'Mute sound effects' : 'Enable sound effects');
  soundToggle.querySelector('.sound-label').textContent = soundsEnabled ? 'SOUND ON' : 'SOUND OFF';
}
function playEffect(name) {
  if (!soundsEnabled) return;
  const birthdayMusic = document.querySelector('#letter-music');
  if (birthdayMusic && !birthdayMusic.paused) return;
  if (name === 'popper' && popAudio) {
    activeEffectNodes.forEach(node => { try { node.stop(); } catch { /* Already finished. */ } });
    activeEffectNodes = [];
    popAudio.volume = .55;
    popAudio.currentTime = 0;
    popAudio.play().catch(() => playSynthEffect(name));
    return;
  }
  if (popAudio && !popAudio.paused) { popAudio.pause(); popAudio.currentTime = 0; }
  playSynthEffect(name);
}
function playSynthEffect(name) {
  if (!soundsEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  try {
    soundContext ||= new AudioContextClass();
    if (soundContext.state === 'suspended') soundContext.resume();
    activeEffectNodes.forEach(node => { try { node.stop(); } catch { /* Already finished. */ } });
    activeEffectNodes = [];
    const patterns = {
      popper: [523.25, 659.25, 783.99, 1046.5],
      flower: [659.25, 783.99, 987.77],
      candle: [392, 523.25, 659.25],
      letter: [523.25, 659.25],
      kind: [587.33, 783.99]
    };
    const notes = patterns[name] || patterns.kind;
    const start = soundContext.currentTime;
    const spacing = name === 'popper' ? .065 : .1;
    notes.forEach((frequency, index) => {
      const oscillator = soundContext.createOscillator();
      const gain = soundContext.createGain();
      oscillator.type = name === 'popper' ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, start + index * spacing);
      gain.gain.setValueAtTime(.0001, start + index * spacing);
      gain.gain.exponentialRampToValueAtTime(name === 'popper' ? .055 : .035, start + index * spacing + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, start + index * spacing + (name === 'popper' ? .24 : .32));
      oscillator.connect(gain).connect(soundContext.destination);
      oscillator.start(start + index * spacing);
      oscillator.stop(start + index * spacing + (name === 'popper' ? .25 : .33));
      activeEffectNodes.push(oscillator);
    });
  } catch { /* Audio is an enhancement; interactions still work without it. */ }
}
soundToggle.addEventListener('click', () => {
  soundsEnabled = !soundsEnabled;
  try { localStorage.setItem(SOUND_STORAGE_KEY, soundsEnabled ? 'on' : 'off'); } catch { /* Keep the selection for this page view. */ }
  if (!soundsEnabled) {
    document.querySelector('#letter-music')?.pause();
    popAudio.pause();
    activeEffectNodes.forEach(node => { try { node.stop(); } catch { /* Already finished. */ } });
    activeEffectNodes = [];
  }
  updateSoundToggle();
  if (soundsEnabled) playEffect('kind');
});
updateSoundToggle();
let autoplayEnabled = !motionPreference.matches;
let galleryHovering = false;
let galleryFocused = false;

function cardFor(photo, index) {
  const card = document.createElement('article');
  card.className = 'card carousel-slide';
  card.dataset.index = index;
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Open gallery moment ${String(photo.number).padStart(3, '0')}`);
  card.innerHTML = `<div class="card-image"><img src="assets/gallery/${photo.file}" alt="Club gallery moment ${String(photo.number).padStart(3, '0')}" loading="lazy" decoding="async"></div><div class="card-meta"><strong>MOMENT NO. ${String(photo.number).padStart(3, '0')}</strong><span>FROM THE CLUB ALBUM</span></div>`;
  card.addEventListener('click', event => {
    if (suppressCardClick) { event.preventDefault(); event.stopImmediatePropagation(); suppressCardClick = false; return; }
    openPhoto(photo);
  });
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPhoto(photo); } });
  revealObserver.observe(card);
  return card;
}
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { rootMargin: '0px 0px 80px', threshold: .05 });

function render(list) {
  visiblePhotos = list;
  activeCarouselIndex = 0;
  grid.replaceChildren(...list.map((photo, index) => cardFor(photo, index)));
  document.querySelector('#photo-count').textContent = list.length;
  updateCarousel();
  renderCarouselPagination();
}

function updateCarousel() {
  const slides = [...grid.children];
  const viewport = document.querySelector('#carousel-viewport');
  const previousButton = document.querySelector('#carousel-previous');
  const nextButton = document.querySelector('#carousel-next');
  if (!slides.length) {
    grid.style.transform = 'translate3d(0,0,0)';
    previousButton.disabled = true;
    nextButton.disabled = true;
    document.querySelector('#carousel-count').textContent = '0 / 0';
    return;
  }
  slides.forEach((slide, index) => {
    const offset = index - activeCarouselIndex;
    const position = offset === 0 ? 'active' : offset === -1 ? 'previous' : offset === 1 ? 'next' : 'hidden';
    slide.dataset.position = position;
    slide.inert = Math.abs(offset) > 1;
    slide.setAttribute('aria-hidden', String(Math.abs(offset) > 1));
  });
  const active = slides[activeCarouselIndex];
  // Position from untransformed layout coordinates so 3D slide effects cannot
  // skew the active card's center calculation or accumulate carousel drift.
  const activeCenter = grid.offsetLeft + active.offsetLeft + active.offsetWidth / 2;
  const centerOffset = viewport.clientWidth / 2 - activeCenter;
  grid.style.transform = `translate3d(${centerOffset}px,0,0)`;
  previousButton.disabled = slides.length < 2;
  nextButton.disabled = slides.length < 2;
  document.querySelector('#carousel-count').textContent = `${String(activeCarouselIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  syncAutoplayControl();
}
function renderCarouselPagination() {
  const pagination = document.querySelector('#carousel-pagination');
  const total = visiblePhotos.length;
  pagination.replaceChildren();
  if (!total) return;
  let indices;
  if (total <= 9) indices = Array.from({ length: total }, (_, index) => index);
  else {
    const selected = new Set([0, total - 1]);
    for (let index = Math.max(0, activeCarouselIndex - 2); index <= Math.min(total - 1, activeCarouselIndex + 2); index++) selected.add(index);
    indices = [...selected].sort((a, b) => a - b);
  }
  let previous = -1;
  indices.forEach(index => {
    if (previous !== -1 && index - previous > 1) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.setAttribute('aria-hidden', 'true');
      ellipsis.textContent = '…';
      pagination.append(ellipsis);
    }
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'pagination-dot';
    dot.setAttribute('aria-label', `Show photo ${index + 1}`);
    dot.setAttribute('aria-current', String(index === activeCarouselIndex));
    dot.addEventListener('click', () => {
      goToCarouselIndex(index);
      document.querySelector('#carousel-pagination .pagination-dot[aria-current="true"]')?.focus({ preventScroll: true });
    });
    pagination.append(dot);
    previous = index;
  });
}
function goToCarouselIndex(index) {
  if (!visiblePhotos.length) return;
  activeCarouselIndex = (index + visiblePhotos.length) % visiblePhotos.length;
  updateCarousel();
  renderCarouselPagination();
}
function stepCarousel(direction) { goToCarouselIndex(activeCarouselIndex + direction); }
function syncAutoplayControl() {
  const button = document.querySelector('#autoplay-toggle');
  if (!button) return;
  button.setAttribute('aria-pressed', String(autoplayEnabled));
  button.setAttribute('aria-label', autoplayEnabled ? 'Pause automatic carousel' : 'Play automatic carousel');
  button.innerHTML = `<span aria-hidden="true">${autoplayEnabled ? 'Ⅱ' : '▶'}</span> ${autoplayEnabled ? 'PAUSE' : 'PLAY'}`;
  const isMoving = autoplayEnabled && !galleryHovering && !galleryFocused && !document.hidden && !document.body.classList.contains('login-locked') && !document.querySelector('dialog[open]');
  document.querySelector('#carousel-count')?.setAttribute('aria-live', isMoving ? 'off' : 'polite');
}

document.querySelector('#autoplay-toggle').addEventListener('click', () => {
  autoplayEnabled = !autoplayEnabled;
  syncAutoplayControl();
});
const gallerySection = document.querySelector('#gallery');
gallerySection.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { galleryHovering = true; syncAutoplayControl(); } });
gallerySection.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') { galleryHovering = false; syncAutoplayControl(); } });
gallerySection.addEventListener('focusin', event => {
  if (!event.target.closest('#autoplay-toggle')) { galleryFocused = true; syncAutoplayControl(); }
});
gallerySection.addEventListener('focusout', () => requestAnimationFrame(() => {
  galleryFocused = gallerySection.contains(document.activeElement) && !document.activeElement.closest?.('#autoplay-toggle');
  syncAutoplayControl();
}));
document.addEventListener('visibilitychange', syncAutoplayControl);
document.addEventListener('toggle', event => { if (event.target instanceof HTMLDialogElement) syncAutoplayControl(); }, true);
motionPreference.addEventListener?.('change', event => {
  if (event.matches) autoplayEnabled = false;
  syncAutoplayControl();
});
setInterval(() => {
  const shouldAdvance = autoplayEnabled && !galleryHovering && !galleryFocused && !document.hidden && !document.body.classList.contains('login-locked') && !document.querySelector('dialog[open]') && visiblePhotos.length > 1;
  if (shouldAdvance) stepCarousel(1);
  syncAutoplayControl();
}, 4800);

document.querySelector('#carousel-previous').addEventListener('click', () => stepCarousel(-1));
document.querySelector('#carousel-next').addEventListener('click', () => stepCarousel(1));
window.addEventListener('resize', updateCarousel, { passive: true });
document.querySelector('#carousel-viewport').addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); stepCarousel(1); grid.children[activeCarouselIndex]?.focus({ preventScroll: true }); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); stepCarousel(-1); grid.children[activeCarouselIndex]?.focus({ preventScroll: true }); }
});
document.querySelector('.carousel-shell').addEventListener('keydown', event => {
  if (event.target.closest('#carousel-viewport')) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); stepCarousel(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); stepCarousel(-1); }
});
document.querySelector('.carousel-footer').addEventListener('keydown', event => {
  if (!event.target.matches('.pagination-dot')) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); stepCarousel(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); stepCarousel(-1); }
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    document.querySelector('#carousel-pagination .pagination-dot[aria-current="true"]')?.focus({ preventScroll: true });
  }
});

const carouselViewport = document.querySelector('#carousel-viewport');
let swipeStartX = null;
let swipeStartY = null;
carouselViewport.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch') return;
  swipeStartX = event.clientX;
  swipeStartY = event.clientY;
});
carouselViewport.addEventListener('pointerup', event => {
  if (swipeStartX === null || swipeStartY === null) return;
  const deltaX = event.clientX - swipeStartX;
  const deltaY = event.clientY - swipeStartY;
  swipeStartX = null;
  swipeStartY = null;
  if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
    suppressCardClick = true;
    stepCarousel(deltaX < 0 ? 1 : -1);
    setTimeout(() => { suppressCardClick = false; }, 350);
  }
});
carouselViewport.addEventListener('pointercancel', () => { swipeStartX = null; swipeStartY = null; });
function openPhoto(photo) {
  activePhoto = Math.max(0, visiblePhotos.indexOf(photo));
  updateLightbox();
  dialog.showModal();
  syncAutoplayControl();
}
dialog.addEventListener('close', syncAutoplayControl);
function updateLightbox() {
  const photo = visiblePhotos[activePhoto];
  if (!photo) return;
  document.querySelector('#lightbox-image').src = `assets/gallery/${photo.file}`;
  document.querySelector('#lightbox-image').alt = `Club gallery moment ${String(photo.number).padStart(3, '0')}`;
  document.querySelector('#lightbox-caption').textContent = `MEMORY NO. ${String(photo.number).padStart(3, '0')} · WITH LOVE FROM THE CLUB`;
  document.querySelector('#lightbox-count').textContent = `${String(activePhoto + 1).padStart(2, '0')} / ${String(visiblePhotos.length).padStart(2, '0')}`;
}
function stepPhoto(direction) { activePhoto = (activePhoto + direction + visiblePhotos.length) % visiblePhotos.length; updateLightbox(); }

render(photos);
document.querySelector('#lightbox-close').addEventListener('click', () => dialog.close());
document.querySelector('#lightbox-prev').addEventListener('click', () => stepPhoto(-1));
document.querySelector('#lightbox-next').addEventListener('click', () => stepPhoto(1));
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.addEventListener('keydown', event => { if (!dialog.open) return; if (event.key === 'ArrowRight') stepPhoto(1); if (event.key === 'ArrowLeft') stepPhoto(-1); });

const heroPhotos = [photos[5], photos[30]];
document.querySelector('#hero-photo-1').src = `assets/gallery/${heroPhotos[0].file}`;
document.querySelector('#hero-photo-2').src = `assets/gallery/${heroPhotos[1].file}`;

let popperTimer;
function celebrate() {
  playEffect('popper');
  if (!motionPreference.matches) {
    const poppersLayer = document.querySelector('#party-poppers');
    poppersLayer.classList.remove('is-firing');
    void poppersLayer.offsetWidth;
    poppersLayer.classList.add('is-firing');
    clearTimeout(popperTimer);
    popperTimer = setTimeout(() => poppersLayer.classList.remove('is-firing'), 1700);
  }
  const colors = ['#c77f85', '#e8d59d', '#82958b', '#faf8f1', '#a5b89d'];
  const amount = motionPreference.matches ? 12 : 32;
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('i');
    piece.className = 'confetti';
    const side = i % 2 === 0 ? 0 : 1;
    // Launch just beyond the viewport edge so the confetti appears to enter from offscreen.
    piece.style.left = side ? `${100 + Math.random() * 4}vw` : `${-4 + Math.random() * 4}vw`;
    piece.style.top = `${78 + Math.random() * 12}vh`;
    piece.classList.add('poppers-confetti');
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty('--duration', `${2 + Math.random() * 2.6}s`);
    // Scale the inward travel to the viewport so launches from either offscreen edge enter view.
    const diagonal = window.innerWidth * (.22 + Math.random() * .20);
    piece.style.setProperty('--drift-x', `${side ? -diagonal : diagonal}px`);
    piece.style.setProperty('--drift-y', `${-(window.innerHeight * (.42 + Math.random() * .22))}px`);
    if (motionPreference.matches) piece.style.setProperty('--launch-delay', '0s');
    piece.style.animationDelay = `${Math.random() * .8}s`;
    document.body.append(piece);
    setTimeout(() => piece.remove(), motionPreference.matches ? 1800 : 3200);
  }
}

const clubCompliments = [
  'You make people feel welcome just by being yourself.',
  'Your laugh is one of our favorite things about the club.',
  'You bring a little more joy into every room you enter.',
  'You deserve all the kindness you so freely give everyone else.',
  'The club is brighter with you in it, Mayor Naming Baduy.',
  'You turn ordinary memories into the ones we keep forever.'
];
let previousCompliment = -1;
document.querySelector('#compliment-button')?.addEventListener('click', () => {
  let next = Math.floor(Math.random() * clubCompliments.length);
  if (clubCompliments.length > 1 && next === previousCompliment) next = (next + 1) % clubCompliments.length;
  previousCompliment = next;
  const message = document.querySelector('#compliment-message');
  message.classList.remove('compliment-pop');
  void message.offsetWidth;
  message.textContent = clubCompliments[next];
  message.classList.add('compliment-pop');
  playEffect('kind');
});
document.querySelector('#party-button').addEventListener('click', celebrate);

const progress = document.querySelector('#progress-bar');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max ? scrollY / max * 100 : 0}%`;
}, { passive: true });

// Add a song in assets/music/ and replace this path with its filename.
const LETTER_MUSIC = 'assets/music/hb128.mp3';
const LETTER_STORAGE_KEY = 'mayorNamingBaduyLetters';
const lettersGrid = document.querySelector('#letters-grid');
const letterDialog = document.querySelector('#letter-dialog');
const letterAudio = document.querySelector('#letter-music');
const musicToggle = document.querySelector('#music-toggle');
letterAudio.src = LETTER_MUSIC;
let birthdayLetters = [];
let letterOpening = false;
try {
  const storedLetters = JSON.parse(localStorage.getItem(LETTER_STORAGE_KEY) || '[]');
  birthdayLetters = Array.isArray(storedLetters) ? storedLetters.filter(letter =>
    letter && typeof letter.sender === 'string' && typeof letter.message === 'string' &&
    letter.sender.trim() && letter.message.trim()
  ).map(letter => ({ ...letter, sender: letter.sender.trim().slice(0, 50), message: letter.message.trim().slice(0, 1200) })) : [];
} catch { birthdayLetters = []; }

function renderLetters() {
  lettersGrid.replaceChildren();
  // Keep one full row open; a new row appears as soon as the previous row fills.
  const slotCount = Math.max(3, Math.ceil((birthdayLetters.length + 1) / 3) * 3);
  const fragment = document.createDocumentFragment();
  for (let slotIndex = 0; slotIndex < slotCount; slotIndex += 1) {
    const slot = document.createElement('div');
    slot.className = 'envelope-slot';
    slot.setAttribute('role', 'listitem');
    if (slotIndex >= birthdayLetters.length) {
      slot.classList.add('envelope-placeholder');
      slot.setAttribute('aria-label', `Empty envelope slot ${slotIndex + 1}. Leave a note below to fill it.`);
      slot.innerHTML = `<span class="envelope-face"><span class="envelope-flap"></span><span class="envelope-heart" aria-hidden="true">♡</span></span><span class="envelope-index">NO. ${String(slotIndex + 1).padStart(3, '0')}</span><span class="envelope-label"><strong>WAITING FOR A NOTE</strong><span>EMPTY ENVELOPE</span></span>`;
    } else {
      const letter = birthdayLetters[slotIndex];
      const card = document.createElement('button');
      card.className = 'envelope-card';
      card.type = 'button';
      card.setAttribute('aria-label', `Open birthday letter ${slotIndex + 1} from ${letter.sender}`);
      card.innerHTML = `<span class="envelope-face"><span class="envelope-flap"></span><span class="envelope-heart" aria-hidden="true">♥</span></span><span class="envelope-index">NO. ${String(slotIndex + 1).padStart(3, '0')}</span><span class="envelope-label"><strong>TO MAYOR NAMING BADUY</strong><span>FROM ${escapeText(letter.sender)}</span></span>`;
      card.addEventListener('click', () => openLetter(slotIndex));
      slot.append(card);
    }
    fragment.append(slot);
  }
  lettersGrid.append(fragment);
  document.querySelector('#letter-count').textContent = `${birthdayLetters.length} ${birthdayLetters.length === 1 ? 'LETTER' : 'LETTERS'} IN THE BOX`;
  document.querySelector('#letters-empty').hidden = birthdayLetters.length > 0;
}
function escapeText(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}
function openLetter(index) {
  const letter = birthdayLetters[index];
  if (!letter || letterDialog.open || letterOpening) return;
  letterOpening = true;
  document.querySelector('#open-letter-number').textContent = `NO. ${String(index + 1).padStart(3, '0')}`;
  document.querySelector('#open-letter-body').textContent = letter.message;
  document.querySelector('#open-letter-sender').textContent = letter.sender;
  document.querySelector('#open-letter-from').textContent = letter.sender;
  document.querySelector('#surprise-hint').hidden = true;
  recordLetterRead(index);
  const envelope = lettersGrid.children[index]?.querySelector('.envelope-card');
  envelope?.classList.add('is-opening');
  setTimeout(() => {
    envelope?.classList.remove('is-opening');
    letterDialog.classList.add('is-opening');
    letterDialog.showModal();
    letterOpening = false;
    setTimeout(() => letterDialog.classList.remove('is-opening'), 900);
    playEffect('letter');
    syncAutoplayControl();
    updateMusicButton();
  }, motionPreference.matches ? 0 : 280);
}
function updateMusicButton() {
  const playing = !letterAudio.paused;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.innerHTML = `♫ <span>${playing ? 'PAUSE THE BIRTHDAY SONG' : 'PLAY THE BIRTHDAY SONG'}</span>`;
}
document.querySelector('#letter-form').addEventListener('submit', event => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const sender = String(formData.get('sender') || '').trim();
  const message = String(formData.get('message') || '').trim();
  if (!sender || !message) {
    const invalidField = !sender ? document.querySelector('#sender-name') : document.querySelector('#message-text');
    invalidField.setCustomValidity('Enter a name and a message with at least one non-space character.');
    invalidField.reportValidity();
    return;
  }
  birthdayLetters.push({ sender: sender.slice(0, 50), message: message.slice(0, 1200), createdAt: new Date().toISOString() });
  try { localStorage.setItem(LETTER_STORAGE_KEY, JSON.stringify(birthdayLetters)); }
  catch { birthdayLetters.pop(); window.alert('This browser could not save the letter. Please check its storage settings and try again.'); return; }
  event.currentTarget.reset();
  renderLetters();
  playEffect('letter');
});
document.querySelector('#sender-name').addEventListener('input', event => event.currentTarget.setCustomValidity(''));
document.querySelector('#message-text').addEventListener('input', event => event.currentTarget.setCustomValidity(''));
document.querySelector('#letter-close').addEventListener('click', () => letterDialog.close());
letterDialog.addEventListener('click', event => { if (event.target === letterDialog) letterDialog.close(); });
letterDialog.addEventListener('close', () => {
  letterAudio.pause();
  letterAudio.currentTime = 0;
  updateMusicButton();
  syncAutoplayControl();
  if (surprisePending) setTimeout(showBirthdaySurprise, 240);
});
letterAudio.addEventListener('play', updateMusicButton);
letterAudio.addEventListener('pause', updateMusicButton);
musicToggle.addEventListener('click', async () => {
  if (!soundsEnabled) { document.querySelector('#toast').textContent = 'TURN SOUND ON TO PLAY THE BIRTHDAY SONG ♫'; document.querySelector('#toast').classList.add('show'); return; }
  if (!letterAudio.paused) { letterAudio.pause(); return; }
  try { await letterAudio.play(); }
  catch { document.querySelector('#toast').textContent = `ADD YOUR SONG AT ${LETTER_MUSIC} ♫`; document.querySelector('#toast').classList.add('show'); setTimeout(() => document.querySelector('#toast').classList.remove('show'), 3000); }
});
renderLetters();

// Static-site surprise gate: update these two values to change the login.
const LOGIN_USERNAME = 'mayor';
const LOGIN_PASSWORD = 'baduy2026';
const LOGIN_SESSION_KEY = 'mayorNamingBaduySignedIn';
const loginScreen = document.querySelector('#login-screen');
const welcomeScreen = document.querySelector('#welcome-screen');
const welcomeContinue = document.querySelector('#welcome-continue');
let welcomeTimer;
function finishWelcome() {
  if (welcomeScreen.hidden) return;
  clearTimeout(welcomeTimer);
  welcomeScreen.classList.add('is-leaving');
  setTimeout(() => {
    welcomeScreen.hidden = true;
    welcomeScreen.classList.remove('is-leaving');
    document.body.classList.add('site-reveal');
    document.querySelector('#hero-title')?.focus({ preventScroll: true });
    syncAutoplayControl();
    celebrate();
    setTimeout(() => document.body.classList.remove('site-reveal'), 1300);
  }, motionPreference.matches ? 0 : 420);
}
welcomeContinue.addEventListener('click', finishWelcome);
try {
  if (sessionStorage.getItem(LOGIN_SESSION_KEY) === 'yes') {
    loginScreen.hidden = true;
    document.body.classList.remove('login-locked');
  }
} catch { /* The login form still works when session storage is unavailable. */ }
document.querySelector('#login-form').addEventListener('submit', event => {
  event.preventDefault();
  const username = document.querySelector('#login-username').value.trim().toLowerCase();
  const password = document.querySelector('#login-password').value;
  const error = document.querySelector('#login-error');
  if (username !== LOGIN_USERNAME && username !== 'mayor naming baduy' || password !== LOGIN_PASSWORD) {
    error.hidden = false;
    document.querySelector('#login-password').select();
    return;
  }
  error.hidden = true;
  try { sessionStorage.setItem(LOGIN_SESSION_KEY, 'yes'); } catch { /* Continue for this page view. */ }
  loginScreen.hidden = true;
  document.body.classList.remove('login-locked');
  welcomeScreen.hidden = false;
  welcomeContinue.focus({ preventScroll: true });
  welcomeTimer = setTimeout(finishWelcome, motionPreference.matches ? 1500 : 2600);
});

// Surprise reveal settings: pick any image already in assets/gallery/.
const SURPRISE_LETTER_COUNT = 5;
const SURPRISE_IMAGE = 'assets/gallery/1792662203486.webp';
const BOUQUET_STORAGE_KEY = 'mayorNamingBaduyBouquet';
const OPENED_LETTERS_KEY = 'mayorNamingBaduyOpenedLetters';
const SURPRISE_SEEN_KEY = 'mayorNamingBaduySurpriseSeen';
const surpriseDialog = document.querySelector('#surprise-dialog');
let surprisePending = false;
let openedLetters = new Set();
let birthdayWishes = [];
try {
  openedLetters = new Set(JSON.parse(localStorage.getItem(OPENED_LETTERS_KEY) || '[]'));
  birthdayWishes = JSON.parse(localStorage.getItem(BOUQUET_STORAGE_KEY) || '[]');
  if (!Array.isArray(birthdayWishes)) birthdayWishes = [];
} catch { openedLetters = new Set(); birthdayWishes = []; }

function recordLetterRead(index) {
  if (!openedLetters.has(index)) {
    openedLetters.add(index);
    try { localStorage.setItem(OPENED_LETTERS_KEY, JSON.stringify([...openedLetters])); } catch { /* Keep the unlock for this visit. */ }
  }
  let alreadySeen = false;
  try { alreadySeen = localStorage.getItem(SURPRISE_SEEN_KEY) === 'yes'; } catch { /* Session-only unlock is still available. */ }
  if (!alreadySeen && openedLetters.size >= SURPRISE_LETTER_COUNT) {
    surprisePending = true;
    document.querySelector('#surprise-hint').hidden = false;
  }
}
function showBirthdaySurprise() {
  document.querySelector('#surprise-image').src = SURPRISE_IMAGE;
  try { localStorage.setItem(SURPRISE_SEEN_KEY, 'yes'); } catch { /* The reveal still works for this visit. */ }
  surpriseDialog.showModal();
  playEffect('popper');
  spawnRevealPetals(24);
  spawnRevealConfetti(22);
  syncAutoplayControl();
}
document.querySelector('#surprise-close').addEventListener('click', () => surpriseDialog.close());
surpriseDialog.addEventListener('click', event => { if (event.target === surpriseDialog) surpriseDialog.close(); });
surpriseDialog.addEventListener('close', () => { letterAudio.pause(); letterAudio.currentTime = 0; syncAutoplayControl(); });

const flowerStyles = [
  { symbol: '✿', color: '#c77f85' }, { symbol: '❀', color: '#d3a15f' },
  { symbol: '✾', color: '#9a83ad' }, { symbol: '❁', color: '#c88669' },
  { symbol: '✽', color: '#d08c9d' }, { symbol: '✿', color: '#d8bd70' }
];
// Keep each stem within the narrower pot opening, even after its small tilt.
const flowerPositions = [50, 47, 53, 48, 52, 46, 54, 49, 51, 47, 53, 48, 52, 46, 54, 49, 51, 47, 53, 48, 52, 46, 54, 50];
function renderBouquet() {
  const stage = document.querySelector('#bouquet-stage');
  const visibleWishes = birthdayWishes.slice(-24);
  stage.replaceChildren();
  visibleWishes.forEach((wish, index) => {
    const positionIndex = index % flowerPositions.length;
    const style = flowerStyles[index % flowerStyles.length];
    const flower = document.createElement('button');
    flower.type = 'button';
    flower.className = 'bouquet-flower sparkle-hover';
    flower.style.setProperty('--flower-x', `${flowerPositions[positionIndex]}%`);
    flower.style.setProperty('--flower-y', `${25 + (index % 3) * 11}%`);
    flower.style.setProperty('--flower-tilt', `${(index % 5 - 2) * 4}deg`);
    flower.style.setProperty('--flower-color', style.color);
    flower.style.setProperty('--flower-delay', `${Math.min(index * 35, 700)}ms`);
    flower.setAttribute('aria-label', `Birthday wish from ${wish.name}. Select to read the wish.`);
    flower.title = `A birthday wish from ${wish.name}`;
    const stem = document.createElement('span');
    stem.className = 'flower-stem';
    const bloom = document.createElement('span');
    bloom.className = 'flower-head';
    bloom.setAttribute('aria-hidden', 'true');
    bloom.textContent = style.symbol;
    flower.append(stem, bloom);
    flower.addEventListener('click', () => {
      document.querySelector('#bouquet-note-copy').textContent = `${wish.name}: “${wish.wish}”`;
      stage.querySelectorAll('.bouquet-flower.is-selected').forEach(item => item.classList.remove('is-selected'));
      flower.classList.add('is-selected');
      playEffect('flower');
    });
    stage.append(flower);
  });
  document.querySelector('#bouquet-empty').hidden = birthdayWishes.length > 0;
  document.querySelector('#bouquet-note').hidden = birthdayWishes.length === 0;
}
document.querySelector('#wish-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get('name') || '').trim().slice(0, 40);
  const wish = String(data.get('wish') || '').trim().slice(0, 180);
  if (!name || !wish) return;
  birthdayWishes.push({ name, wish, createdAt: new Date().toISOString() });
  try { localStorage.setItem(BOUQUET_STORAGE_KEY, JSON.stringify(birthdayWishes)); }
  catch { birthdayWishes.pop(); window.alert('This browser could not save the flower. Please check its storage settings and try again.'); return; }
  event.currentTarget.reset();
  renderBouquet();
  playEffect('flower');
  document.querySelector('#bouquet-note-copy').textContent = `${name}: “${wish}”`;
  document.querySelector('#bouquet-note').hidden = false;
  const toast = document.querySelector('#toast');
  toast.textContent = 'A NEW BLOOM FOR THE BIRTHDAY BOUQUET ✿';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
});
renderBouquet();

let lanternLit = false;
function spawnLanternSparkles() {
  if (motionPreference.matches) return;
  const card = document.querySelector('.candle-card');
  for (let index = 0; index < 9; index++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'wish-sparkle';
    sparkle.setAttribute('aria-hidden', 'true');
    sparkle.textContent = index % 2 ? '✧' : '✦';
    sparkle.style.left = `${35 + Math.random() * 30}%`;
    sparkle.style.top = `${26 + Math.random() * 28}%`;
    sparkle.style.setProperty('--sparkle-delay', `${Math.random() * 260}ms`);
    sparkle.style.setProperty('--sparkle-drift-x', `${Math.random() * 70 - 35}px`);
    sparkle.style.setProperty('--sparkle-drift-y', `${-25 - Math.random() * 55}px`);
    card.append(sparkle);
    setTimeout(() => sparkle.remove(), 1500);
  }
}
document.querySelector('#birthday-lantern').addEventListener('click', event => {
  lanternLit = !lanternLit;
  const lantern = event.currentTarget;
  lantern.classList.toggle('is-lit', lanternLit);
  lantern.setAttribute('aria-pressed', String(lanternLit));
  lantern.setAttribute('aria-label', lanternLit ? 'Dim the birthday lantern' : 'Light the birthday lantern');
  document.querySelector('#lantern-message').textContent = lanternLit
    ? 'Your wish is glowing. Happy birthday, Mayor Naming Baduy!'
    : 'The lantern is resting. Tap it to make another wish.';
  if (lanternLit) spawnLanternSparkles();
  playEffect('candle');
});

const surpriseMusicButton = document.querySelector('#surprise-music');
function updateSurpriseMusicButton() {
  surpriseMusicButton.textContent = letterAudio.paused ? '♫ PLAY YOUR BIRTHDAY SONG' : '♫ PAUSE YOUR BIRTHDAY SONG';
}
letterAudio.addEventListener('play', updateSurpriseMusicButton);
letterAudio.addEventListener('pause', updateSurpriseMusicButton);
surpriseMusicButton.addEventListener('click', async () => {
  if (!soundsEnabled) { document.querySelector('#toast').textContent = 'TURN SOUND ON TO PLAY THE BIRTHDAY SONG ♫'; document.querySelector('#toast').classList.add('show'); return; }
  if (!letterAudio.paused) { letterAudio.pause(); return; }
  try { await letterAudio.play(); }
  catch {
    const toast = document.querySelector('#toast');
    toast.textContent = `ADD YOUR SONG AT ${LETTER_MUSIC} ♫`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
});

function spawnRevealPetals(count) {
  if (motionPreference.matches) return;
  const surface = document.querySelector('.surprise-content');
  surface.querySelectorAll('.surprise-petal').forEach(petal => petal.remove());
  const colors = ['#d7a1a0', '#e8d59d', '#a9bba2', '#d9bdba'];
  for (let index = 0; index < count; index++) {
    const petal = document.createElement('i');
    petal.className = 'surprise-petal';
    petal.setAttribute('aria-hidden', 'true');
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.backgroundColor = colors[index % colors.length];
    petal.style.setProperty('--petal-duration', `${3.8 + Math.random() * 2.5}s`);
    petal.style.setProperty('--petal-drift', `${Math.random() * 120 - 60}px`);
    petal.style.setProperty('--petal-turn', `${Math.random() * 520 - 260}deg`);
    petal.style.animationDelay = `${Math.random() * 1.2}s`;
    surface.append(petal);
    setTimeout(() => petal.remove(), 7800);
  }
}
function spawnRevealConfetti(count) {
  if (motionPreference.matches) return;
  const surface = document.querySelector('.surprise-content');
  const colors = ['#c77f85', '#e8d59d', '#a9bba2', '#d9bdba'];
  for (let index = 0; index < count; index++) {
    const piece = document.createElement('i');
    piece.className = 'surprise-confetti';
    piece.setAttribute('aria-hidden', 'true');
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.setProperty('--petal-duration', `${3.2 + Math.random() * 2}s`);
    piece.style.setProperty('--petal-drift', `${Math.random() * 100 - 50}px`);
    piece.style.setProperty('--petal-turn', `${Math.random() * 720 - 360}deg`);
    piece.style.animationDelay = `${Math.random() * 1.1}s`;
    surface.append(piece);
    setTimeout(() => piece.remove(), 7000);
  }
}

// Sparse ambient petals and a mouse-only petal trail; both stay decorative and non-interactive.
const floatingPetalLayer = document.querySelector('#floating-petals');
if (floatingPetalLayer && !motionPreference.matches) {
  const petalCount = window.matchMedia('(max-width: 700px)').matches ? 5 : 9;
  for (let index = 0; index < petalCount; index++) {
    const petal = document.createElement('i');
    petal.className = 'ambient-petal';
    petal.style.left = `${5 + Math.random() * 90}%`;
    petal.style.setProperty('--petal-delay', `${-Math.random() * 24}s`);
    petal.style.setProperty('--petal-duration', `${18 + Math.random() * 15}s`);
    petal.style.setProperty('--petal-drift', `${Math.random() * 90 - 45}px`);
    floatingPetalLayer.append(petal);
  }
}
const cursorPetalLayer = document.querySelector('#cursor-petals');
const finePointer = window.matchMedia('(pointer:fine)').matches;
let cursorPetalTime = 0;
if (cursorPetalLayer && finePointer && !motionPreference.matches) {
  document.addEventListener('pointermove', event => {
    const now = performance.now();
    if (now - cursorPetalTime < 125 || event.pointerType === 'touch') return;
    cursorPetalTime = now;
    const petal = document.createElement('i');
    petal.className = 'cursor-petal';
    petal.textContent = Math.random() > .5 ? '✿' : '·';
    petal.style.left = `${event.clientX}px`;
    petal.style.top = `${event.clientY}px`;
    cursorPetalLayer.append(petal);
    setTimeout(() => petal.remove(), 850);
  }, { passive: true });
}

document.documentElement.classList.add('motion-ready');
const revealTargets = document.querySelectorAll('.hero-copy,.hero-art,.section-kicker,.about-inner,.gallery-heading,.carousel-shell,.carousel-footer,.compliment-inner,.garden-heading,.bouquet-card,.candle-layout,.letters-heading,.letter-count,.letter-form,.closing');
if ('IntersectionObserver' in window) {
  const sectionRevealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-revealed');
    sectionRevealObserver.unobserve(entry.target);
  }), { rootMargin: '0px 0px -7% 0px', threshold: .08 });
  revealTargets.forEach((target, index) => {
    target.classList.add('reveal-ready');
    target.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 75}ms`);
    sectionRevealObserver.observe(target);
  });
} else revealTargets.forEach(target => target.classList.add('is-revealed'));

// Brief decorative glints on important controls, headings, and interactive blooms.
document.querySelectorAll('#party-button,#compliment-button,#birthday-lantern,.wish-form button,.form-submit button,.gallery-heading h2,.compliment-inner h2,.garden-heading h2,.letters-heading h2,.closing h2')
  .forEach(target => target.classList.add('sparkle-hover'));

// A single light shower greets visitors when they reach the birthday message.
const closingConfettiLayer = document.querySelector('#closing-confetti');
if (closingConfettiLayer && !motionPreference.matches && 'IntersectionObserver' in window) {
  const closingConfettiObserver = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    closingConfettiObserver.disconnect();
    for (let index = 0; index < 18; index += 1) {
      const particle = document.createElement('i');
      particle.className = index % 3 === 0 ? 'closing-particle closing-petal' : 'closing-particle';
      particle.style.left = `${4 + Math.random() * 92}%`;
      particle.style.setProperty('--particle-delay', `${Math.random() * 1.8}s`);
      particle.style.setProperty('--particle-duration', `${4.2 + Math.random() * 2.2}s`);
      particle.style.setProperty('--particle-drift', `${Math.random() * 70 - 35}px`);
      closingConfettiLayer.append(particle);
    }
  }, { threshold: .35 });
  const closingSection = document.querySelector('.closing');
  if (closingSection) closingConfettiObserver.observe(closingSection);
}

// Layered garden depth: small scroll and pointer offsets keep the scene dimensional but calm.
const garden = document.querySelector('#birthday-garden');
const gardenLayers = [...document.querySelectorAll('.garden-parallax [data-depth]')];
let gardenFrame = 0;
function updateGardenParallax(pointerX = 0, pointerY = 0) {
  if (motionPreference.matches || !garden) return;
  cancelAnimationFrame(gardenFrame);
  gardenFrame = requestAnimationFrame(() => {
    const bounds = garden.getBoundingClientRect();
    gardenLayers.forEach(layer => {
      const depth = Number(layer.dataset.depth) || .1;
      const scrollOffset = Math.max(-50, Math.min(50, -bounds.top * depth * .07));
      layer.style.setProperty('--garden-x', `${pointerX * depth * 13}px`);
      layer.style.setProperty('--garden-y', `${scrollOffset + pointerY * depth * 10}px`);
    });
  });
}
window.addEventListener('scroll', () => updateGardenParallax(), { passive: true });
if (window.matchMedia('(pointer:fine)').matches) {
  garden?.addEventListener('pointermove', event => {
    const bounds = garden.getBoundingClientRect();
    updateGardenParallax((event.clientX - bounds.left) / bounds.width - .5, (event.clientY - bounds.top) / bounds.height - .5);
  }, { passive: true });
  garden?.addEventListener('pointerleave', () => updateGardenParallax(), { passive: true });
}
updateGardenParallax();

// Give the active carousel print a little perspective tilt on mouse/pen only.
if (window.matchMedia('(pointer:fine)').matches && !motionPreference.matches) {
  carouselViewport.addEventListener('pointermove', event => {
    const card = event.target.closest('.carousel-slide[data-position="active"]');
    if (!card) {
      carouselViewport.querySelectorAll('.carousel-slide').forEach(item => {
        item.style.setProperty('--card-tilt-x', '0deg');
        item.style.setProperty('--card-tilt-y', '0deg');
      });
      return;
    }
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    card.style.setProperty('--card-tilt-x', `${x * 3}deg`);
    card.style.setProperty('--card-tilt-y', `${y * -3}deg`);
  }, { passive: true });
  carouselViewport.addEventListener('pointerleave', () => {
    carouselViewport.querySelectorAll('.carousel-slide').forEach(card => {
      card.style.setProperty('--card-tilt-x', '0deg');
      card.style.setProperty('--card-tilt-y', '0deg');
    });
  });
}
