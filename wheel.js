/* =========================================================
   PRIZE LIST — the single source of truth for the wheel.
   Every segment on the canvas AND every selection button
   below the wheel is generated from this array.
   (Do not remove any prize — this is the full original list.)
   ========================================================= */
const prizes = [
    { text: "🎁 تخفيض 25%",         color: "#FFD700", weight: 4 },
    { text: "⏰ ارجع غدوة",          color: "#555555", weight: 4 },
    { text: "🍟 إضافة فريت",         color: "#FF9800", weight: 4 },
    { text: "🔄 دور مرة أخرى",       color: "#4CAF50", weight: 4 },
    { text: "⏰ ارجع غدوة",          color: "#444444", weight: 4 },
    { text: "🍟 إضافة فريت",         color: "#F57C00", weight: 4 },
    { text: "🥤 قازوزة مجانية",      color: "#E91E63", weight: 4 },
    { text: "⏰ ارجع غدوة",          color: "#333333", weight: 4 },
    { text: "🍟 إضافة فريت",         color: "#E65100", weight: 4 },
    { text: "💧 دابوزة ماء مجانية",  color: "#2196F3", weight: 4 },
    { text: "⏰ ارجع غدوة",          color: "#616161", weight: 4 },
    { text: "🎉 تخفيض 50%",          color: "#9C27B0", weight: 1 }
];

const CONFETTI_COLORS = ['#ff7b00', '#e53935', '#1e88e5', '#ffcc33', '#43a047', '#7b1fa2', '#fff'];

/* =========================================================
   STATE
   ========================================================= */
let currentRotation = 0;
let isSpinning       = false;
let selectedPrize    = null; // the prize TEXT the user picked before spinning
let wheelResult       = null; // the prize TEXT the wheel actually landed on

/* =========================================================
   CANVAS WHEEL DRAWING
   ========================================================= */
const canvas = document.getElementById('wheel');
const ctx    = canvas.getContext('2d');
const cx     = canvas.width / 2;
const cy     = canvas.height / 2;
const radius = cx;
const arc    = (2 * Math.PI) / prizes.length;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < prizes.length; i++) {
        const start = i * arc - Math.PI / 2;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, start, start + arc);
        ctx.closePath();
        ctx.fillStyle = prizes[i].color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 15px Cairo, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 5;
        ctx.fillText(prizes[i].text, radius - 16, 6);
        ctx.restore();
    }
}

/* =========================================================
   RANDOM SELECTION — 100% random, weighted exactly as
   defined in the prizes array above. Nothing here reacts
   to what the user selected; the outcome is decided purely
   by chance, and only compared to the selection afterwards.
   ========================================================= */
function getWeightedRandomIndex() {
    const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
    let rand = Math.random() * totalWeight;
    for (let i = 0; i < prizes.length; i++) {
        if (rand < prizes[i].weight) return i;
        rand -= prizes[i].weight;
    }
    return prizes.length - 1; // fallback safety net
}

/* =========================================================
   PRIZE SELECTION BUTTONS
   ========================================================= */
function buildPrizeButtons() {
    const container = document.getElementById('prizeButtons');
    container.innerHTML = '';

    prizes.forEach((prize, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'prize-btn';
        btn.textContent = prize.text;
        btn.style.setProperty('--prize-color', prize.color);
        btn.dataset.index = idx;
        btn.addEventListener('click', () => handlePrizeSelect(idx, btn));
        container.appendChild(btn);
    });
}

function handlePrizeSelect(idx, btnEl) {
    if (isSpinning) return;

    document.querySelectorAll('.prize-btn').forEach(b => b.classList.remove('selected'));
    btnEl.classList.add('selected');

    selectedPrize = prizes[idx].text;

    const spinBtn = document.getElementById('spinBtn');
    spinBtn.disabled = false;
}

function resetSelection() {
    selectedPrize = null;
    document.querySelectorAll('.prize-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('spinBtn').disabled = true;
}

/* =========================================================
   CONFETTI (only fired on a WIN)
   ========================================================= */
function triggerConfetti() {
    const count = 80;
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';

    for (let k = 0; k < count; k++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        const size = 6 + Math.random() * 9;
        el.style.cssText = `
          left:${Math.random() * 100}%;
          width:${size}px;
          height:${size * 0.5}px;
          background:${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
          animation-duration:${1.8 + Math.random() * 1.5}s;
          animation-delay:${Math.random() * 0.7}s;
          transform:rotate(${Math.random() * 360}deg);
        `;
        container.appendChild(el);
    }
    setTimeout(() => container.innerHTML = '', 3800);
}

/* =========================================================
   SPIN
   ========================================================= */
function spin() {
    if (isSpinning || !selectedPrize) return;

    isSpinning = true;
    const spinBtn  = document.getElementById('spinBtn');
    const resultEl = document.getElementById('result');
    spinBtn.disabled = true;
    resultEl.textContent = '';
    resultEl.className = '';

    // ---- Purely random outcome, independent of the user's choice ----
    const winIndex = getWeightedRandomIndex();
    wheelResult = prizes[winIndex].text;

    const turns       = 5 + Math.floor(Math.random() * 3);
    const anglePerSeg = 360 / prizes.length;
    const desired     = 360 - (winIndex * anglePerSeg + anglePerSeg / 2);
    const currentMod  = ((currentRotation % 360) + 360) % 360;
    let delta = desired - currentMod;
    if (delta < 0) delta += 360;
    currentRotation += turns * 360 + delta;

    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        isSpinning = false;

        // ---- Compare AFTER the wheel has fully stopped ----
        if (selectedPrize === wheelResult) {
            resultEl.textContent = '🎉 مبروك! ربحت: ' + wheelResult;
            resultEl.className = 'result-show win';
            triggerConfetti();
        } else {
            resultEl.textContent = '😔 حظ أوفر المرة الجاية! النتيجة: ' + wheelResult;
            resultEl.className = 'result-show lose';
        }

        resetSelection();
    }, 6100);
}

/* =========================================================
   BACKGROUND MUSIC (unchanged behaviour)
   ========================================================= */
function initMusic() {
    const music = document.getElementById('bgMusic');
    music.volume = 0.5;

    function applySavedTime() {
        try {
            const savedTime = localStorage.getItem('musicTime');
            if (savedTime && music.readyState > 0) {
                music.currentTime = parseFloat(savedTime);
            }
        } catch (e) {}
    }

    if (music.readyState > 0) {
        applySavedTime();
    } else {
        music.addEventListener('loadedmetadata', applySavedTime);
    }

    setInterval(() => {
        try { localStorage.setItem('musicTime', music.currentTime); } catch (e) {}
    }, 1000);

    try {
        const muted = localStorage.getItem('musicMuted');
        if (muted === 'true') { music.muted = true; }
    } catch (e) {}

    function startMusic() {
        music.play().catch(() => {});
    }

    window.addEventListener('load', startMusic);
    startMusic();

    function unlockOnce() {
        startMusic();
        document.removeEventListener('click', unlockOnce);
        document.removeEventListener('touchstart', unlockOnce);
        document.removeEventListener('scroll', unlockOnce);
        document.removeEventListener('keydown', unlockOnce);
    }

    document.addEventListener('click', unlockOnce);
    document.addEventListener('touchstart', unlockOnce);
    document.addEventListener('scroll', unlockOnce);
    document.addEventListener('keydown', unlockOnce);
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    buildPrizeButtons();
    drawWheel();
    document.getElementById('spinBtn').addEventListener('click', spin);
    initMusic();
});
