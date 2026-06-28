// ========================================
// R.B STUDIO - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initHeader();
    initMobileMenu();
    initSplash();
    initScrollProgress();
    initBackToTop();
    initReveal();
    initPlayer();
});

// ========================================
// Particles Background
// ========================================
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.width = Math.random() * 4 + 2 + 'px';
        p.style.height = p.style.width;
        p.style.animationDelay = Math.random() * 5 + 's';
        p.style.animationDuration = Math.random() * 5 + 5 + 's';
        p.style.opacity = Math.random() * 0.6 + 0.2;
        container.appendChild(p);
    }
}

// ========================================
// Header Scroll Effect
// ========================================
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
    const btn = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        nav.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

// ========================================
// Splash Screen
// ========================================
function initSplash() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    let width = 0;
    const progress = document.getElementById('splashProgress');
    const interval = setInterval(() => {
        width += Math.random() * 20;
        if (width >= 100) {
            width = 100;
            progress.style.width = '100%';
            clearInterval(interval);
            setTimeout(() => {
                splash.classList.add('hidden');
                setTimeout(() => splash.style.display = 'none', 500);
            }, 400);
        } else {
            progress.style.width = width + '%';
        }
    }, 100);
}

// ========================================
// Scroll Progress Bar
// ========================================
function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = scrolled + '%';
    });
}

// ========================================
// Back to Top
// ========================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// Scroll Reveal
// ========================================
function initReveal() {
    const elements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

// ========================================
// PLAYER SYSTEM
// ========================================
function initPlayer() {
    const playBtn = document.querySelector('.play-btn');
    const playerWave = document.querySelector('.player-wave');
    const playerTrack = document.querySelector('.player-track');
    const playerLabel = document.querySelector('.player-label');
    if (!playBtn) return;

    let audio = null;
    let isPlaying = false;
    let isLoading = false;

    // ========================================================
    // Stream URL da Radio RB - Zeno.fm (funcionando!)
    // ========================================================
    const STREAM_URL = 'https://stream.zeno.fm/afkw3v1gva0uv';
    console.log('[Player] Stream URL:', STREAM_URL);

    function updateUI() {
        const icon = playBtn.querySelector('i');
        if (!icon) return;

        if (isPlaying) {
            icon.className = 'fas fa-pause';
            playerTrack.textContent = 'AO VIVO';
            playerTrack.style.color = '#a855f7';
            playerLabel.textContent = 'TOCANDO AGORA';
            if (playerWave) playerWave.classList.add('active');
        } else {
            icon.className = 'fas fa-play';
            playerTrack.textContent = 'PARADO';
            playerTrack.style.color = '#9ca3af';
            playerLabel.textContent = 'AGUARDANDO';
            if (playerWave) playerWave.classList.remove('active');
        }
    }

    function setupListeners() {
        if (!audio) return;

        audio.addEventListener('playing', () => {
            isPlaying = true;
            isLoading = false;
            updateUI();
        });

        audio.addEventListener('pause', () => {
            isPlaying = false;
            updateUI();
        });

        audio.addEventListener('error', () => {
            isLoading = false;
            playerTrack.textContent = 'OFFLINE';
            playerTrack.style.color = '#ef4444';
            playerLabel.textContent = 'STREAM OFFLINE';
            updateUI();
        });

        audio.addEventListener('ended', () => {
            isPlaying = false;
            updateUI();
        });
    }

    async function loadStream() {
        if (isLoading || audio) return;
        isLoading = true;
        console.log('[Player] Carregando stream...');

        try {
            audio = new Audio();
            audio.src = STREAM_URL;
            audio.crossOrigin = 'anonymous';
            audio.preload = 'none';

            audio.addEventListener('canplaythrough', () => {
                console.log('[Player] Stream pronta para tocar');
            });

            audio.addEventListener('loadedmetadata', () => {
                console.log('[Player] Metadata carregada, duração:', audio.duration);
            });

            setupListeners();

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                await playPromise;
                isPlaying = true;
                isLoading = false;
                updateUI();
                console.log('[Player] Reprodução iniciada');
            }
        } catch (err) {
            console.log('[Player] Erro ao carregar stream:', err.message || err);
            isLoading = false;
            if (playerTrack) {
                playerTrack.textContent = 'OFFLINE';
                playerTrack.style.color = '#ef4444';
            }
            if (playerLabel) {
                playerLabel.textContent = 'FALHA AO CONECTAR';
            }
            updateUI();
        }
    }

    playBtn.addEventListener('click', async () => {
        if (!audio) {
            await loadStream();
        } else if (isPlaying) {
            audio.pause();
        } else {
            try {
                await audio.play();
            } catch (err) {
                console.log('Erro ao reproduzir:', err);
                playerTrack.textContent = 'OFFLINE';
                playerTrack.style.color = '#ef4444';
            }
        }
    });
}
// END PLAYER SYSTEM