// ========================================
// R.B STUDIO - Main JavaScript
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  initHeader();
  initMobileMenu();
  initSplash();
  initScrollProgress();
  initReveal();
  initAudioVisualizer();
  initMiniVisualizer();
  initPlayer();
  initHeaderPlayer();
  initBackToTop();
  initHeroButtons();
  autoResumeIfNeeded();
});

// ========================================
// Particles Background
// ========================================
function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;

  // Fewer particles on mobile for better performance
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 20 : 50;

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";
    p.style.width = Math.random() * 4 + 2 + "px";
    p.style.height = p.style.width;
    p.style.animationDelay = Math.random() * 5 + "s";
    p.style.animationDuration = Math.random() * 5 + 5 + "s";
    p.style.opacity = Math.random() * 0.6 + 0.2;
    container.appendChild(p);
  }
}

// ========================================
// Header Scroll Effect
// ========================================
function initHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });
}

// ========================================
// Mobile Menu
// ========================================
function initMobileMenu() {
  const btn = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    nav.classList.toggle("active");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      btn.classList.remove("active");
      nav.classList.remove("active");
    });
  });
}

// ========================================
// Splash Screen
// ========================================
function initSplash() {
  const splash = document.getElementById("splashScreen");
  if (!splash) return;

  let width = 0;
  const progress = document.getElementById("splashProgress");
  const interval = setInterval(() => {
    width += Math.random() * 20;
    if (width >= 100) {
      width = 100;
      progress.style.width = "100%";
      clearInterval(interval);
      setTimeout(() => {
        splash.classList.add("hidden");
        setTimeout(() => (splash.style.display = "none"), 500);
      }, 400);
    } else {
      progress.style.width = width + "%";
    }
  }, 100);
}

// ========================================
// Scroll Progress Bar
// ========================================
function initScrollProgress() {
  const bar = document.getElementById("scrollProgressBar");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const scrolled =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      100;
    bar.style.width = scrolled + "%";
  });
}

// ========================================
// ========================================
// Scroll Reveal
// ========================================
function initReveal() {
  const elements = document.querySelectorAll(".fade-up");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 },
  );

  elements.forEach((el) => observer.observe(el));
}

// ========================================
// AUDIO VISUALIZER SYSTEM
// ========================================
function initAudioVisualizer() {
  const canvas = document.getElementById("mainVisualizer");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Configurar canvas com DPI correta
  function setupCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  }
  setupCanvas();
  window.addEventListener("resize", setupCanvas);

  // Cores do gradiente (esquerda para direita)
  const colors = {
    green: "#39FF14",
    greenLight: "#7CFF5B",
    yellow: "#FFD400",
    purple: "#A855F7",
    purpleIntense: "#7C3AED",
  };

  // Configurações do visualizador
  const config = {
    barCount: 48, // Número de barras
    barWidth: 3, // Largura das barras (px)
    barGap: 2, // Espaço entre barras
    minHeight: 4, // Altura mínima das barras
    maxHeightMultiplier: 0.85, // Multiplicador de altura máxima
    smoothing: 0.75, // Suavização (0-1)
    reflection: 0.25, // Reflexo nas bordas
  };

  // Criar gradiente
  function createGradient(width, height) {
    const gradient = ctx.createLinearGradient(0, height, width, 0);
    gradient.addColorStop(0, colors.green);
    gradient.addColorStop(0.25, colors.greenLight);
    gradient.addColorStop(0.5, colors.yellow);
    gradient.addColorStop(0.75, colors.purple);
    gradient.addColorStop(1, colors.purpleIntense);
    return gradient;
  }

  // Variáveis doanalisador
  let analyser = null;
  let audioContext = null;
  let sourceNode = null;
  let dataArray = null;
  let animationId = null;
  let isInitialized = false;

  // Inicializar Web Audio API
  function initWebAudio(audioElement) {
    if (isInitialized) return;

    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = config.smoothing;

      // Conectar source ao analyser
      sourceNode = audioContext.createMediaElementSource(audioElement);
      sourceNode.connect(analyser);
      analyser.connect(audioContext.destination);

      dataArray = new Uint8Array(analyser.frequencyBinCount);
      isInitialized = true;

      console.log("[Visualizer] Web Audio API inicializada");
    } catch (err) {
      console.log("[Visualizer] Erro ao inicializar Web Audio API:", err);
    }
  }

  // Desenhar visualizador (modo fallback CSS quando Web Audio não disponível)
  function drawFallback() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerY = height / 2;
    const barTotalWidth = config.barWidth + config.barGap;
    const startX = (width - config.barCount * barTotalWidth) / 2;

    ctx.clearRect(0, 0, width, height);

    // Gerar movimento orgânico quando não há áudio
    const time = Date.now() / 1000;

    for (let i = 0; i < config.barCount; i++) {
      const x = startX + i * barTotalWidth;

      // Altura com variação orgânica
      const centerDist =
        Math.abs(i - config.barCount / 2) / (config.barCount / 2);
      const centerBoost = 1 - centerDist * 0.3;
      const baseHeight = config.minHeight * 1.5;
      const waveHeight = Math.sin(time * 2 + i * 0.3) * 8 * centerBoost;
      const waveHeight2 = Math.cos(time * 1.5 + i * 0.2) * 6;
      const barHeight = Math.max(
        config.minHeight,
        baseHeight + waveHeight + waveHeight2,
      );

      // Calcular posiçãoY (centralizado)
      const y = centerY - barHeight / 2;

      // Criar glow
      ctx.shadowColor = colors.purple;
      ctx.shadowBlur = 12;

      // Desenhar barra
      ctx.fillStyle = createGradient(width, height);
      ctx.fillRect(x, y, config.barWidth, barHeight);
    }

    // Resetar shadow
    ctx.shadowBlur = 0;
  }

  // Desenhar com dados reais do analisador
  function drawWithAudioData() {
    if (!analyser || !dataArray) {
      drawFallback();
      return;
    }

    const rect = canvas.parentElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerY = height / 2;
    const barTotalWidth = config.barWidth + config.barGap;
    const startX = (width - config.barCount * barTotalWidth) / 2;

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, width, height);

    const time = Date.now() / 1000;

    for (let i = 0; i < config.barCount; i++) {
      const x = startX + i * barTotalWidth;

      // Obter dados de frequência
      const dataIndex = Math.floor((i / config.barCount) * dataArray.length);
      const value = dataArray[dataIndex];

      // Altura baseada no áudio + variação orgânica
      const normalizedValue = value / 255;
      const centerDist =
        Math.abs(i - config.barCount / 2) / (config.barCount / 2);
      const centerBoost = 1 - centerDist * 0.25;
      const minHeight = config.minHeight * 2;
      const audioHeight =
        normalizedValue * (height * config.maxHeightMultiplier) * centerBoost;
      const organicOffset = Math.sin(time * 3 + i * 0.4) * 3 * normalizedValue;
      const barHeight = Math.max(minHeight, audioHeight + organicOffset);

      const y = centerY - barHeight / 2;

      // Glow mais intenso nas barras altas
      const intensity = normalizedValue;
      ctx.shadowColor = intensity > 0.5 ? colors.yellow : colors.purple;
      ctx.shadowBlur = 8 + intensity * 16;

      // Gradiente por barra
      const barGradient = ctx.createLinearGradient(
        x,
        y,
        x + config.barWidth,
        y + barHeight,
      );
      barGradient.addColorStop(0, colors.green);
      barGradient.addColorStop(0.3, colors.greenLight);
      barGradient.addColorStop(0.5, colors.yellow);
      barGradient.addColorStop(0.7, colors.purple);
      barGradient.addColorStop(1, colors.purpleIntense);

      ctx.fillStyle = barGradient;
      ctx.fillRect(x, y, config.barWidth, barHeight);
    }

    ctx.shadowBlur = 0;

    // Pontos luminosos ao fundo
    drawBackgroundParticles();
  }

  // Partículas luminosas ao fundo
  function drawBackgroundParticles() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const time = Date.now() / 1000;

    for (let i = 0; i < 5; i++) {
      const x = (Math.sin(time * 0.5 + i * 2) * 0.5 + 0.5) * rect.width;
      const y = (Math.cos(time * 0.3 + i * 1.5) * 0.5 + 0.5) * rect.height;
      const size = 2 + Math.sin(time * 2 + i) * 1;
      const alpha = 0.3 + Math.sin(time * 1.5 + i) * 0.2;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
      ctx.fill();
    }
  }

  // Loop de animação
  function animate() {
    if (isInitialized && analyser) {
      drawWithAudioData();
    } else {
      drawFallback();
    }
    animationId = requestAnimationFrame(animate);
  }

  // Iniciar visualizador
  window.visualizerStart = function (audioElement) {
    if (!animationId) {
      animate();
    }
    if (audioElement && !isInitialized) {
      initWebAudio(audioElement);
    }
  };

  // Parar visualizador
  window.visualizerStop = function () {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };
}

// ========================================
// BACK TO TOP BUTTON
// ========================================
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  // Mostrar botão ao rolar
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  });

  // Clique para subir
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ========================================
// HEADER PLAYER (Fixed at top)
// ========================================
function initHeaderPlayer() {
  const headerBtn = document.getElementById("headerPlayBtn");
  if (!headerBtn) return;

  // Sync icon with global state
  if (globalIsPlaying) {
    headerBtn.querySelector("i").className = "fas fa-pause";
  }

  headerBtn.addEventListener("click", () => {
    togglePlay();
  });
}

// ========================================
// HERO BUTTONS
// ========================================
function initHeroButtons() {
  // btn-primary: scroll to player (only for <button> elements, not <a> links)
  document.querySelectorAll("button.btn-primary").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      togglePlay();
      scrollToPlayer();
    });
  });

  // btn-secondary: just play
  document.querySelectorAll("button.btn-secondary").forEach((btn) => {
    btn.addEventListener("click", () => {
      togglePlay();
    });
  });
}

// ========================================
// GLOBAL AUDIO (persistent across pages)
// ========================================
let globalAudio = null;
let globalIsPlaying = false;
const STREAM_URL = "https://stream.zeno.fm/afkw3v1gva0uv";

// Check sessionStorage for persisted state
const wasPlaying = sessionStorage.getItem("rbstudio_playing") === "true";

function getOrCreateAudio() {
  if (!globalAudio) {
    globalAudio = new Audio();
    globalAudio.src = STREAM_URL;
    globalAudio.crossOrigin = "anonymous";
    globalAudio.addEventListener("playing", () => {
      globalIsPlaying = true;
      sessionStorage.setItem("rbstudio_playing", "true");
      updateAllPlayers();
    });
    globalAudio.addEventListener("pause", () => {
      globalIsPlaying = false;
      sessionStorage.setItem("rbstudio_playing", "false");
      updateAllPlayers();
    });
  }
  return globalAudio;
}

// Auto-resume if was playing
function autoResumeIfNeeded() {
  if (wasPlaying && !globalIsPlaying) {
    const audio = getOrCreateAudio();
    audio.play().catch(() => {});
  }
}

function updateAllPlayers() {
  // Update only player-specific play buttons
  document
    .querySelectorAll(".play-btn, .header-play-btn")
    .forEach((btn) => {
      const icon = btn.querySelector("i");
      if (icon && !btn.classList.contains("header-play-btn")) {
        icon.className = globalIsPlaying ? "fas fa-pause" : "fas fa-play";
      }
    });
  // Update header player
  const headerIcon = document.querySelector("#headerPlayBtn i");
  if (headerIcon)
    headerIcon.className = globalIsPlaying ? "fas fa-pause" : "fas fa-play";
  // Update player section
  const playerTrack = document.querySelector(".player-section .player-track");
  const playerLabel = document.querySelector(".player-section .player-label");
  if (playerTrack) {
    playerTrack.textContent = globalIsPlaying ? "AO VIVO" : "PARADO";
    playerTrack.style.color = globalIsPlaying ? "#a855f7" : "#9ca3af";
  }
  if (playerLabel) {
    playerLabel.textContent = globalIsPlaying ? "TOCANDO AGORA" : "AGUARDANDO";
  }
  // Update mini visualizer
  if (window.miniVisualizerPlay && globalIsPlaying) window.miniVisualizerPlay();
  if (window.miniVisualizerStop && !globalIsPlaying)
    window.miniVisualizerStop();
}

async function togglePlay() {
  const audio = getOrCreateAudio();
  if (globalIsPlaying) {
    audio.pause();
  } else {
    try {
      await audio.play();
    } catch (e) {
      console.log("Play error:", e);
    }
  }
}

function scrollToPlayer() {
  const player = document.querySelector(".player-section");
  if (player) player.scrollIntoView({ behavior: "smooth" });
}

// ========================================
// PLAYER SYSTEM
// ========================================
function initPlayer() {
  const playBtn = document.querySelector(".play-btn");
  if (!playBtn) return;

  // Use global audio system
  if (globalAudio && globalIsPlaying) {
    updateAllPlayers();
  }

  playBtn.addEventListener("click", () => {
    togglePlay();
  });
}
// ========================================
// MINI VISUALIZER (Player)
// ========================================
function initMiniVisualizer() {
  const canvas = document.getElementById("playerVisualizer");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Configurar canvas com DPI correta
  function setupCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  }
  setupCanvas();
  window.addEventListener("resize", setupCanvas);

  // Cores do gradiente
  const colors = ["#39FF14", "#7CFF5B", "#FFD400", "#A855F7", "#7C3AED"];

  // Configurações - discreto e leve
  const config = {
    barCount: 28, // 28 barras (entre 24-36)
    barWidth: 2, // 2px
    barGap: 2, // 2px gap
    minHeight: 2, // Altura mínima
    maxHeight: 24, // Altura máxima no player
  };

  // Criar gradiente por barra
  function createGradient(width) {
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.25, colors[1]);
    gradient.addColorStop(0.5, colors[2]);
    gradient.addColorStop(0.75, colors[3]);
    gradient.addColorStop(1, colors[4]);
    return gradient;
  }

  // Variáveis
  let animationId = null;
  let isPlaying = false;

  // Desenhar
  function draw() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerY = height / 2;
    const barTotalWidth = config.barWidth + config.barGap;
    const startX = (width - config.barCount * barTotalWidth) / 2;

    ctx.clearRect(0, 0, width, height);
    const time = Date.now() / 1000;

    for (let i = 0; i < config.barCount; i++) {
      const x = startX + i * barTotalWidth;

      // Movimento orgânico simulado
      const centerDist =
        Math.abs(i - config.barCount / 2) / (config.barCount / 2);
      const centerBoost = 1 - centerDist * 0.4;
      const wave1 = Math.sin(time * 2 + i * 0.25);
      const wave2 = Math.cos(time * 1.5 + i * 0.15);
      const baseH =
        config.minHeight +
        (isPlaying ? config.maxHeight * 0.7 : config.maxHeight * 0.3);
      const variation = (wave1 * 0.5 + wave2 * 0.3) * centerBoost;
      const barHeight = Math.max(
        config.minHeight,
        baseH + variation * (isPlaying ? 1 : 0.5),
      );

      const y = centerY - barHeight / 2;

      // Glow suave
      ctx.shadowColor = colors[3];
      ctx.shadowBlur = isPlaying ? 8 : 4;

      // Desenhar barra
      ctx.fillStyle = createGradient(width);
      ctx.fillRect(x, y, config.barWidth, barHeight);
    }

    ctx.shadowBlur = 0;
  }

  // Loop de animação
  function animate() {
    draw();
    animationId = requestAnimationFrame(animate);
  }

  // Iniciar
  window.miniVisualizerPlay = function () {
    isPlaying = true;
    if (!animationId) animate();
  };

  // Parar
  window.miniVisualizerStop = function () {
    isPlaying = false;
  };
}

// END PLAYER SYSTEM
