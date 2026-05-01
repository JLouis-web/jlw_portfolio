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
  initHeroGSAP();
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
   CANVAS PARTICLE BACKGROUND (global — other sections)
   ============================================= */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.3,
    dx: (Math.random() - 0.5) * 0.35,
    dy: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.3 + 0.08,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,38,38,${p.alpha})`;
      ctx.fill();
    });
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
   GSAP HERO — ENTRANCE + INTERACTIONS + PARTICLES
   ============================================= */
function initHeroGSAP() {
  if (typeof gsap === "undefined") return;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // ── STEP 1: Split name rows into individual letter spans ─────────────────
  function splitToChars(rowEl, isAccent) {
    const text = rowEl.textContent;
    rowEl.textContent = "";
    rowEl.style.display = "inline"; // keep inline for line-break to work
    [...text].forEach((ch) => {
      if (ch === " ") {
        const sp = document.createElement("span");
        sp.className = "hero-char-space";
        sp.setAttribute("aria-hidden", "true");
        rowEl.appendChild(sp);
      } else {
        const span = document.createElement("span");
        span.className = "hero-char" + (isAccent ? " accent" : "");
        span.textContent = ch;
        rowEl.appendChild(span);
      }
    });
    return rowEl.querySelectorAll(".hero-char");
  }

  const row1 = document.getElementById("hero-row-1");
  const row2 = document.getElementById("hero-row-2");
  const chars1 = row1 ? splitToChars(row1, false) : [];
  const chars2 = row2 ? splitToChars(row2, true)  : [];
  const allChars = [...chars1, ...chars2];

  // ── STEP 2: Set initial hidden states ────────────────────────────────────
  gsap.set(allChars, { yPercent: 120, opacity: 0 });
  gsap.set(["#hero-eyebrow", "#hero-role", "#hero-desc",
            "#hero-divider", "#hero-btns", "#socials-container",
            "#hero-scroll"], { opacity: 0, y: 22 });
  gsap.set(".hero-name-underline", { scaleX: 0, transformOrigin: "left center", opacity: 1 });
  gsap.set(".hero-name-outline",   { opacity: 0, y: 40 });

  // ── STEP 3: Entrance timeline (fires after loader hides) ──────────────────
  const startAnim = () => {
    const tl = gsap.timeline();

    // Eyebrow
    tl.to("#hero-eyebrow", { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" });

    // Row 1 letters stagger up
    tl.to(chars1, {
      yPercent: 0, opacity: 1, duration: 0.7, ease: "power4.out",
      stagger: { each: 0.04, from: "start" },
    }, "-=0.2");

    // Row 2 letters stagger up with slight overshoot
    tl.to(chars2, {
      yPercent: 0, opacity: 1, duration: 0.75, ease: "back.out(1.4)",
      stagger: { each: 0.045, from: "start" },
    }, "-=0.45");

    // Underline draws across
    tl.to(".hero-name-underline", {
      scaleX: 1, duration: 0.65, ease: "power2.inOut",
    }, "-=0.25");

    // Ghost outline drifts in
    tl.to(".hero-name-outline", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5");

    // Supporting content
    tl.to(["#hero-role", "#hero-desc", "#hero-divider", "#hero-btns", "#socials-container"], {
      opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.09,
    }, "-=0.5");

    // Scroll indicator
    tl.to("#hero-scroll", { opacity: 1, y: 0, duration: 0.45 }, "-=0.1");

    // Idle breathe
    tl.add(() => {
      gsap.to("#hero-name", {
        y: -8, duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1,
      });
    });
  };

  const loader = document.getElementById("loader");
  if (loader && !loader.classList.contains("hide")) {
    const mo = new MutationObserver(() => {
      if (loader.classList.contains("hide")) { mo.disconnect(); setTimeout(startAnim, 180); }
    });
    mo.observe(loader, { attributes: true, attributeFilter: ["class"] });
    setTimeout(startAnim, 3900); // hard fallback
  } else {
    setTimeout(startAnim, 100);
  }

  if (isTouchDevice) return; // skip pointer-only effects on touch

  // ── STEP 4: Per-letter hover wave ─────────────────────────────────────────
  // Track which letters are mid-animation to allow smooth interruption
  allChars.forEach((ch, i) => {
    ch.addEventListener("mouseenter", () => {
      gsap.to(ch, {
        y: -14,
        scaleX: 1.08,
        scaleY: 0.92,
        duration: 0.22,
        ease: "power2.out",
        overwrite: true,
      });
      // Ripple to neighbours
      [-2, -1, 1, 2].forEach((offset) => {
        const neighbour = allChars[i + offset];
        if (!neighbour) return;
        const strength = Math.abs(offset) === 1 ? 7 : 3;
        gsap.to(neighbour, {
          y: -strength,
          duration: 0.28,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });

    ch.addEventListener("mouseleave", () => {
      gsap.to(ch, {
        y: 0, scaleX: 1, scaleY: 1,
        duration: 0.55, ease: "elastic.out(1, 0.5)",
        overwrite: true,
      });
      [-2, -1, 1, 2].forEach((offset) => {
        const neighbour = allChars[i + offset];
        if (!neighbour) return;
        gsap.to(neighbour, {
          y: 0, duration: 0.55, ease: "elastic.out(1, 0.5)", overwrite: "auto",
        });
      });
    });
  });

  // ── STEP 5: Whole-name parallax tilt on mousemove ─────────────────────────
  const heroSection = document.getElementById("profile");
  heroSection.addEventListener("mousemove", (e) => {
    const rect  = heroSection.getBoundingClientRect();
    const xPct  = (e.clientX - rect.left)  / rect.width  - 0.5; // -0.5 to 0.5
    const yPct  = (e.clientY - rect.top)   / rect.height - 0.5;
    gsap.to("#hero-name", {
      rotateY: xPct * 6,
      rotateX: -yPct * 4,
      x: xPct * 14,
      transformPerspective: 900,
      duration: 1.1,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(".hero-name-outline", {
      x: xPct * 28, y: yPct * 10,
      duration: 1.5, ease: "power1.out", overwrite: "auto",
    });
  });

  heroSection.addEventListener("mouseleave", () => {
    gsap.to("#hero-name", {
      rotateY: 0, rotateX: 0, x: 0,
      duration: 1.2, ease: "elastic.out(1, 0.6)", overwrite: "auto",
    });
    gsap.to(".hero-name-outline", {
      x: 0, y: 0, duration: 1.4, ease: "power2.out", overwrite: "auto",
    });
  });

  // ── STEP 6: Hero-scoped GSAP particle system ──────────────────────────────
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resizeHeroCanvas() {
    canvas.width  = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }
  resizeHeroCanvas();
  window.addEventListener("resize", resizeHeroCanvas);

  // Particle pool — 55 ambient dots
  const POOL = 55;
  const dots = Array.from({ length: POOL }, () => ({
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height,
    r:     Math.random() * 1.6 + 0.5,
    baseX: 0, baseY: 0,          // set after creation
    vx:    (Math.random() - 0.5) * 0.45,
    vy:    (Math.random() - 0.5) * 0.45,
    alpha: Math.random() * 0.35 + 0.08,
    life:  1,                    // 1 = ambient, 0 = burst (fades out)
    burst: false,
  }));
  dots.forEach((d) => { d.baseX = d.x; d.baseY = d.y; });

  let mouse = { x: -9999, y: -9999 };
  const REPULSE_RADIUS = 110;
  const REPULSE_FORCE  = 1.8;
  const LINE_DIST      = 100;

  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heroSection.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

  // Burst emitter — fires when cursor enters the name
  const heroName = document.getElementById("hero-name");
  let burstCooldown = false;
  heroName && heroName.addEventListener("mouseenter", () => {
    if (burstCooldown) return;
    burstCooldown = true;
    setTimeout(() => { burstCooldown = false; }, 600);

    const rect = heroName.getBoundingClientRect();
    const hRect = heroSection.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2 - hRect.left;
    const cy = rect.top  + rect.height / 2 - hRect.top;

    // Reuse 12 ambient dots as burst particles
    dots.slice(0, 12).forEach((d, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const speed = Math.random() * 2.5 + 1.2;
      d.x = cx; d.y = cy;
      d.vx = Math.cos(angle) * speed;
      d.vy = Math.sin(angle) * speed;
      d.alpha = 0.7;
      d.r = Math.random() * 2.5 + 1;
      d.burst = true;
      d.life = 1;
    });
  });

  function drawHeroParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach((d) => {
      if (d.burst) {
        // Burst particle: move fast, fade out, then return to ambient
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.94;
        d.vy *= 0.94;
        d.life -= 0.022;
        d.alpha = d.life * 0.7;
        if (d.life <= 0) {
          // Reset to ambient
          d.burst = false;
          d.x = d.baseX = Math.random() * canvas.width;
          d.y = d.baseY = Math.random() * canvas.height;
          d.vx = (Math.random() - 0.5) * 0.45;
          d.vy = (Math.random() - 0.5) * 0.45;
          d.alpha = Math.random() * 0.35 + 0.08;
          d.r = Math.random() * 1.6 + 0.5;
          d.life = 1;
        }
      } else {
        // Ambient drift
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

        // Cursor repulsion
        const dx   = d.x - mouse.x;
        const dy   = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPULSE_RADIUS && dist > 0) {
          const force = (1 - dist / REPULSE_RADIUS) * REPULSE_FORCE;
          d.x += (dx / dist) * force;
          d.y += (dy / dist) * force;
        }
      }

      // Draw dot
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,38,38,${d.alpha})`;
      ctx.fill();
    });

    // Connection lines between close ambient dots
    for (let i = 0; i < POOL; i++) {
      if (dots[i].burst) continue;
      for (let j = i + 1; j < POOL; j++) {
        if (dots[j].burst) continue;
        const dx   = dots[i].x - dots[j].x;
        const dy   = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DIST) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(185,28,44,${0.1 * (1 - dist / LINE_DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawHeroParticles);
  }
  drawHeroParticles();

  // ── STEP 7: ScrollTrigger — circle scale + color on scroll ─────────────────
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Color stops: top of page → deep scroll
    const circleColorStops = [
      "rgba(185,28,44,0.18)",
      "rgba(220,100,38,0.28)",
      "rgba(100,38,220,0.22)",
      "rgba(38,180,220,0.18)",
    ];

    // Main 3 concentric circles — shrink as user scrolls down
    [["#geo-c1", 1], ["#geo-c2", 0.85], ["#geo-c3", 0.7]].forEach(([id, minScale]) => {
      const el = document.querySelector(id);
      if (!el) return;
      gsap.to(el, {
        attr: { r: parseFloat(el.getAttribute("r")) * minScale },
        ease: "none",
        scrollTrigger: {
          trigger: "#profile",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
          onUpdate(self) {
            const p = self.progress;
            const idx = Math.min(Math.floor(p * (circleColorStops.length - 1)), circleColorStops.length - 2);
            const t   = (p * (circleColorStops.length - 1)) - idx;
            // Lerp between two adjacent color stops via opacity trick
            el.style.stroke = circleColorStops[idx + Math.round(t)];
          },
        },
      });
    });

    // Accent circles — expand slightly on scroll for contrast
    [["#geo-c4", 1.4], ["#geo-c5", 1.5]].forEach(([id, maxScale]) => {
      const el = document.querySelector(id);
      if (!el) return;
      gsap.to(el, {
        attr: { r: parseFloat(el.getAttribute("r")) * maxScale },
        ease: "none",
        scrollTrigger: {
          trigger: "#profile",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });
  }

  // ── STEP 8: Advanced Visual Glitch ──────────────────────────────────────────
  const nameEl = document.getElementById("hero-name");
  if (!nameEl) return;

  // Wrap for stacking context (clones are fixed, so wrap is just semantic)
  const wrap = document.createElement("div");
  wrap.className = "hero-name-wrap";
  nameEl.parentNode.insertBefore(wrap, nameEl);
  wrap.appendChild(nameEl);

  // Build two fixed-position clones with plain text rows
  function makeClone(cls) {
    const el = document.createElement("div");
    el.className = `hero-name-glitch ${cls}`;
    el.setAttribute("aria-hidden", "true");
    ["Jan Louis", "Loquias"].forEach((txt) => {
      const row = document.createElement("div");
      row.textContent = txt;
      el.appendChild(row);
    });
    document.body.appendChild(el); // fixed children of body — no stacking issues
    return el;
  }

  const cloneR = makeClone("hero-name-glitch--r");
  const cloneB = makeClone("hero-name-glitch--b");

  // SVG filter primitives
  const turbEl = document.getElementById("glitch-turb");
  const dispEl = turbEl ? turbEl.nextElementSibling : null;

  // Stamp a clone at the real name's current screen rect
  function stampClone(clone) {
    const r = nameEl.getBoundingClientRect();
    const fs = parseFloat(getComputedStyle(nameEl).fontSize);
    const lh = parseFloat(getComputedStyle(nameEl).lineHeight) || fs * 1.05;
    gsap.set(clone, {
      x: r.left,
      y: r.top,
      fontSize: fs,
      lineHeight: lh + "px",
      width: r.width,
      opacity: 0,
      skewX: 0,
      clipPath: "none",
    });
  }

  // Random clip slice
  function rClip() {
    const t = Math.random() * 70;
    const h = Math.random() * 24 + 8;
    return `inset(${t.toFixed(1)}% -8px ${(100 - t - h).toFixed(1)}% -8px)`;
  }

  // Random signed offset — ensures clones land in visibly different spots
  function rOff(min, max) {
    const v = min + Math.random() * (max - min);
    return Math.random() < 0.5 ? v : -v;
  }

  function newSeed() {
    if (turbEl) turbEl.setAttribute("seed", Math.floor(Math.random() * 999));
  }

  let glitchRunning = false;

  function runGlitch() {
    if (glitchRunning) return;
    glitchRunning = true;
    newSeed();

    // Stamp both clones at the live screen position of the name
    stampClone(cloneR);
    stampClone(cloneB);

    // Pick independent random offsets for each burst so they land differently
    const rxA = rOff(14, 28),  ryA = rOff(2, 8);
    const bxA = rOff(14, 28),  byA = rOff(2, 8);
    const rxB = rOff(10, 22),  ryB = rOff(3, 10);
    const bxB = rOff(10, 22),  byB = rOff(3, 10);

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      onComplete() {
        gsap.set([cloneR, cloneB], { opacity: 0 });
        gsap.set(nameEl, { x: 0, skewX: 0 });
        if (dispEl) dispEl.setAttribute("scale", "0");
        if (turbEl) turbEl.setAttribute("baseFrequency", "0");
        glitchRunning = false;
      },
    });

    // Phase 1 — SVG warp ramps up
    if (turbEl && dispEl) {
      tl.to(turbEl, { attr: { baseFrequency: 0.065 }, duration: 0.06 }, 0)
        .to(dispEl, { attr: { scale: 18 },            duration: 0.06 }, 0);
    }

    // Phase 2 — Burst A: clones fly to random offsets with clip slice
    tl.set(cloneR, { opacity: 1, x: `+=${rxA}`, y: `+=${ryA}`, skewX: rOff(1,3), clipPath: rClip() }, 0.02)
      .set(cloneB, { opacity: 1, x: `+=${bxA}`, y: `+=${byA}`, skewX: rOff(1,3), clipPath: rClip() }, 0.02)
      .to([cloneR, cloneB], { opacity: 0, duration: 0.07 }, 0.07)

    // Phase 3 — real name jitter
      .to(nameEl, { x: rOff(4, 7), skewX: rOff(0.8, 1.5), duration: 0.04 }, 0.08)
      .to(nameEl, { x: rOff(4, 7), skewX: rOff(0.8, 1.5), duration: 0.04 }, 0.12)

    // Phase 4 — Burst B: re-stamp then offset to new random positions
    tl.call(() => { stampClone(cloneR); stampClone(cloneB); }, [], 0.13)
      .set(cloneR, { opacity: 0.9, x: `+=${rxB}`, y: `+=${ryB}`, skewX: rOff(1,2.5), clipPath: rClip() }, 0.13)
      .set(cloneB, { opacity: 0.9, x: `+=${bxB}`, y: `+=${byB}`, skewX: rOff(1,2.5), clipPath: rClip() }, 0.13)
      .to([cloneR, cloneB], { opacity: 0, duration: 0.06 }, 0.18)

    // Phase 5 — SVG warp ramps down + name snaps back
    if (turbEl && dispEl) {
      tl.to(turbEl, { attr: { baseFrequency: 0 }, duration: 0.1 }, 0.16)
        .to(dispEl, { attr: { scale: 0 },          duration: 0.1 }, 0.16);
    }
    tl.to(nameEl, { x: 0, skewX: 0, duration: 0.14, ease: "power3.out" }, 0.18);
  }

  // Idle loop — every 4–8 s
  (function scheduleIdle() {
    setTimeout(() => { runGlitch(); scheduleIdle(); }, 4000 + Math.random() * 4000);
  })();

  // Hover trigger with cooldown
  let hoverCD = false;
  nameEl.addEventListener("mouseenter", () => {
    if (hoverCD) return;
    hoverCD = true;
    runGlitch();
    setTimeout(() => { hoverCD = false; }, 1400);
  });
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
