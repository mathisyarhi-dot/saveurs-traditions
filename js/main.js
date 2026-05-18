/**
 * Saveurs & Traditions — main.js
 * ES6+ · Sans eval · Sans injections XSS
 */

'use strict';

/* ================================================================
   Zones photo uploadables
   ================================================================ */
function initUploadZones() {
  document.querySelectorAll('.uzone').forEach(zone => {
    const input   = zone.querySelector('input[type="file"]');
    const preview = zone.querySelector('.img-prev');
    if (!input || !preview) return;

    input.addEventListener('change', function handleUpload() {
      const file = this.files?.[0];
      if (!file) return;

      // Révoquer l'ancienne URL blob si elle existe
      const prev = preview.dataset.blobUrl;
      if (prev) URL.revokeObjectURL(prev);

      const url = URL.createObjectURL(file);
      preview.dataset.blobUrl = url;
      preview.style.backgroundImage = `url("${url}")`;
      zone.classList.add('loaded');
    });
  });
}

/* ================================================================
   Badge Ouvert / Fermé (temps réel)
   ================================================================ */
function initOpenBadge() {
  const badge = document.getElementById('open-badge');
  if (!badge) return;

  function update() {
    const now  = new Date();
    const day  = now.getDay();                             // 0=dim · 1=lun
    const hour = now.getHours() + now.getMinutes() / 60;
    const open = day !== 1 && hour >= 6.5 && hour < 20;   // fermé le lundi

    badge.textContent = open ? '● Ouvert' : '● Fermé';
    badge.style.color = open ? '#4CAF50' : '#E57373';
    badge.setAttribute('aria-label', open ? 'Actuellement ouvert' : 'Actuellement fermé');
  }

  update();
  setInterval(update, 60_000);
}

/* ================================================================
   Menu burger (mobile)
   ================================================================ */
function initBurgerMenu() {
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  if (!burger || !navLinks) return;

  const ICON_OPEN  = '<i class="ti ti-menu-2" aria-hidden="true"></i>';
  const ICON_CLOSE = '<i class="ti ti-x" aria-hidden="true"></i>';

  function openMenu() {
    navLinks.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    burger.innerHTML = ICON_CLOSE;
    navLinks.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = ICON_OPEN;
    navLinks.setAttribute('aria-hidden', 'true');
  }

  burger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Fermer au clic sur un lien
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fermer au clic en dehors du menu
  document.addEventListener('click', e => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      closeMenu();
    }
  });

  // Fermer à la touche Échap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      burger.focus();
    }
  });
}

/* ================================================================
   Nav — ombre au défilement
   ================================================================ */
function initNavScroll() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const handler = () => {
    nav.classList.toggle('site-nav--scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', handler, { passive: true });
  handler(); // état initial
}

/* ================================================================
   Initialisation
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initUploadZones();
  initOpenBadge();
  initBurgerMenu();
  initNavScroll();
});
