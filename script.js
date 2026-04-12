/* =============================================
   HAMBURGER MENU
   ============================================= */
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

/* =============================================
   THEME TOGGLE
   ============================================= */
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");
  const isLight = body.classList.toggle("light");
  btn.querySelector(".theme-icon").textContent = isLight ? "🌙" : "☀️";
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

// Apply saved theme on load
(function () {
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light");
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.querySelector(".theme-icon").textContent = "🌙";
  }
})();

/* =============================================
   PAGE LOAD FADE-IN
   ============================================= */
window.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initTyped();
  initParticles();
  initCursorGlow();
  initTiltCards();
  initMagneticButtons();
  initStaggeredTags();
});

/* =============================================
   LOADER
   ============================================= */
function initLoader() {
  const loader = document.getElementById("loader");
  const bar    = document.getElementById("loader-bar");
  const text   = document.getElementById("loader-text");
  if (!loader) return;

  const messages = ["Initializing...", "Loading assets...", "Almost ready...", "Welcome!"];
  let progress = 0;
  let msgIndex = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 8;
    if (progress > 100) progress = 100;

    bar.style.width = progress + "%";
    text.textContent = messages[Math.min(msgIndex, messages.length - 1)];
    msgIndex++;

    if (progress >= 100) {
      clearInterval(interval);
      text.textContent = "Welcome!";
      setTimeout(() => {
        loader.classList.add("hide");
        document.body.classList.remove("loading");
      }, 500);
    }
  }, 320);

  // Safety fallback — hide after 3.5s no matter what
  setTimeout(() => {
    loader.classList.add("hide");
    document.body.classList.remove("loading");
  }, 3500);
}

/* =============================================
   SCROLL REVEAL
   ============================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
);
document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

/* =============================================
   TYPED TEXT EFFECT
   ============================================= */
function initTyped() {
  const el = document.getElementById("typed-role");
  if (!el) return;

  const roles = [
    "Junior Application Developer",
    "Junior Data Analyst",
    "ETL Pipeline Builder",
    "Python Developer",
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = roles[roleIndex];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 45 : 90);
  }
  type();
}

/* =============================================
   CANVAS PARTICLE BACKGROUND
   ============================================= */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.4,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.4 + 0.1,
  }));

  let mouse = { x: null, y: null };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 38, 38, ${p.alpha})`;
      ctx.fill();
    });

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(185, 28, 44, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(220, 38, 38, ${0.2 * (1 - dist / 160)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* =============================================
   CURSOR GLOW FOLLOWER
   ============================================= */
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;

  let mx = 0, my = 0, cx = 0, cy = 0;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.transform = `translate(${cx - 200}px, ${cy - 200}px)`;
    requestAnimationFrame(animate);
  }
  animate();
}

/* =============================================
   3D TILT ON PROJECT CARDS
   ============================================= */
function initTiltCards() {
  document.querySelectorAll(".color-container, .details-container").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      card.style.transition = "transform 0.1s ease";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.5s cubic-bezier(0.4,0,0.2,1)";
    });
  });
}

/* =============================================
   MAGNETIC BUTTON EFFECT
   ============================================= */
function initMagneticButtons() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      btn.style.transition = "transform 0.1s ease";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
      btn.style.transition = "transform 0.4s cubic-bezier(0.4,0,0.2,1)";
    });
  });
}

/* =============================================
   STAGGERED SKILL TAG ENTRANCE
   ============================================= */
function initStaggeredTags() {
  const tagObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".skill-tag").forEach((tag, i) => {
            setTimeout(() => tag.classList.add("tag-visible"), i * 60);
          });
          tagObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const tagsContainer = document.querySelector(".skills-tags");
  if (tagsContainer) tagObserver.observe(tagsContainer);
}

/* =============================================
   COUNT-UP STATS
   ============================================= */
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 2000;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-number").forEach(countUp);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
const statsStrip = document.querySelector(".stats-strip");
if (statsStrip) statsObserver.observe(statsStrip);

/* =============================================
   SKILL PROGRESS BARS
   ============================================= */
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".skill-bar-fill").forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.width + "%";
          }, i * 120);
        });
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
const skillsSection = document.querySelector("#experience");
if (skillsSection) barObserver.observe(skillsSection);

/* =============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================= */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add("active");
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach((s) => navObserver.observe(s));

/* =============================================
   NAV SCROLL SHADOW
   ============================================= */
window.addEventListener("scroll", () => {
  const nav = document.querySelector("#desktop-nav");
  if (nav) {
    nav.style.boxShadow = window.scrollY > 20 ? "0 4px 30px rgba(0,0,0,0.6)" : "none";
  }
});
