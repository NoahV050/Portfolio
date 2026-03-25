/* ═══════════════════════════════════════════
   Noah Visser — Portfolio
   main.js
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════
     1. PAGE LOADER
  ══════════════════════════════ */
  const loader     = document.getElementById('loader');
  const loaderFill = document.getElementById('loaderFill');
  const loaderText = document.getElementById('loaderText');

  const loadSteps = [
    { width: '30%',  text: 'HTML laden...' },
    { width: '60%',  text: 'Stijlen toepassen...' },
    { width: '85%',  text: 'Scripts starten...' },
    { width: '100%', text: 'Klaar!' },
  ];

  let step = 0;

  function nextStep() {
    if (step >= loadSteps.length) {
      setTimeout(() => loader.classList.add('hidden'), 300);
      return;
    }
    loaderFill.style.width = loadSteps[step].width;
    loaderText.textContent  = loadSteps[step].text;
    step++;
    setTimeout(nextStep, 300);
  }

  setTimeout(nextStep, 200);


  /* ══════════════════════════════
     2. CUSTOM CURSOR
  ══════════════════════════════ */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width      = '20px';
      cursor.style.height     = '20px';
      cursorRing.style.width  = '60px';
      cursorRing.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width      = '12px';
      cursor.style.height     = '12px';
      cursorRing.style.width  = '40px';
      cursorRing.style.height = '40px';
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity     = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity     = '1';
    cursorRing.style.opacity = '1';
  });


  /* ══════════════════════════════
     3. NAVBAR — SCROLL + ACTIVE
  ══════════════════════════════ */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Highlight active section in nav
  const sections   = document.querySelectorAll('section[id], div[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));


  /* ══════════════════════════════
     4. SCROLL REVEAL
  ══════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ══════════════════════════════
     5. SKILL BAR ANIMATION
  ══════════════════════════════ */
  document.querySelectorAll('.skill-fill').forEach(bar => { bar.style.width = '0'; });

  const skillSection = document.querySelector('#skills');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.skill-fill').forEach(bar => {
          setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (skillSection) skillObserver.observe(skillSection);


  /* ══════════════════════════════
     6. MOBILE HAMBURGER MENU
  ══════════════════════════════ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Menu sluiten' : 'Menu openen');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-label', 'Menu openen');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });


  /* ══════════════════════════════
     7. SMOOTH SCROLL
  ══════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ══════════════════════════════
     8. STATS COUNTER ANIMATION
  ══════════════════════════════ */
  const statsBar = document.querySelector('.stats-bar');

  function animateCounter(el, numStr, suffix) {
    const num = parseInt(numStr);
    if (isNaN(num)) { el.textContent = numStr + suffix; return; }
    const dur   = 1200;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(e * num) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-num').forEach(el => {
          const raw = el.textContent.trim();
          const num = raw.replace(/[^0-9]/g, '');
          const suf = raw.replace(/[0-9]/g, '');
          animateCounter(el, num, suf);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (statsBar) statsObserver.observe(statsBar);


  /* ══════════════════════════════
     9. PROJECT CARD TILT
  ══════════════════════════════ */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      card.style.transform  = `perspective(800px) rotateY(${dx * 3}deg) rotateX(${-dy * 3}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
      card.style.transition = 'transform 0.5s ease';
    });
  });


  /* ══════════════════════════════
     10. BACK TO TOP BUTTON
  ══════════════════════════════ */
  const backBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ══════════════════════════════
     11. CONTACT FORM FEEDBACK
  ══════════════════════════════ */
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      // Show loading state on button
      submitBtn.disabled = true;
      submitBtn.querySelector('.submit-text').textContent = 'Wordt verzonden...';
      submitBtn.querySelector('.submit-icon').textContent = '⏳';

      // FormSubmit.co handles real submission via the action attribute.
      // After ~2s we optimistically show the success message in case
      // the user gets redirected back or the form completes.
      setTimeout(() => {
        successMsg.classList.add('show');
        submitBtn.querySelector('.submit-text').textContent = 'Verstuurd!';
        submitBtn.querySelector('.submit-icon').textContent = '✓';
      }, 2000);
    });
  }


  /* ══════════════════════════════
     12. TYPING EFFECT — terminal
  ══════════════════════════════ */
  const terminalLines = document.querySelectorAll('.terminal-line');

  terminalLines.forEach((line, i) => {
    const original = line.innerHTML;
    line.innerHTML  = '';
    line.style.opacity = '0';

    setTimeout(() => {
      line.style.opacity = '1';
      line.innerHTML = original;
    }, 1400 + i * 200); // starts after loader
  });

});
