const dayEl = document.getElementById('day');
const hrsEl = document.getElementById('hrs');
const minEl = document.getElementById('min');
const secEl = document.getElementById('sec');

const nowYear = new Date().getFullYear();
const newYearDate = new Date(`1 Jan ${nowYear + 1} 00:00:00`).getTime();

let fireworksStarted = false;

function updateCountdown() {
    const now = Date.now();
    let diff = newYearDate - now;
    let d = 0;
    let h = 0;
    let m = 0;
    let s = 0;
    if (diff > 0) {
        d = Math.floor(diff / (1000 * 60 * 60 * 24));
        h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        m = Math.floor((diff / (1000 * 60)) % 60);
        s = Math.floor((diff / 1000) % 60);
    }
    dayEl.textContent = d < 10 ? '0' + d : d;
    hrsEl.textContent = h < 10 ? '0' + h : h;
    minEl.textContent = m < 10 ? '0' + m : m;
    secEl.textContent = s < 10 ? '0' + s : s;
    if (diff <= 0 && !fireworksStarted) {
        startFireworks();
        fireworksStarted = true;
    }
}
setInterval(updateCountdown, 1000);
updateCountdown();

const audio = document.getElementById('backgroundMusic');
const playBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('durationTime');
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');
const volumeBurger = document.getElementById('volumeBurger');

function formatTime(sec) {
    if (isNaN(sec) || sec === Infinity) return '0:00';
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function updateVolumeIcon() {
    
}

audio.volume = parseFloat(volumeSlider.value);
updateVolumeIcon();

const playSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" aria-label="Play"><polygon points="5,4 19,12 5,20" fill="currentColor" /></svg>';
const pauseSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" aria-label="Pause"><rect x="6" y="4" width="4" height="16" fill="currentColor" /><rect x="14" y="4" width="4" height="16" fill="currentColor" /></svg>';

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = pauseSVG;
    } else {
        audio.pause();
        playBtn.innerHTML = playSVG;
    }
});

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener('input', () => {
    if (!isNaN(audio.duration)) {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    }
});

volumeSlider.addEventListener('input', () => {
    audio.volume = parseFloat(volumeSlider.value);
    if (audio.volume > 0) {
        audio.muted = false;
    }
    updateVolumeIcon();
    if (volumeBurger) {
        volumeBurger.value = volumeSlider.value;
    }
});

if (volumeBurger) {
    volumeBurger.addEventListener('input', () => {
        audio.volume = parseFloat(volumeBurger.value);
        if (audio.volume > 0) {
            audio.muted = false;
        }
        updateVolumeIcon();
        volumeSlider.value = volumeBurger.value;
    });
}

volumeIcon.addEventListener('click', () => {
    if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        if (audio.volume === 0) {
            audio.volume = 0.3;
            volumeSlider.value = 0.3;
            if (volumeBurger) {
                volumeBurger.value = 0.3;
            }
        }
    } else {
        audio.muted = true;
    }
    updateVolumeIcon();
});

window.addEventListener('load', () => {
    setTimeout(() => {
        audio.play().catch(() => {});
        playBtn.innerHTML = pauseSVG;
    }, 500);
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    document.body.appendChild(snowContainer);
    function createSnowflake() {
        const snow = document.createElement('div');
        snow.className = 'snowflake';
        snow.innerHTML = '❆';
        const size = Math.random() * 12 + 16;
        snow.style.fontSize = size + 'px';
        snow.style.left = Math.random() * window.innerWidth + 'px';
        snow.style.animationDuration = (Math.random() * 5 + 5) + 's';
        snow.style.opacity = Math.random() * 0.5 + 0.5;
        snowContainer.appendChild(snow);
        const removeTime = parseFloat(snow.style.animationDuration) * 1000;
        setTimeout(() => snow.remove(), removeTime);
    }
    setInterval(createSnowflake, 99);
});

audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = percent;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let fireworkInterval;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createFirework(x, y) {
    const count = 50 + Math.floor(Math.random() * 30);
    const baseHue = Math.random() * 360;
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = Math.random() * 5 + 2;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            hue: baseHue + (Math.random() * 80 - 40)
        });
    }
}

function updateFireworks() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        ctx.save();
        const color = `hsla(${p.hue}, 100%, 60%, ${p.alpha})`;
        ctx.fillStyle = color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.alpha -= 0.012;
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(updateFireworks);
}

function startFireworks() {
    canvas.style.display = 'block';
    if (!fireworkInterval) {
        fireworkInterval = setInterval(() => {
            const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
            const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
            createFirework(x, y);
        }, 700);
        updateFireworks();
    }
}
