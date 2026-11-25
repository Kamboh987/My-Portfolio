/**
 * Creative GSAP Animations - 100% Stable, High-Performance & Eye-Catching
 * Features:
 * - Infinite Kinetic Marquee Ticker
 * - Top Scroll Progress Bar
 * - Organic 3D Floating Holograms (GSAP Sine Physics)
 * - Cinematic Intro Timeline with clearProps
 * - Three.js Light Pulse on Card Interaction
 * - Smooth Warp Speed Burst on Click
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initInfiniteMarquee();
  initOrganic3DFloating();
  initHeroCinematicTimeline();
  initCardGsapReactivity();
  initThreeJsGsapHooks();
});

// 1. Top Scroll Progress Bar
function initScrollProgressBar() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar || typeof gsap === 'undefined') return;

  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    gsap.to(bar, {
      scaleX: Math.min(Math.max(progress, 0), 1),
      duration: 0.1,
      ease: 'none'
    });
  }, { passive: true });
}

// 2. Infinite Kinetic Marquee Ticker
function initInfiniteMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track || typeof gsap === 'undefined') return;

  // Infinite seamless loop
  const tween = gsap.to(track, {
    xPercent: -50,
    ease: 'none',
    duration: 25,
    repeat: -1
  });

  // Slow down on hover
  const strip = document.querySelector('.marquee-strip');
  if (strip) {
    strip.addEventListener('mouseenter', () => {
      gsap.to(tween, { timeScale: 0.35, duration: 0.5 });
    });
    strip.addEventListener('mouseleave', () => {
      gsap.to(tween, { timeScale: 1, duration: 0.5 });
    });
  }
}

// 3. Organic 3D Floating Holograms (GSAP Sine Physics)
function initOrganic3DFloating() {
  if (typeof gsap === 'undefined') return;

  const b1 = document.querySelector('.holo-badge-1');
  const b2 = document.querySelector('.holo-badge-2');
  const b3 = document.querySelector('.holo-badge-3');

  if (b1) {
    gsap.to(b1, {
      y: -18,
      rotation: 3,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  if (b2) {
    gsap.to(b2, {
      y: 15,
      rotation: -4,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.5
    });
  }

  if (b3) {
    gsap.to(b3, {
      y: -14,
      rotation: 2,
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.0
    });
  }
}

// 4. Cinematic Hero Load Timeline (Leaves no stuck styles)
function initHeroCinematicTimeline() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      // Clear inline styles once finished so elements are 100% natural and never glitch
      gsap.set(['.hero-badge', '.hero-title', '.hero-description', '.hero-cta-group .btn', '.hero-stats-banner'], {
        clearProps: 'opacity,transform'
      });
    }
  });

  // Navbar drops in
  tl.from('.navbar-wrapper', {
    y: -70,
    opacity: 0,
    duration: 0.8,
    ease: 'power4.out'
  });

  // Hero Badge pops in
  tl.from('.hero-badge', {
    scale: 0.75,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(2)'
  }, '-=0.3');

  // Hero Title reveal
  const title = document.querySelector('.hero-title');
  if (title) {
    tl.from(title, {
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out'
    }, '-=0.4');
  }

  // Hero Description
  tl.from('.hero-description', {
    y: 20,
    opacity: 0,
    duration: 0.6
  }, '-=0.5');

  // CTA Buttons with staggered pop
  tl.from('.hero-cta-group .btn', {
    y: 15,
    opacity: 0,
    scale: 0.92,
    stagger: 0.08,
    duration: 0.5,
    ease: 'back.out(1.8)'
  }, '-=0.4');

  // Stats Banner
  tl.from('.hero-stats-banner', {
    scale: 0.9,
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.3');
}

// 5. Card Reactivity with Three.js
function initCardGsapReactivity() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Send custom event to pulse neon lighting in Three.js
      window.dispatchEvent(new CustomEvent('card-hover-pulse'));
    });
  });
}

// 6. Connect GSAP to Three.js Warp Trigger
function initThreeJsGsapHooks() {
  const exploreBtn = document.querySelector('a[href="#projects"]');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('threejs-warp-burst'));

      // Smooth custom scroll to projects section
      const target = document.getElementById('projects');
      if (target) {
        const topPos = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: topPos,
          behavior: 'smooth'
        });
      }
    });
  }
}
