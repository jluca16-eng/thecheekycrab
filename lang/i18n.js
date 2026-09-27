/* ==========================================================
   SITE-WIDE LANGUAGE SWITCHING
   ----------------------------------------------------------
   Every page loads this one file (a <script> tag just before
   </head>). It:
     1. works out which language to show — a ?lang=xx in the
        link, otherwise the reader's last choice (remembered in
        their browser), otherwise English;
     2. adds the little "🌐 Language" picker to the page;
     3. swaps in the translations for that language.

   HOW A PAGE'S TEXT GETS TRANSLATED
   The English stays written in the page as normal. Any piece of
   text that should change gets a label, e.g.
       <h1 data-i18n="heading">Stories</h1>
   and at the bottom of the page a small script gives the other
   four languages for each label:
       CrabbyLang.add({
         el: { heading: "Ιστορίες" },
         it: { heading: "Storie" }, ...
       });
   Pictures' descriptions, hover text and placeholders use
   data-i18n-alt, data-i18n-title, data-i18n-aria-label and
   data-i18n-placeholder the same way.

   Words used on lots of pages (Back, the story titles, the menu
   names) live once, in SHARED below, so any page can use them
   just by adding the label.

   Pages that build their own content (the stories and the
   activity pages) instead call CrabbyLang.onChange(function (lang) {…})
   and redraw themselves in that language.

   TO ADD A NEW LANGUAGE: add it to LANGUAGES below, then add
   its words to SHARED and to each page's CrabbyLang.add(...).
   ========================================================== */
(function () {
  var LANGUAGES = [
    { code: 'en', name: 'English',  html: 'en-AU' },
    { code: 'el', name: 'Ελληνικά', html: 'el' },
    { code: 'it', name: 'Italiano', html: 'it' },
    { code: 'fr', name: 'Français', html: 'fr' },
    { code: 'es', name: 'Español',  html: 'es' }
  ];

  // Words shared across many pages.
  var SHARED = {
    el: {
      back: '← Πίσω',
      backToBeach: '← Πίσω στην παραλία',
      allActivities: '← Όλες οι δραστηριότητες',
      language: 'Γλώσσα',
      navStories: 'Ιστορίες',
      navMeet: 'Γνώρισε τον Κράμπι',
      navFacts: 'Γεγονότα για κάβουρες',
      navActivity: 'Γωνιά δραστηριοτήτων',
      navContact: 'Επικοινωνία',
      activityBtn: '🦀 Δραστηριότητα',
      activityBtnTitle: 'Δοκίμασε τη δραστηριότητα της ιστορίας',
      titleMango: 'Ο Κράμπι και το παγωτό μάνγκο',
      titleHiding: 'Ο Κράμπι και η τέλεια κρυψώνα',
      altMangoCone: 'Ο Κράμπι, ο κάβουρας από Lego, κρατά θριαμβευτικά ένα χωνάκι παγωτό μάνγκο',
      altWindowsill: 'Ο Κράμπι, ο κάβουρας από Lego, παρακολουθεί τη Σοφία να χτενίζει τα μαλλιά της',
      // activity pages
      wsHeading: "1. Το κρυπτόλεξο του Κράμπι",
      wsSub: "Κάνε κλικ σε ένα γράμμα και μετά στο τελευταίο γράμμα μιας λέξης για να διαλέξεις όλη τη γραμμή. Βρες και τις 10 λέξεις που κρύβονται στο πλέγμα.",
      wsDone: "Τις βρήκες όλες! Τι μάτι! 🦀",
      quizHeading: "2. Σωστό ή λάθος;",
      quizSub: "Διάβασε κάθε πρόταση για την ιστορία και διάλεξε Σωστό ή Λάθος.",
      quizTrue: "Σωστό",
      quizFalse: "Λάθος",
      quizTrueFb: "Σωστό!",
      quizFalseFb: "Λάθος!",
      quizScore: "Βαθμολογία: {c} / {n} μέχρι στιγμής ({a}/{n} απαντήσεις)",
      orderHeading: "3. Βάλε τα στη σειρά",
      orderCheck: "Έλεγξε τη σειρά μου",
      orderShuffle: "Ανακάτεψε ξανά",
      orderDone: "Αυτή είναι η σωστή σειρά — μπράβο! 🦀",
      moveUp: "Μετακίνηση πάνω",
      moveDown: "Μετακίνηση κάτω",
      colourHeading: "4. Ζωγράφισε τον Κράμπι",
      printPicture: "Εκτύπωσε τη ζωγραφιά",
      yourTurnHeading: "5. Σειρά σου!",
      yourTurnPlaceholder: "Μια μέρα, ο Κράμπι αποφάσισε να...",
      printStory: "Εκτύπωσε την ιστορία μου",
      clear: "Καθαρισμός"
    },
    it: {
      back: '← Indietro',
      backToBeach: '← Torna alla spiaggia',
      allActivities: '← Tutte le attività',
      language: 'Lingua',
      navStories: 'Storie',
      navMeet: 'Conosci Crabby',
      navFacts: 'Curiosità sui granchi',
      navActivity: 'Angolo delle attività',
      navContact: 'Contatti',
      activityBtn: '🦀 Attività',
      activityBtnTitle: "Prova l'attività di questa storia",
      titleMango: 'Crabby e il gelato al mango',
      titleHiding: 'Crabby e il nascondiglio perfetto',
      altMangoCone: 'Crabby, il granchio Lego, tiene trionfante un cono gelato al mango',
      altWindowsill: 'Crabby, il granchio Lego, guarda Sofia che si spazzola i capelli',
      // activity pages
      wsHeading: "1. Il crucipuzzle di Crabby",
      wsSub: "Clicca su una lettera, poi clicca sull'ultima lettera di una parola per selezionare tutta la riga. Trova tutte le 10 parole nascoste nella griglia.",
      wsDone: "Le hai trovate tutte! Che occhio! 🦀",
      quizHeading: "2. Vero o falso?",
      quizSub: "Leggi ogni frase sulla storia e scegli Vero o Falso.",
      quizTrue: "Vero",
      quizFalse: "Falso",
      quizTrueFb: "Vero!",
      quizFalseFb: "Falso!",
      quizScore: "Punteggio: {c} / {n} finora ({a}/{n} risposte)",
      orderHeading: "3. Mettili in ordine",
      orderCheck: "Controlla il mio ordine",
      orderShuffle: "Mescola di nuovo",
      orderDone: "È l'ordine giusto — complimenti! 🦀",
      moveUp: "Sposta su",
      moveDown: "Sposta giù",
      colourHeading: "4. Colora Crabby",
      printPicture: "Stampa il disegno",
      yourTurnHeading: "5. Tocca a te!",
      yourTurnPlaceholder: "Un giorno, Crabby decise di...",
      printStory: "Stampa la mia storia",
      clear: "Cancella"
    },
    fr: {
      back: '← Retour',
      backToBeach: '← Retour à la plage',
      allActivities: '← Toutes les activités',
      language: 'Langue',
      navStories: 'Histoires',
      navMeet: 'Rencontre Crabby',
      navFacts: 'Le savais-tu ?',
      navActivity: 'Coin des activités',
      navContact: 'Contact',
      activityBtn: '🦀 Activité',
      activityBtnTitle: "Essaie l'activité de cette histoire",
      titleMango: 'Crabby et la glace à la mangue',
      titleHiding: 'Crabby et la cachette parfaite',
      altMangoCone: 'Crabby, le crabe en Lego, brandit fièrement un cornet de glace à la mangue',
      altWindowsill: 'Crabby, le crabe en Lego, regarde Sofia se brosser les cheveux',
      // activity pages
      wsHeading: "1. Les mots mêlés de Crabby",
      wsSub: "Clique sur une lettre, puis sur la dernière lettre d'un mot pour sélectionner toute la ligne. Trouve les 10 mots cachés dans la grille.",
      wsDone: "Tu les as tous trouvés ! Quels bons yeux ! 🦀",
      quizHeading: "2. Vrai ou faux ?",
      quizSub: "Lis chaque phrase sur l'histoire et choisis Vrai ou Faux.",
      quizTrue: "Vrai",
      quizFalse: "Faux",
      quizTrueFb: "Vrai !",
      quizFalseFb: "Faux !",
      quizScore: "Score : {c} / {n} pour l'instant ({a}/{n} réponses)",
      orderHeading: "3. Remets dans l'ordre",
      orderCheck: "Vérifier mon ordre",
      orderShuffle: "Mélanger encore",
      orderDone: "C'est le bon ordre — bravo ! 🦀",
      moveUp: "Monter",
      moveDown: "Descendre",
      colourHeading: "4. Colorie Crabby",
      printPicture: "Imprimer le dessin",
      yourTurnHeading: "5. À toi de jouer !",
      yourTurnPlaceholder: "Un jour, Crabby décida de...",
      printStory: "Imprimer mon histoire",
      clear: "Effacer"
    },
    es: {
      back: '← Volver',
      backToBeach: '← Volver a la playa',
      allActivities: '← Todas las actividades',
      language: 'Idioma',
      navStories: 'Cuentos',
      navMeet: 'Conoce a Crabby',
      navFacts: 'Datos de cangrejos',
      navActivity: 'Rincón de actividades',
      navContact: 'Contacto',
      activityBtn: '🦀 Actividad',
      activityBtnTitle: 'Prueba la actividad de este cuento',
      titleMango: 'Crabby y el helado de mango',
      titleHiding: 'Crabby y el escondite perfecto',
      altMangoCone: 'Crabby, el cangrejo de Lego, sostiene triunfante un cucurucho de helado de mango',
      altWindowsill: 'Crabby, el cangrejo de Lego, mira a Sofia cepillarse el pelo',
      // activity pages
      wsHeading: "1. La sopa de letras de Crabby",
      wsSub: "Haz clic en una letra y luego en la última letra de una palabra para seleccionar toda la línea. Encuentra las 10 palabras escondidas en la cuadrícula.",
      wsDone: "¡Las encontraste todas! ¡Qué vista! 🦀",
      quizHeading: "2. ¿Verdadero o falso?",
      quizSub: "Lee cada frase sobre el cuento y elige Verdadero o Falso.",
      quizTrue: "Verdadero",
      quizFalse: "Falso",
      quizTrueFb: "¡Verdadero!",
      quizFalseFb: "¡Falso!",
      quizScore: "Puntuación: {c} / {n} por ahora ({a}/{n} respondidas)",
      orderHeading: "3. Ponlo en orden",
      orderCheck: "Comprobar mi orden",
      orderShuffle: "Mezclar otra vez",
      orderDone: "¡Ese es el orden correcto! ¡Bien hecho! 🦀",
      moveUp: "Subir",
      moveDown: "Bajar",
      colourHeading: "4. Colorea a Crabby",
      printPicture: "Imprimir el dibujo",
      yourTurnHeading: "5. ¡Te toca!",
      yourTurnPlaceholder: "Un día, Crabby decidió...",
      printStory: "Imprimir mi cuento",
      clear: "Borrar"
    }
  };

  var STORAGE_KEY = 'crabby-lang';
  var ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];
  var dict = { el: {}, it: {}, fr: {}, es: {} };
  var listeners = [];
  var english = new WeakMap();   // original English of each labelled element
  var ready = false;

  function known(code) {
    for (var i = 0; i < LANGUAGES.length; i++) if (LANGUAGES[i].code === code) return LANGUAGES[i];
    return null;
  }

  function merge(extra) {
    for (var code in extra) {
      if (!dict[code]) continue;
      for (var k in extra[code]) dict[code][k] = extra[code][k];
    }
  }
  merge(SHARED);

  // ---- which language to start in ----
  var current = 'en';
  var m = location.search.match(/[?&]lang=([a-z]{2})/);
  if (m && known(m[1])) {
    current = m[1];
    // a link like ?lang=el also becomes the reader's choice for the rest of the site
    try { localStorage.setItem(STORAGE_KEY, current); } catch (e) {}
  } else {
    try { var saved = localStorage.getItem(STORAGE_KEY); if (known(saved)) current = saved; } catch (e) {}
  }
  document.documentElement.lang = known(current).html;

  // ---- styles for the picker, plus a Greek-friendly heading font ----
  var css =
    '.lang-picker{position:absolute;top:14px;right:14px;z-index:30;display:inline-flex;align-items:center;gap:6px;' +
      'padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 3px 12px rgba(90,66,30,.22);' +
      'font:600 15px "Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",Arial,sans-serif;color:#163a5c}' +
    '.lang-picker select{font:inherit;color:inherit;background:transparent;border:none;cursor:pointer;padding:2px 0;' +
      '-webkit-appearance:none;appearance:none;padding-right:14px;' +
      'background-image:linear-gradient(45deg,transparent 50%,#163a5c 50%),linear-gradient(135deg,#163a5c 50%,transparent 50%);' +
      'background-position:right 5px center,right 0 center;background-size:5px 5px,5px 5px;background-repeat:no-repeat}' +
    '.lang-picker select:focus-visible{outline:2px solid #163a5c;outline-offset:3px;border-radius:4px}' +
    '.lang-picker.fixed{position:fixed}' +
    '.lang-chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}' +
    '.lang-chips button{font:600 14px "Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",Arial,sans-serif;' +
      'padding:6px 11px;border-radius:999px;border:2px solid #163a5c;background:transparent;color:#163a5c;cursor:pointer}' +
    '.lang-chips button[aria-pressed="true"]{background:#163a5c;color:#fff}' +
    /* The site's lettering fonts have no Greek letters, so Greek headings use Georgia */
    'html[lang="el"] h1{font-family:Georgia,"Times New Roman",serif!important;font-style:italic;font-size:clamp(30px,7vw,42px)}' +
    '@media print{.lang-picker{display:none!important}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---- applying a language to the labelled elements ----
  function remember(el) {
    if (english.has(el)) return english.get(el);
    var orig = {};
    if (el.hasAttribute('data-i18n')) orig.text = el.innerHTML;
    ATTRS.forEach(function (a) { if (el.hasAttribute('data-i18n-' + a)) orig[a] = el.getAttribute(a); });
    english.set(el, orig);
    return orig;
  }

  function translate(root) {
    var d = dict[current] || {};
    var sel = '[data-i18n],' + ATTRS.map(function (a) { return '[data-i18n-' + a + ']'; }).join(',');
    var els = (root || document).querySelectorAll(sel);
    Array.prototype.forEach.call(els, function (el) {
      var orig = remember(el);
      var key = el.getAttribute('data-i18n');
      if (key) el.innerHTML = (current !== 'en' && d[key] != null) ? d[key] : orig.text;
      ATTRS.forEach(function (a) {
        var k = el.getAttribute('data-i18n-' + a);
        if (k) el.setAttribute(a, (current !== 'en' && d[k] != null) ? d[k] : orig[a]);
      });
    });
    var t = document.querySelector('title[data-i18n]');
    if (t) document.title = t.textContent;
  }

  // ---- the picker(s) ----
  function buildPicker(host) {
    var label = document.createElement('label');
    label.className = 'lang-picker' + (host && host.hasAttribute('data-fixed') ? ' fixed' : '');
    label.innerHTML = '<span aria-hidden="true">🌐</span>';
    var select = document.createElement('select');
    select.setAttribute('data-i18n-aria-label', 'language');
    select.setAttribute('aria-label', 'Language');
    LANGUAGES.forEach(function (l) {
      var o = document.createElement('option');
      o.value = l.code; o.textContent = l.name; o.lang = l.html;
      select.appendChild(o);
    });
    select.addEventListener('change', function () { setLang(select.value); });
    label.appendChild(select);
    if (host) host.appendChild(label); else document.body.insertBefore(label, document.body.firstChild);
  }

  function buildChips(host) {
    LANGUAGES.forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button'; b.lang = l.html; b.textContent = l.name; b.value = l.code;
      b.addEventListener('click', function () { setLang(l.code); });
      host.appendChild(b);
    });
    host.classList.add('lang-chips');
  }

  function syncControls() {
    Array.prototype.forEach.call(document.querySelectorAll('.lang-picker select'), function (s) { s.value = current; });
    Array.prototype.forEach.call(document.querySelectorAll('.lang-chips button'), function (b) {
      b.setAttribute('aria-pressed', b.value === current ? 'true' : 'false');
    });
  }

  function apply() {
    document.documentElement.lang = known(current).html;
    translate();
    syncControls();
    listeners.forEach(function (fn) { try { fn(current); } catch (e) { console.error(e); } });
  }

  function setLang(code) {
    if (!known(code)) code = 'en';
    current = code;
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
    // Keep a ?lang= in the address bar in step, so a copied link opens in the same language
    if (/[?&]lang=/.test(location.search) && window.history && history.replaceState) {
      var url = location.href.replace(/([?&]lang=)[a-z]{2}/, '$1' + code);
      history.replaceState(null, '', url);
    }
    if (ready) apply();
  }

  function init() {
    ready = true;
    var hosts = document.querySelectorAll('[data-lang-picker]');
    if (hosts.length) Array.prototype.forEach.call(hosts, buildPicker);
    else if (!document.body.hasAttribute('data-no-lang-picker')) buildPicker(null);
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-chips]'), buildChips);
    apply();
  }

  window.CrabbyLang = {
    languages: LANGUAGES,
    get lang() { return current; },
    add: function (extra) { merge(extra); if (ready) translate(); },
    t: function (key, fallback) { var d = dict[current]; return (d && d[key] != null) ? d[key] : fallback; },
    set: setLang,
    onChange: function (fn) { listeners.push(fn); if (ready) fn(current); },
    translate: translate
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
