/* VB Rénovation — interactions. Statique, sans dépendance. */
(function () {
  'use strict';

  /* ============================================================
     TRAÇABILITÉ DE L'ORIGINE DES DEMANDES
     L'artisan doit savoir d'où vient une demande quand il rappelle.
     On capte l'origine à la PREMIÈRE page vue et on la garde pour toute
     la session : un visiteur qui arrive par une annonce sur
     /peintre-paimpol puis remplit le formulaire sur l'accueil reste
     attribué à l'annonce. Les champs partent avec le mail de devis,
     en français lisible, sans outil externe ni identifiant à configurer.
     ============================================================ */
  var ORIGINE_CLE = 'vb_origine';

  function lireParams() {
    try { return new URLSearchParams(window.location.search); }
    catch (e) { return { get: function () { return null; } }; }
  }

  function moteurConnu(hote) {
    if (/google\./.test(hote)) return 'Google';
    if (/bing\./.test(hote)) return 'Bing';
    if (/duckduckgo\./.test(hote)) return 'DuckDuckGo';
    if (/qwant\./.test(hote)) return 'Qwant';
    if (/ecosia\./.test(hote)) return 'Ecosia';
    if (/yahoo\./.test(hote)) return 'Yahoo';
    return null;
  }

  // Traduit les paramètres techniques en une phrase que l'artisan comprend.
  function calculerOrigine() {
    var p = lireParams();
    var gclid = p.get('gclid') || p.get('wbraid') || p.get('gbraid');
    var msclkid = p.get('msclkid');
    var src = p.get('utm_source'), med = p.get('utm_medium');
    var camp = p.get('utm_campaign'), terme = p.get('utm_term');

    var libelle;
    if (gclid) {
      libelle = 'Google Ads (annonce payante)';
      if (camp) libelle += ' · campagne ' + camp;
      if (terme) libelle += ' · mot-clé « ' + terme + ' »';
    } else if (msclkid) {
      libelle = 'Bing Ads (annonce payante)';
      if (camp) libelle += ' · campagne ' + camp;
    } else if (src) {
      libelle = src + (med ? ' / ' + med : '');
      if (camp) libelle += ' · campagne ' + camp;
    } else {
      var ref = '';
      try { ref = document.referrer || ''; } catch (e) {}
      if (!ref) {
        libelle = 'Accès direct (adresse tapée, favori ou SMS)';
      } else {
        var hote = '';
        try { hote = new URL(ref).hostname; } catch (e) {}
        if (hote === window.location.hostname) libelle = 'Accès direct';
        else {
          var m = moteurConnu(hote);
          libelle = m ? 'Recherche ' + m + ' (résultat naturel)' : 'Site référent : ' + hote;
        }
      }
    }

    return {
      origine: libelle,
      page_arrivee: window.location.pathname,
      identifiant_clic: gclid || msclkid || '',
      arrivee_le: new Date().toLocaleString('fr-FR')
    };
  }

  // Première page de la session : on fige l'origine. Ensuite on la relit.
  function origineDeLaSession() {
    var o = null;
    try { o = JSON.parse(sessionStorage.getItem(ORIGINE_CLE) || 'null'); } catch (e) {}
    if (!o) {
      o = calculerOrigine();
      try { sessionStorage.setItem(ORIGINE_CLE, JSON.stringify(o)); } catch (e) {}
    }
    return o;
  }

  var origine = origineDeLaSession();

  /* ---------- Pré-remplissage du devis depuis les pages services ----------
     Les CTA des pages internes pointent vers /?devis=<cle>#devis : on
     présélectionne la prestation correspondante dans le formulaire. */
  var devisMap = {
    'ravalement': 'Ravalement de façade',
    'peinture-facade': 'Peinture de façade',
    'enduit': 'Enduit / reprises',
    'interieur': 'Peinture intérieure',
    'nettoyage': 'Nettoyage / hydrofuge',
    'fissures': 'Fissures / imperméabilisation',
    'volets': 'Volets & boiseries',
    'syndic': 'Copropriété / syndic'
  };
  try {
    var devisKey = new URLSearchParams(window.location.search).get('devis');
    var presta = document.getElementById('f-presta');
    if (devisKey && presta && devisMap[devisKey]) {
      for (var i = 0; i < presta.options.length; i++) {
        if (presta.options[i].text === devisMap[devisKey]) { presta.selectedIndex = i; break; }
      }
    }
  } catch (e) { /* URLSearchParams absent : tant pis, le select reste vide */ }

  /* ============================================================
     SUIVI DES CONVERSIONS (Google Ads / GA4 / Meta via GTM)
     Les deux conversions d'un couvreur : le devis (formulaire) et
     l'appel (clic sur un numéro). Elles partent directement à Google Ads
     par la balise native (pas de GTM nécessaire) et sont aussi poussées
     dans dataLayer : si un conteneur GTM ou GA4 est ajouté plus tard, il
     les lira sans rien changer ici.
     ============================================================ */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  // Balise Google Ads native : pas besoin de GTM ni de GA4 pour compter
  // les conversions. Les événements dataLayer restent poussés en parallèle,
  // compatibles avec un GTM branché plus tard.
  var AW_ID = 'AW-18394451888';
  /* GA4 et GTM : renseigner les identifiants pour les activer.
     Laisser vide = rien ne se charge (aucune requête inutile).
     RÈGLE : la conversion Google Ads reste sur la balise native ci-dessous.
     Ne JAMAIS recréer la conversion Ads dans GTM : elle compterait double. */
  var GA4_ID = '';        // ex. 'G-XXXXXXXXXX'
  var GTM_ID = 'GTM-TZ7ZH5DB';        // ex. 'GTM-XXXXXXX'
  var CONV_DEVIS = AW_ID + '/Y2htCJb04OQcELCflMNE';
  var CONV_APPEL = AW_ID + '/j-rCCP3G6-QcELCflMNE';

  /* Consent Mode v2, version avancée : tout est refusé par défaut. Tant que
     le visiteur n'a pas accepté, la balise n'envoie que des signaux sans
     cookie et Google modélise les conversions manquantes. */
  var CONSENT_CLE = 'vb_consentement';
  var consentChoix = null;
  try { consentChoix = localStorage.getItem(CONSENT_CLE); } catch (e) {}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  gtag('set', 'url_passthrough', true);
  gtag('js', new Date());
  gtag('config', AW_ID);
  if (GA4_ID) gtag('config', GA4_ID);   // mesure d'audience, même consentement
  (function () {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + AW_ID;
    document.head.appendChild(g);
  })();

  // Conteneur GTM (facultatif) : chargé après le consentement par défaut,
  // il lit le même dataLayer que la balise native.
  if (GTM_ID) {
    window.dataLayer.push({ 'gtm.start': +new Date(), event: 'gtm.js' });
    (function () {
      var g = document.createElement('script');
      g.async = true;
      g.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
      document.head.appendChild(g);
    })();
  }

  function accorderConsentement() {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
  }
  if (consentChoix === 'accepte') accorderConsentement();

  // Bandeau CNIL : deux choix d'égale visibilité, mémorisés sur l'appareil.
  if (!consentChoix) {
    var band = document.createElement('div');
    band.className = 'consent-bar';
    band.setAttribute('role', 'dialog');
    band.setAttribute('aria-label', 'Gestion des cookies');
    band.innerHTML =
      '<p>Nous mesurons l\'efficacité de nos annonces avec Google. Votre choix est libre et conservé sur votre appareil.</p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn btn-accent" data-consent="accepte">Tout accepter</button>' +
      '<button type="button" class="btn consent-refuse" data-consent="refuse">Continuer sans accepter</button>' +
      '</div>';
    document.body.appendChild(band);
    band.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      try { localStorage.setItem(CONSENT_CLE, b.getAttribute('data-consent')); } catch (err) {}
      if (b.getAttribute('data-consent') === 'accepte') accorderConsentement();
      band.remove();
    });
  }

  // Conversion « appel » : tout clic sur un lien tel:
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (a) {
      window.dataLayer.push({ event: 'phone_call', source: a.className || 'lien' });
      gtag('event', 'conversion', { send_to: CONV_APPEL });
    }
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

    // Callbar : dès que le hero est quitté, mais masquée quand le formulaire
    // est à l'écran (inutile de proposer d'appeler quand on écrit).
    // Les pages internes n'ont ni #devis ni .hero : leur bandeau est
    // .page-hero et il n'y a pas de formulaire à protéger — sans ce repli,
    // la callbar (le CTA mobile principal) n'y apparaîtrait jamais.
    if (callbar) {
      var hero = document.querySelector('.hero, .page-hero');
      var heroBottom = hero ? hero.getBoundingClientRect().bottom : window.innerHeight * 0.35;
      var past = heroBottom < window.innerHeight * 0.5;
      var formVisible = false;
      if (devis) {
        var box = devis.getBoundingClientRect();
        formVisible = box.top < window.innerHeight && box.bottom > 0;
      }
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

      // Origine de la demande, jointe au mail reçu par l'artisan.
      function remplir(nom, valeur) {
        var champ = form.querySelector('[name="' + nom + '"]');
        if (champ) champ.value = valeur || '';
      }
      remplir('Origine', origine.origine);
      remplir('Page d_arrivee', origine.page_arrivee);
      remplir('Page de la demande', window.location.pathname);
      remplir('Premiere visite', origine.arrivee_le);
      remplir('Identifiant clic', origine.identifiant_clic);

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
            gtag('event', 'conversion', { send_to: CONV_DEVIS });
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
