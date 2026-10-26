/* ═══════════════════════════════════════════
   Noah Visser — Portfolio  |  main.js
   ═══════════════════════════════════════════ */

/* ── AUTOMATISCHE LEEFTIJD ──
   Geboortedatum: 8 oktober 2007
   Berekent altijd de actuele leeftijd, geen handmatige updates nodig. */
function berekenLeeftijd() {
  const geboorteDatum = new Date(2007, 9, 8); // maanden zijn 0-indexed, 9 = oktober
  const vandaag = new Date();
  let leeftijd = vandaag.getFullYear() - geboorteDatum.getFullYear();
  const maandVerschil = vandaag.getMonth() - geboorteDatum.getMonth();
  if (maandVerschil < 0 || (maandVerschil === 0 && vandaag.getDate() < geboorteDatum.getDate())) {
    leeftijd--;
  }
  return leeftijd;
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── LEEFTIJD INVULLEN ── */
  const leeftijd = berekenLeeftijd();
  const leeftijdEls = ['heroAge', 'termAge', 'visualAge', 'aboutAge'];
  leeftijdEls.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = id === 'termAge' ? leeftijd + ' jaar' : leeftijd;
  });

  // Stat teller: leeftijd heeft geen data-val, zet hem direct
  const statAge = document.getElementById('statAge');
  if (statAge) statAge.textContent = leeftijd;

  // Footer jaar
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // Loader jaar
  const loaderYear = document.getElementById('loaderYear');
  if (loaderYear) loaderYear.textContent = new Date().getFullYear();


  /* ── LOADER ── */
  const loader     = document.getElementById('loader');
  const loaderLine = document.getElementById('loaderLine');
  const loaderStat = document.getElementById('loaderStatus');

  const steps = [
    { w: '25%',  t: 'Initialiseren' },
    { w: '55%',  t: 'Stijlen laden' },
    { w: '80%',  t: 'Scripts starten' },
    { w: '100%', t: 'Klaar' },
  ];

  let si = 0;
  function tick() {
    if (si >= steps.length) { setTimeout(() => loader.classList.add('out'), 400); return; }
    loaderLine.style.width = steps[si].w;
    loaderStat.textContent = steps[si].t;
    si++;
    setTimeout(tick, 350);
  }
  setTimeout(tick, 250);


  /* ── CUSTOM CURSOR ── */
  const dot   = document.getElementById('cursorDot');
  const trail = document.getElementById('cursorTrail');

  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  function animTrail() {
    tx += (mx - tx) * .1;
    ty += (my - ty) * .1;
    trail.style.left = tx + 'px'; trail.style.top = ty + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  document.querySelectorAll('a, button, input, textarea, select, .proj-row, .sk-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '18px'; dot.style.height = '18px';
      trail.style.width = '56px'; trail.style.height = '56px';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '8px'; dot.style.height = '8px';
      trail.style.width = '36px'; trail.style.height = '36px';
    });
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; trail.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; trail.style.opacity = '1'; });


  /* ── NAVBAR SCROLL ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 40);
  }, { passive: true });

  // Active nav link
  const secEls   = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  secEls.forEach(s => secObs.observe(s));


  /* ── HAMBURGER ── */
  const burger  = document.getElementById('burger');
  const mobMenu = document.getElementById('mobMenu');

  burger.addEventListener('click', () => {
    const open = mobMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
  });

  document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => {
    mobMenu.classList.remove('open'); burger.classList.remove('open');
  }));

  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !mobMenu.contains(e.target)) {
      mobMenu.classList.remove('open'); burger.classList.remove('open');
    }
  });


  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 20;
      scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
    });
  });


  /* ── SCROLL REVEAL ── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));


  /* ── SKILL BAR ANIMATIE ── */
  document.querySelectorAll('.skc-fill').forEach(b => b.style.width = '0');

  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.skc-fill').forEach(b => {
          setTimeout(() => { b.style.width = b.dataset.w + '%'; }, 150);
        });
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  const skillSec = document.getElementById('skills');
  if (skillSec) skillObs.observe(skillSec);


  /* ── HERO COUNTER ANIMATIE ── */
  const statEls   = document.querySelectorAll('.h-stat-n[data-val]');
  const heroStats = document.querySelector('.hero-stats-row');
  let statsAnimated = false;

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statEls.forEach(el => {
          const target = parseInt(el.dataset.val);
          const dur = 1200;
          const start = performance.now();
          function step(now) {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(ease * target);
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
        statsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  if (heroStats) statsObs.observe(heroStats);


  /* ── PROJECT ROW GLOW ── */
  document.querySelectorAll('.proj-row').forEach(row => {
    row.addEventListener('mousemove', e => {
      const rect = row.getBoundingClientRect();
      const color = row.dataset.color || 'rgba(167,139,250,.06)';
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      row.querySelector('.proj-hover-bg').style.background =
        `radial-gradient(circle at ${x}% ${y}%, ${color}22 0%, transparent 60%)`;
    });
  });


  /* ── HERO CARD TILT ── */
  const frontCard = document.querySelector('.h-card--front');
  if (frontCard && window.innerWidth > 900) {
    frontCard.addEventListener('mousemove', e => {
      const r = frontCard.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      frontCard.style.transform = `perspective(900px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateZ(8px)`;
    });
    frontCard.addEventListener('mouseleave', () => {
      frontCard.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    });
  }


  /* ── BACK TO TOP ── */
  const btt = document.getElementById('btt');
  window.addEventListener('scroll', () => btt.classList.toggle('vis', scrollY > 400), { passive: true });
  btt.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));


  /* ── CONTACT FORM ── */
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', () => {
      submitBtn.disabled = true;
      submitBtn.querySelector('.cf-submit-text').textContent = 'Verzenden...';
      submitBtn.querySelector('.cf-submit-icon').textContent = '⏳';
      setTimeout(() => {
        formSuccess.classList.add('show');
        submitBtn.querySelector('.cf-submit-text').textContent = 'Verstuurd!';
        submitBtn.querySelector('.cf-submit-icon').textContent = '✓';
      }, 2000);
    });
  }

});
