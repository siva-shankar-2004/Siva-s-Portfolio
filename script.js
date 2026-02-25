/* ============================================
   SIVA SHANKAR PORTFOLIO — GSAP + LENIS JS
   ============================================ */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============ LENIS SMOOTH SCROLL ============
let lenis = null;
try {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
} catch (e) {
  console.warn('Lenis not available, using native scroll.');
  lenis = null;
}

// ============ PARTICLE CANVAS ============
const cv = document.getElementById('bgc');
const ctx = cv.getContext('2d');
let W, H;
const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
resize();
window.addEventListener('resize', resize);

class Star {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;
    this.r = Math.random() * 1.2 + 0.2;
    this.a = Math.random() * 0.6 + 0.1;
  }
  tick() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 200, 255, ${this.a})`;
    ctx.fill();
  }
}

const stars = Array.from({ length: 140 }, () => new Star());
let hmx = innerWidth / 2, hmy = innerHeight / 2;
document.addEventListener('mousemove', e => { hmx = e.clientX; hmy = e.clientY; });

function drawLinks() {
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 90) {
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(0, 200, 255, ${0.07 * (1 - d / 90)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    const dx = stars[i].x - hmx;
    const dy = stars[i].y - hmy;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 150) {
      ctx.beginPath();
      ctx.moveTo(stars[i].x, stars[i].y);
      ctx.lineTo(hmx, hmy);
      ctx.strokeStyle = `rgba(0, 200, 255, ${0.14 * (1 - d / 150)})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}

(function frame() {
  ctx.clearRect(0, 0, W, H);
  stars.forEach(s => { s.tick(); s.draw(); });
  drawLinks();
  requestAnimationFrame(frame);
})();

// ============ INITALIZE HERO ON LOAD ============
window.addEventListener('load', () => {
  animateHeroEntry();
});

// ============ HERO ENTRY ANIMATION ============
function animateHeroEntry() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.to('.hero-name-line span', {
    y: 0,
    duration: 1.2,
    stagger: 0.15,
    delay: 0.1,
  })
    .to('.hero-subtitle span, .hero-description span', {
      y: 0,
      duration: 0.9,
      stagger: 0.08,
    }, '-=0.8')
    .from('.hero-img-wrapper', {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    }, '-=0.9')
    .from('.hero-scroll', {
      opacity: 0,
      y: 20,
      duration: 0.6,
    }, '-=0.4');
}

// ============ CUSTOM CURSOR ============
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(cursor, { x: mx, y: my, duration: 0.1 });
  });

  gsap.ticker.add(() => {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
  });

  const growTargets = document.querySelectorAll(
    'a, button, [data-magnetic], input, textarea'
  );
  growTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('grow');
      follower.classList.add('grow');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('grow');
      follower.classList.remove('grow');
    });
  });

  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power3.out',
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
} else {
  cursor.style.display = 'none';
  follower.style.display = 'none';
}

// ============ MOBILE NAV ============
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  mobileNav.classList.toggle('open');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    mobileNav.classList.remove('open');
  });
});

// ============ SMOOTH SCROLL LINKS ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -60 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ============ SCROLL-TRIGGERED REVEALS ============
document.querySelectorAll('.reveal-text').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    onEnter: () => el.classList.add('revealed'),
    once: true,
  });
});

document.querySelectorAll('.reveal-lines').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    onEnter: () => el.classList.add('revealed'),
    once: true,
  });
});

document.querySelectorAll('.reveal-up').forEach((el, i) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    onEnter: () => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: (i % 3) * 0.1,
        ease: 'power3.out',
      });
      el.classList.add('revealed');
    },
    once: true,
  });
});

document.querySelectorAll('.reveal-left').forEach((el, i) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    onEnter: () => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: (i % 2) * 0.1,
        ease: 'power3.out',
      });
      el.classList.add('revealed');
    },
    once: true,
  });
});

document.querySelectorAll('.reveal-right').forEach((el, i) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    onEnter: () => {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: (i % 2) * 0.1,
        ease: 'power3.out',
      });
      el.classList.add('revealed');
    },
    once: true,
  });
});

// ============ SKILL BAR FILL ============
document.querySelectorAll('.skill-bar-fill').forEach(fill => {
  ScrollTrigger.create({
    trigger: fill,
    start: 'top 90%',
    onEnter: () => {
      const w = fill.getAttribute('data-width');
      gsap.to(fill, { width: w + '%', duration: 1.2, ease: 'power3.out' });
    },
    once: true,
  });
});

// ============ COUNTER ANIMATION ============
document.querySelectorAll('[data-count]').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 90%',
    onEnter: () => {
      const target = +el.getAttribute('data-count');
      gsap.to(el, {
        innerText: target,
        duration: 1.5,
        snap: { innerText: 1 },
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(parseFloat(el.textContent));
        },
      });
    },
    once: true,
  });
});

// ============ PARALLAX HERO IMAGE ============
gsap.to('.hero-img-wrapper', {
  y: 80,
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
});

// ============ MARQUEE SPEED ON SCROLL ============
gsap.to('.marquee-track', {
  x: '-=150',
  scrollTrigger: {
    trigger: '.marquee-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.5,
  },
});

// ============ HEADER HIDE ON SCROLL ============
let lastScroll = 0;
const header = document.getElementById('header');

function handleHeaderScroll(scroll) {
  if (scroll > lastScroll && scroll > 100) {
    header.style.transform = 'translateY(-100%)';
    header.style.transition = 'transform 0.4s ease';
  } else {
    header.style.transform = 'translateY(0)';
  }
  lastScroll = scroll;
}

if (lenis) {
  lenis.on('scroll', ({ scroll }) => handleHeaderScroll(scroll));
} else {
  window.addEventListener('scroll', () => handleHeaderScroll(window.scrollY));
}

// ============ EMAILJS — CONTACT FORM ============
/*
  ===================================================
  HOW TO SET UP EMAILJS:
  ===================================================
  1. Sign up at https://www.emailjs.com/
  2. Add Email Service → connect Gmail (shivashankarshiva2020@gmail.com)
  3. Create Template 1 (receive): Subject "New message from {{user_name}}"
  4. Create Template 2 (auto-reply): To {{user_email}}
  5. Get Public Key from Account settings
  6. Replace the 4 constants below
  ===================================================
*/
const EMAILJS_PUBLIC_KEY = 'WTtrHUvrqbponnlsG';
const EMAILJS_SERVICE_ID = 'service_vde0n0x';
const EMAILJS_TEMPLATE_ID = 'template_2mnpf8k';
const EMAILJS_AUTOREPLY_ID = 'template_o13z6p3';

(function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
})();

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    user_name: document.getElementById('userName').value,
    user_email: document.getElementById('userEmail').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
  };

  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    if (typeof emailjs !== 'undefined') {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData);
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_ID, formData);
      showToast('Message sent! Check your email for confirmation.', false);
    } else {
      showToast('Form works! Set up EmailJS to send real emails.', false);
    }
    contactForm.reset();
  } catch (err) {
    console.error('EmailJS Error:', err);
    showToast('Something went wrong. Please try again.', true);
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
});

// ============ TOAST ============
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  toastMsg.textContent = msg;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
// ============ HERO GLITCH EFFECT ============
const glitchEls = document.querySelectorAll('.hero-name .t1, .hero-name .t2');
setInterval(() => {
  glitchEls.forEach(el => {
    el.style.textShadow = `${(Math.random() - 0.5) * 4}px 0 rgba(255, 45, 110, 0.6), ${(Math.random() - 0.5) * 4}px 0 rgba(0, 200, 255, 0.6)`;
    setTimeout(() => {
      el.style.textShadow = '';
    }, 80);
  });
}, 4000);
