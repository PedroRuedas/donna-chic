// ===== Configurações do salão =====
// Número do WhatsApp com DDI + DDD, só dígitos (ex.: 5511999999999)
const WHATSAPP = "5517997146299";

// ===== Portfólio =====
// Fotos em images/portfolio/. "alta: true" ocupa duas linhas da grade.
const PORTFOLIO = [
  { src: "images/portfolio/01.jpg", titulo: "Liso longo iluminado",       categoria: "Longo" },
  { src: "images/portfolio/02.jpg", titulo: "Ondas com mechas loiras",    categoria: "Longo", alta: true },
  { src: "images/portfolio/03.jpg", titulo: "Repicado com mechas",        categoria: "Médio" },
  { src: "images/portfolio/04.jpg", titulo: "Pontas viradas com mechas",  categoria: "Médio" },
  { src: "images/portfolio/05.jpg", titulo: "Camadas escovadas",          categoria: "Médio" },
  { src: "images/portfolio/06.jpg", titulo: "Liso com ombré acobreado",   categoria: "Longo" },
  { src: "images/portfolio/07.jpg", titulo: "Chanel com volume",          categoria: "Curto" },
  { src: "images/portfolio/08.jpg", titulo: "Liso alinhado da raiz",      categoria: "Liso" },
  { src: "images/portfolio/09.jpg", titulo: "Raiz alinhada e brilho",     categoria: "Liso" },
  { src: "images/portfolio/10.jpg", titulo: "Liso extra longo",           categoria: "Longo" },
  { src: "images/portfolio/11.jpg", titulo: "Ombré iluminado",            categoria: "Longo" },
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const placeholderHTML = (label) => `
  <div class="placeholder">
    <div>
      <svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round">
        <circle cx="18" cy="46" r="8"/><circle cx="46" cy="46" r="8"/>
        <path d="M24 40 L48 8"/><path d="M40 40 L16 8"/>
      </svg>
      <small>${label}</small>
    </div>
  </div>`;

const mediaHTML = (item, lazy = true) =>
  `<img src="${item.src}" alt="${item.titulo}" ${lazy ? 'loading="lazy"' : ""}
        onerror="this.outerHTML = placeholderHTML('Foto em breve')">`;

// ===== Monta a galeria =====
const gallery = document.getElementById("gallery");

gallery.innerHTML = PORTFOLIO.map((item, i) => `
  <div class="gallery__item${item.alta ? " gallery__item--tall" : ""}" data-index="${i}" tabindex="0" role="button"
       aria-label="Ampliar ${item.titulo}">
    ${mediaHTML(item)}
    <div class="gallery__overlay">
      <span>${item.categoria}</span>
      <h3>${item.titulo}</h3>
    </div>
  </div>`).join("");

const items = [...gallery.querySelectorAll(".gallery__item")];

// ===== Revelação ao rolar =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

const observeReveal = (els) => {
  // escalona elementos irmãos que entram juntos
  els.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.matches(".reveal, .gallery__item:not(.is-hidden)"));
    const pos = siblings.indexOf(el);
    const isSingleColumn = window.innerWidth <= 560;
    el.style.transitionDelay = isSingleColumn || pos < 0 ? "0ms" : `${(pos % 4) * 110}ms`;
    revealObserver.observe(el);
  });
};

observeReveal(document.querySelectorAll(".reveal"));
observeReveal(items);

// ===== Filtros =====
const filterButtons = document.querySelectorAll(".filter");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

    const filtro = btn.dataset.filter;
    items.forEach((el) => {
      const show = filtro === "todos" || el.dataset.categoria === filtro;
      el.classList.toggle("is-hidden", !show);
      el.classList.remove("is-visible");
    });
    // força o navegador a aplicar o estado inicial antes de animar de novo
    void gallery.offsetHeight;
    observeReveal(items.filter((el) => !el.classList.contains("is-hidden")));
  });
});

// ===== Lightbox (com swipe no celular) =====
const lightbox = document.getElementById("lightbox");
const lbMedia = document.getElementById("lbMedia");
const lbCaption = document.getElementById("lbCaption");
let current = 0;

const visibleIndexes = () =>
  items.filter((el) => !el.classList.contains("is-hidden")).map((el) => Number(el.dataset.index));

const showItem = (index) => {
  current = index;
  const item = PORTFOLIO[index];
  lbMedia.innerHTML = mediaHTML(item, false);
  lbCaption.textContent = item.titulo;
  lbMedia.animate(
    [{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }],
    { duration: reduceMotion ? 0 : 350, easing: "ease-out" }
  );
};

const openLightbox = (index) => {
  showItem(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const step = (dir) => {
  const list = visibleIndexes();
  const pos = list.indexOf(current);
  showItem(list[(pos + dir + list.length) % list.length]);
};

items.forEach((el) => {
  el.addEventListener("click", () => openLightbox(Number(el.dataset.index)));
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(Number(el.dataset.index)); }
  });
});

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => step(-1));
document.getElementById("lbNext").addEventListener("click", () => step(1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

let touchX = null;
lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  touchX = null;
});

// ===== Vídeos: tocam sozinhos quando aparecem na tela =====
const reels = [...document.querySelectorAll(".reel")];
const reelsTrack = document.getElementById("reels");
const reelDots = [...document.querySelectorAll("#reelsDots span")];

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const video = entry.target.querySelector("video");
    const ativo = entry.isIntersecting && entry.intersectionRatio >= 0.55;
    entry.target.classList.toggle("is-playing", ativo);
    if (ativo) {
      video.play().catch(() => {});
      const i = reels.indexOf(entry.target);
      reelDots.forEach((d, j) => d.classList.toggle("is-active", j === i));
    } else {
      video.pause();
    }
  });
}, { threshold: [0, 0.55, 0.8] });

reels.forEach((reel) => {
  const video = reel.querySelector("video");
  const bar = reel.querySelector(".reel__progress span");
  const sound = reel.querySelector(".reel__sound");

  videoObserver.observe(reel);
  video.addEventListener("timeupdate", () => {
    if (video.duration) bar.style.transform = `scaleX(${video.currentTime / video.duration})`;
  });

  sound.addEventListener("click", (e) => {
    e.stopPropagation();
    const ligar = video.muted;
    reels.forEach((r) => {
      r.querySelector("video").muted = true;
      r.classList.remove("has-sound");
      r.querySelector(".reel__sound").setAttribute("aria-label", "Ligar o som");
    });
    if (ligar) {
      video.muted = false;
      video.play().catch(() => {});
      reel.classList.add("has-sound");
      sound.setAttribute("aria-label", "Desligar o som");
    }
  });

  // tocar no vídeo pausa / continua
  video.addEventListener("click", () => (video.paused ? video.play().catch(() => {}) : video.pause()));
});

// no celular, centraliza o vídeo do meio no carrossel ao carregar
if (reelsTrack && reelsTrack.scrollWidth > reelsTrack.clientWidth) {
  reelDots.forEach((dot, i) => dot.addEventListener("click", () =>
    reels[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })));
}

// ===== Brilhos em volta do círculo do brasão =====
const sparks = document.getElementById("sparks");
for (let i = 0; i < 26; i++) {
  // concentrados nos lados, como na logo
  const side = i % 2 ? 1 : -1;
  const angle = (side * (35 + Math.random() * 110) - 90) * (Math.PI / 180);
  const r = 96 + (Math.random() - 0.3) * 12;
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("class", "spark");
  c.setAttribute("cx", (100 + Math.cos(angle) * r).toFixed(1));
  c.setAttribute("cy", (100 + Math.sin(angle) * r).toFixed(1));
  c.setAttribute("r", (0.5 + Math.random() * 1.4).toFixed(2));
  c.style.animationDelay = `${2 + Math.random() * 2.4}s`;
  c.style.animationDuration = `${1.8 + Math.random() * 2}s`;
  sparks.appendChild(c);
}

// ===== Partículas flutuantes =====
if (!reduceMotion) {
  const particles = document.getElementById("particles");
  const total = window.innerWidth < 600 ? 22 : 40;
  for (let i = 0; i < total; i++) {
    const p = document.createElement("span");
    const size = 2 + Math.random() * 5;
    p.className = "particle" + (Math.random() > 0.7 ? " particle--white" : "");
    p.style.cssText = `
      left:${Math.random() * 100}%;
      width:${size}px; height:${size}px;
      --drift:${(Math.random() - 0.5) * 120}px;
      animation-duration:${8 + Math.random() * 10}s;
      animation-delay:${-Math.random() * 18}s;`;
    particles.appendChild(p);
  }
}

// ===== Rolagem: header, barra de progresso, parallax =====
const header = document.getElementById("header");
const progress = document.getElementById("scrollProgress");
const heroContent = document.querySelector(".hero__content");
const parallaxEls = document.querySelectorAll("[data-parallax]");
const aboutFrame = document.querySelector(".about__frame");
let ticking = false;

const onScroll = () => {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const vh = window.innerHeight;

  header.classList.toggle("is-scrolled", y > 40);
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  fab.classList.toggle("is-shown", y > vh * 0.6);

  if (!reduceMotion) {
    if (y < vh) {
      const t = y / vh;
      heroContent.style.transform = `translateY(${y * 0.35}px) scale(${1 - t * 0.12})`;
      heroContent.style.opacity = 1 - t * 1.2;
    }
    parallaxEls.forEach((el) => {
      el.style.translate = `0 ${y * Number(el.dataset.parallax)}px`;
    });
    if (aboutFrame) {
      const r = aboutFrame.getBoundingClientRect();
      const center = (r.top + r.height / 2 - vh / 2) / vh;
      aboutFrame.style.transform = `rotate(${center * -6}deg) translateY(${center * 30}px)`;
    }
  }
  ticking = false;
};

window.addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });

// ===== Contadores =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const stat = el.closest(".stat");
    const target = Number(el.dataset.count);
    const duration = reduceMotion ? 0 : 1800;
    const start = performance.now();
    stat.classList.add("is-counting");

    const tick = (now) => {
      const t = duration ? Math.min((now - start) / duration, 1) : 1;
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (t === 1 && target >= 500 ? "+" : "") + Math.round(target * eased).toLocaleString("pt-BR");
      if (t < 1) requestAnimationFrame(tick);
      else stat.classList.remove("is-counting");
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

// ===== Menu mobile =====
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  menuToggle.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
};

menuToggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// ===== Botão flutuante do WhatsApp =====
const fab = document.createElement("a");
fab.className = "fab";
fab.href = `https://wa.me/${WHATSAPP}`;
fab.target = "_blank";
fab.rel = "noopener";
fab.setAttribute("aria-label", "Falar no WhatsApp");
fab.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>`;
document.body.appendChild(fab);

// ===== Formulário -> WhatsApp =====
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const texto =
    `Olá, Donna Chic! Meu nome é ${data.get("nome")}.\n` +
    `Gostaria de agendar: ${data.get("servico")}.\n` +
    (data.get("mensagem") ? `${data.get("mensagem")}` : "");
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
  // se o navegador bloquear a nova aba, abre na mesma
  if (!window.open(url, "_blank")) window.location.href = url;
});

// ===== Ano no rodapé =====
document.getElementById("year").textContent = new Date().getFullYear();

onScroll();
