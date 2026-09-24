const reduceQuery = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
const EASE = 'cubic-bezier(.22,1,.36,1)';
let enabled = false;

export const prefersReducedMotion = () => !!reduceQuery?.matches;
export const motionReady = () => enabled;

export async function initMotion() {
  enabled = !prefersReducedMotion();
  if (enabled) document.documentElement.classList.add('has-motion');
  return null;
}

function finishCleanup(el) {
  el.style.removeProperty('opacity');
  el.style.removeProperty('transform');
}

function waapi(el, frames, options = {}) {
  if (!enabled || !el || typeof el.animate !== 'function') return null;
  try {
    const anim = el.animate(frames, { duration: 650, easing: EASE, fill: 'both', ...options });
    anim.finished.then(() => { finishCleanup(el); anim.cancel(); }).catch(() => finishCleanup(el));
    return anim;
  } catch {
    finishCleanup(el);
    return null;
  }
}

export function reveal(root = document) {
  if (!enabled || typeof IntersectionObserver === 'undefined') return;
  const observer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      obs.unobserve(el);
      if (el.dataset.revealGroup !== undefined) {
        [...el.children].forEach((child, i) => {
          setTimeout(() => waapi(child, [
            { opacity: 0, transform: 'translateY(16px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], { duration: 560 }), i * 45);
        });
      } else {
        waapi(el, [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 700 });
      }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  root.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => {
    el.dataset.revealed = '1';
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
  });
  root.querySelectorAll('[data-reveal-group]').forEach((group) => {
    if (group.dataset.revealed) return;
    group.dataset.revealed = '1';
    [...group.children].forEach((child) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(16px)';
    });
    observer.observe(group);
  });
}

export function heroIntro(slide) {
  if (!enabled || !slide) return;
  const q = (s) => slide.querySelector(s);
  const items = [
    [q('.hero-eyebrow'), 50, 500, [{ opacity: 0 }, { opacity: 1 }]],
    [q('.hero-title'), 120, 800, [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }]],
    [q('.hero-text'), 260, 700, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }]],
    [q('.hero-actions'), 360, 700, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }]],
    [q('.hero-media'), 100, 950, [{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'scale(1)' }]],
  ];
  items.forEach(([el, delay, duration, frames]) => {
    if (el) setTimeout(() => waapi(el, frames, { duration }), delay);
  });
}

export function parallax(img, target, distance = 28) {
  if (!enabled || !img || !target) return;
  let raf = 0;
  const update = () => {
    raf = 0;
    const r = target.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const progress = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
    const y = -distance + progress * distance * 2;
    img.style.transform = `translateY(${y}px) scale(1.06)`;
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

export function bump(el) {
  if (!enabled || !el) return;
  waapi(el, [
    { transform: 'scale(1)' },
    { transform: 'scale(1.28)' },
    { transform: 'scale(1)' }
  ], { duration: 400 });
}
