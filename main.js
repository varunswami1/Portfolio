/* ─────────────────────────────────────────
   VARUN SWAMI PORTFOLIO — main.js
   DSE3251 Web Technologies · MUJ 2027
───────────────────────────────────────── */

const EMAILJS_PUBLIC_KEY  = 'me69vZfOASKNtOK0l';   
const EMAILJS_SERVICE_ID  = 'service_ewxtz2e';   
const EMAILJS_TEMPLATE_ID = 'template_mwpmrkh'; 

/* ─────────────────────────────────────────
   1. NAVBAR — add "scrolled" class on scroll
───────────────────────────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────────────────────────────────────
   2. FADE-UP — Intersection Observer
───────────────────────────────────────── */
(function initFadeUp() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

  // Stagger items inside grid sections
  const staggerParents = [
    '.skills-layout',
    '.projects-grid',
    '.cert-grid',
    '.about-stats',
  ];

  staggerParents.forEach((selector) => {
    const parent = document.querySelector(selector);
    if (!parent) return;
    parent.querySelectorAll('.fade-up').forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });
})();

/* ─────────────────────────────────────────
   3. RESUME BUTTON — animate text on click
───────────────────────────────────────── */
(function initResumeBtn() {
  const btn = document.getElementById('resume-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const original = btn.textContent;
    btn.textContent = 'Downloading…';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.opacity = '';
    }, 2500);
  });
})();

/* ─────────────────────────────────────────
   4. CONTACT FORM — EmailJS integration
───────────────────────────────────────── */
(function initContactForm() {
  // Initialise EmailJS with your public key
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText   = document.getElementById('btn-text');
  const btnLoader = document.getElementById('btn-loader');
  const toast     = document.getElementById('form-toast');

  if (!form) return;

  // ── Helpers ──────────────────────────
  function showToast(message, type) {
    toast.textContent = message;
    toast.className = `form-toast ${type}`;   // 'success' | 'error'
    toast.classList.remove('hidden');
    // auto-hide after 6 seconds
    setTimeout(() => toast.classList.add('hidden'), 6000);
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    btnText.classList.toggle('hidden', isLoading);
    btnLoader.classList.toggle('hidden', !isLoading);
  }

  function validateField(field) {
    const value = field.value.trim();
    if (!value) {
      field.classList.add('error');
      return false;
    }
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        field.classList.add('error');
        return false;
      }
    }
    field.classList.remove('error');
    return true;
  }

  // Remove error highlight when user starts typing
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('error'));
  });

  // ── Submit handler ────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      showToast('Please fill in all fields correctly.', 'error');
      return;
    }

    // Check if EmailJS is configured
    if (
      EMAILJS_PUBLIC_KEY  === 'YOUR_PUBLIC_KEY'  ||
      EMAILJS_SERVICE_ID  === 'YOUR_SERVICE_ID'  ||
      EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID'
    ) {
      showToast(
        '⚠️ EmailJS is not configured yet. See main.js for setup instructions.',
        'error'
      );
      return;
    }

    setLoading(true);
    toast.classList.add('hidden');

    const templateParams = {
      from_name:  form.from_name.value.trim(),
      reply_to:   form.reply_to.value.trim(),
      subject:    form.subject.value.trim(),
      message:    form.message.value.trim(),
      to_name:    'Varun',
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      showToast('✅ Message sent! I\'ll get back to you soon.', 'success');
      form.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      showToast(
        '❌ Something went wrong. Please email me directly at varunswami222@gmail.com',
        'error'
      );
    } finally {
      setLoading(false);
    }
  });
})();
