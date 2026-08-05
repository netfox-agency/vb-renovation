/* Debord Rénovation — interactions. Statique, sans dépendance. */
(function () {
  'use strict';

  /* ============================================================
     SUIVI DES CONVERSIONS (Google Ads / GA4 / Meta via GTM)
     Les deux conversions d'un couvreur : le devis (formulaire) et
     l'appel (clic sur un numéro). On les pousse dans dataLayer, que
     GTM lit. dataLayer est un simple tableau : inoffensif sans GTM.

     >>> POUR ACTIVER : remplacer GTM-XXXXXXX par le vrai ID de conteneur
         Google Tag Manager. Tant que le placeholder est là, GTM ne se
         charge pas (aucune requête inutile), mais les événements sont
         quand même collectés dans dataLayer.
     ============================================================ */
  window.dataLayer = window.dataLayer || [];
  var GTM_ID = 'GTM-XXXXXXX';
  if (GTM_ID.indexOf('XXXX') === -1) {
    window.dataLayer.push({ 'gtm.start': +new Date(), event: 'gtm.js' });
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(g);
  }
  // Conversion « appel » : tout clic sur un lien tel:
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (a) window.dataLayer.push({ event: 'phone_call', source: a.className || 'lien' });
  }, true);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Vidéo de la carte « Rénovation de toiture » ----------
     La vidéo est un bonus, jamais une dépendance : le <video> arrive sans
     source et en preload="none" — zéro octet par défaut, l'image de la carte
     fait tout le travail. La source n'est attachée que lorsque la carte entre
     à l'écran, en desktop, hors reduced-motion. Elle se met en pause quand la
     carte sort du viewport (le décodeur ne tourne pas pour rien). */
  var cardVid = document.getElementById('card-vid');
  var mqDesk = window.matchMedia('(min-width: 861px)');
  if (cardVid && !reduced && 'IntersectionObserver' in window) {
    var vidObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && mqDesk.matches) {
          if (!cardVid.querySelector('source')) {
            var s = document.createElement('source');
            s.src = cardVid.dataset.src;
            s.type = 'video/mp4';
            cardVid.appendChild(s);
            cardVid.load();
          }
          var p = cardVid.play();
          if (p && p.catch) p.catch(function () { /* autoplay refusé : l'image reste */ });
        } else {
          cardVid.pause();
        }
      });
    }, { threshold: 0.35 });
    vidObs.observe(cardVid);
    // La vidéo ne se révèle qu'une fois réellement en lecture : aucun flash
    // noir entre l'image et la première frame.
    cardVid.addEventListener('playing', function () { cardVid.classList.add('playing'); });
  }

  /* ---------- Vidéos de démonstration hydrofuge ----------
     Muettes, en boucle : elles se lancent quand elles entrent à l'écran et
     se coupent en sortant. preload="none" : zéro octet tant qu'on ne les voit
     pas. Un clic met en pause / relance (pas de contrôles natifs, plus propre). */
  var demoVids = document.querySelectorAll('.demo video');
  if (demoVids.length && 'IntersectionObserver' in window) {
    var demoObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting && !reduced) {
          var p = v.play();
          if (p && p.catch) p.catch(function () { /* autoplay refusé : le poster reste */ });
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.4 });
    demoVids.forEach(function (v) {
      demoObs.observe(v);
      v.addEventListener('click', function () {
        if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    });
  }

  /* ---------- Navbar + callbar ---------- */
  var nav = document.getElementById('nav');
  var callbar = document.getElementById('callbar');
  var devis = document.getElementById('devis');

  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);

    // Callbar : dès que le hero est quitté (0.35 au lieu de 0.6, pour ne pas
    // laisser de zone sans CTA en milieu de page), mais masquée quand le
    // formulaire est à l'écran (inutile de proposer d'appeler quand on écrit).
    if (callbar && devis) {
      var hero = document.querySelector('.hero');
      var heroBottom = hero ? hero.getBoundingClientRect().bottom : window.innerHeight * 0.35;
      var past = heroBottom < window.innerHeight * 0.5;
      var box = devis.getBoundingClientRect();
      var formVisible = box.top < window.innerHeight && box.bottom > 0;
      callbar.classList.toggle('show', past && !formVisible);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu');
      menu.classList.toggle('open', !open);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        burger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
        burger.focus();
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach(function (el) {
      if (el.closest('.hero')) { el.classList.add('in'); return; } // le hero s'anime tout de suite
      io.observe(el);
    });
  }

  /* ---------- FAQ : une seule ouverte à la fois ---------- */
  var faqs = document.querySelectorAll('.faq-list details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Formulaire devis ---------- */
  var form = document.getElementById('devis-form');
  var btn = document.getElementById('submit-btn');
  var ok = document.getElementById('form-ok');
  var ko = document.getElementById('form-ko');

  function setInvalid(input, invalid) {
    var field = input.closest('.field');
    if (field) field.classList.toggle('invalid', invalid);
  }

  function validate() {
    var valid = true;
    var nom = document.getElementById('f-nom');
    var tel = document.getElementById('f-tel');
    var mail = document.getElementById('f-mail');

    var nomBad = !nom.value.trim();
    setInvalid(nom, nomBad);
    if (nomBad) valid = false;

    // Un numéro français exploitable : au moins 10 chiffres
    var telBad = tel.value.replace(/\D/g, '').length < 10;
    setInvalid(tel, telBad);
    if (telBad) valid = false;

    // L'e-mail est facultatif, mais s'il est rempli il doit être plausible
    var mailBad = mail.value.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim());
    setInvalid(mail, mailBad);
    if (mailBad) valid = false;

    if (!valid) {
      var first = form.querySelector('.field.invalid input');
      if (first) first.focus();
    }
    return valid;
  }

  if (form) {
    // On retire l'état d'erreur dès que l'utilisateur corrige
    form.addEventListener('input', function (e) {
      if (e.target.closest('.field.invalid')) setInvalid(e.target, false);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      var key = form.querySelector('[name="access_key"]').value;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Envoi…';

      // Clé Web3Forms non configurée : on n'envoie pas dans le vide,
      // on bascule directement sur le repli téléphone.
      if (!key || key.indexOf('REMPLACER') === 0) {
        form.style.display = 'none';
        ko.classList.add('show');
        return;
      }

      // FormData (pas JSON) : envoi "simple", sans preflight CORS. Web3Forms
      // refuse le preflight d'un fetch JSON ; le multipart passe toujours.
      // On ne fixe PAS Content-Type : le navigateur pose le bon boundary.
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          form.style.display = 'none';
          if (data.success) {
            ok.classList.add('show');
            // Conversion « devis » pour Google Ads / GA4 (via dataLayer).
            window.dataLayer.push({ event: 'generate_lead', form: 'devis', prestation: (form.querySelector('[name="prestation"]') || {}).value || '' });
          } else { ko.classList.add('show'); }
        })
        .catch(function () {
          // Réseau coupé, API HS : le numéro reste la porte de sortie.
          form.style.display = 'none';
          ko.classList.add('show');
        });
    });
  }
})();
