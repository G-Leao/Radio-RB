// ========================================
// R.B STUDIO - JavaScript Premium
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    try {
        initSplashScreen();
        initHeader();
        initHamburgerMenu();
        initScrollReveal();
        initScrollProgress();
        initBackToTop();
        initParticles();
        initSmoothScroll();
        initPlayerControls();
        initNewsFilters();
        initNewsSearch();
    } catch (e) {
        console.error('JS Error:', e);
    }
});

// ========================================
// Splash Screen
// ========================================
function initSplashScreen() {
    const splash = document.getElementById('splashScreen');
    const progress = document.getElementById('splashProgress');
    if (!splash || !progress) return;

    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 15;
        if (width >= 100) {
            width = 100;
            progress.style.width = width + '%';
            clearInterval(interval);
            setTimeout(() => {
                splash.classList.add('hidden');
                setTimeout(() => {
                    splash.style.display = 'none';
                }, 500);
            }, 300);
        } else {
            progress.style.width = width + '%';
        }
    }, 150);
}

// ========================================
// Header Scroll Effect
// ========================================
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ========================================
// Hamburger Menu
// ========================================
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// ========================================
// Scroll Reveal
// ========================================
function initScrollReveal() {
    const elements = document.querySelectorAll('.section-header, .program-card, .rede-card, .pub-content, .footer-content > div, .app-banner, .noticia-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        if (el) {
            el.classList.add('reveal');
            observer.observe(el);
        }
    });
}

// ========================================
// Scroll Progress Bar
// ========================================
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ========================================
// Back to Top
// ========================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// Particles
// ========================================
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 10;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${posX}%;
            top: ${posY}%;
            animation: float ${duration}s linear ${delay}s infinite;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;

        container.appendChild(particle);
    }
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

// ========================================
// Player Controls
// ========================================
function initPlayerControls() {
    const playBtn = document.querySelector('.btn-play-main');
    const volumeSlider = document.querySelector('.volume-slider');

    if (playBtn) {
        let isPlaying = false;
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            const icon = playBtn.querySelector('i');
            if (isPlaying) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }

    if (volumeSlider) {
        const volumeLevel = volumeSlider.querySelector('.volume-level');
        if (volumeLevel) {
            volumeSlider.addEventListener('click', (e) => {
                const rect = volumeSlider.getBoundingClientRect();
                let percentage = ((e.clientX - rect.left) / rect.width) * 100;
                percentage = Math.max(0, Math.min(100, percentage));
                volumeLevel.style.width = percentage + '%';
            });
        }
    }
}

// ========================================
// News Filters
// ========================================
function initNewsFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.noticia-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ========================================
// News Search
// ========================================
function initNewsSearch() {
    const searchInput = document.getElementById('newsSearch');
    const cards = document.querySelectorAll('.noticia-card');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();

            cards.forEach(card => {
                const title = card.querySelector('.noticia-title')?.textContent.toLowerCase() || '';
                const resumo = card.querySelector('.noticia-resumo')?.textContent.toLowerCase() || '';

                if (title.includes(query) || resumo.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}