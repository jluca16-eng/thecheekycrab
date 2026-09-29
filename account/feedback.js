/* ==========================================================
   SIGN UP / LOG IN + FEEDBACK BOX
   ----------------------------------------------------------
   Any page can show the feedback box by adding
       <div class="feedback-box" data-feedback data-story="Story title"></div>
   and loading this file after lang/i18n.js:
       <script src="../account/feedback.js"></script>

   data-story   — the story the feedback is about (in English, so
                  every message you receive is labelled the same way).
                  Leave it off and the box shows a "What's it about?"
                  list instead (that's what the Feedback page does).

   HOW IT WORKS
   • Accounts use Netlify Identity (turn it on in the Netlify
     dashboard: Project configuration → Identity). Readers never
     need a Netlify account of their own.
   • No account is needed to send feedback: just a rating, the
     message and an optional first name (seen only by Administrators).
     No email box — people who want a reply sign up (the sign-up form
     has the email, grown-up tick-box and privacy note). Logging in
     is optional (Feedback page only) and shows "Your messages";
     Administrators log in the same way.
   • Stories also get one-tap reactions: add
       <div data-reactions data-story="Story title"></div>
     They post to the Netlify form "reaction" (see /feedback.html).
   • "What readers are saying": add <div data-public-feedback></div>
     (optionally data-story="…"). Shows messages chosen with
     "Show on website" on /admin — never names or emails.
   • Sending feedback posts to the Netlify form called "feedback",
     which is declared in /feedback.html. Every message appears
     under Forms in the Netlify dashboard, and is emailed to you
     once you add an email notification there.
   • The links in sign-up / password-reset emails land on the home
     page, which forwards them to /feedback where this file
     finishes the job.

   All the words are in TEXT below, in all five languages.
   ========================================================== */
(function () {
  var API = '/.netlify/identity';
  var SESSION_KEY = 'crabby-session';
  var MIN_PASSWORD = 8;

  // The stories shown in the "What's it about?" list. The first part is
  // the label from lang/i18n.js (so the list is translated), the second
  // is the English title that gets sent to you.
  var STORIES = [
    ['titleMango',     'Crabby and the Mango Ice Cream'],
    ['titleHiding',    'Crabby and the Perfect Hiding Place'],
    ['titleGardening', 'Crabby goes to Gardening Club'],
    ['titleEmma',      "Crabby goes to Emma's Birthday Party"],
    ['titlePlane',     'Crabby goes on the Plane'],
    ['titlePalace',    'Crabby goes to Buckingham Palace'],
    ['titleScience',   'Crabby goes to the London Science Museum']
  ];

  // ---------- EDIT: all the wording, in every language ----------
  var TEXT = {
    en: {
      heading: 'Tell us what you thought!',
      intro: "Log in or make an account to see your messages and Crabby's replies.",
      tabLogin: 'Log in', tabSignup: 'Sign up',
      nickname: 'First name or nickname', nicknameHelp: "Please don't use your full name.",
      email: 'Email', emailHelp: "A grown-up's email is best.",
      password: 'Password', passwordHelp: 'At least 8 letters or numbers.',
      grownup: "I'm a grown-up, or a grown-up said it's OK for me to sign up.",
      privacy: "We only keep your nickname and email so we can read and reply to your feedback. We never show them on the website or share them with anyone. If we share a message on the website, it never shows your name or email.",
      btnSignup: 'Create my account', btnLogin: 'Log in',
      forgot: 'Forgot your password?', btnReset: 'Send me a reset link', backToLogin: '← Back to log in',
      checkEmail: "Nearly there! We've sent an email to {email}. Click the link in it to finish signing up.",
      confirmed: "You're all signed up! 🦀",
      resetSent: "If there's an account for that email, we've sent it a link to choose a new password.",
      newPassword: 'Choose a new password', savePassword: 'Save new password',
      passwordSaved: "Password changed — you're logged in.",
      hello: 'Hi {name}!', logout: 'Log out',
      about: "What's it about?", general: 'The website in general',
      rating: 'How much did you like it?', ratingOf: '{n} out of 5',
      message: 'Your feedback', messagePh: 'What did you like? What should Crabby do next?',
      send: 'Send feedback', sending: 'Sending…',
      thanks: 'Thank you! Crabby has your message. 🦀', another: 'Send another',
      errLogin: "That email and password don't match. Please try again.",
      errExists: "There's already an account with that email — try logging in instead.",
      errShort: 'Your password needs at least 8 characters.',
      errGrownup: 'Please tick the box first — ask a grown-up if you need to.',
      errNotConfirmed: 'Please click the link in your email first to finish signing up.',
      errEmpty: 'Please write your feedback first.',
      errLink: 'That link has expired or has already been used.',
      errSetup: "Accounts aren't switched on yet. Please try again soon.",
      errGeneric: 'Something went wrong. Please try again in a moment.',
      myHeading: "Your messages",
      myIntro: "Everything you've sent Crabby, and our replies.",
      myEmpty: "You haven't sent any messages yet.",
      myWaiting: "No reply yet — Crabby reads every message.",
      myReplyFrom: "Reply from {name}",
      mySent: "You wrote on {date}",
      myGeneral: "The website",
      myError: "Your messages can't be shown right now.",
      formIntro: "No account needed — just write to Crabby!",
      nameOpt: "Your first name or nickname",
      optional: "(optional)",
      emailOpt: "Email",
      emailOptHelp: "Only if you'd like a reply — a grown-up's email is best.",
      grownupEmail: "I'm a grown-up, or a grown-up said it's OK to share this email.",
      haveAccount: "Want to see your messages and Crabby's replies?",
      backToForm: "← Back",
      errEmail: "That email doesn't look quite right.",
      errGrownupEmail: "Please tick the grown-up box, or leave the email empty.",
      thanksReply: "Thank you! Crabby has your message and will reply by email. 🦀",
      reactQ: "Did you enjoy this story?",
      reactLove: "Loved it!",
      reactLike: "Liked it",
      reactOk: "It was OK",
      reactThanks: "Thanks for telling Crabby! 🦀",
      pubHeading: "What readers are saying",
      pubReader: "A reader",
      pubReply: "Crabby's reply",
      replyQ: "Want Crabby to reply?",
      replyLink: "Log in or sign up first."
    },
    el: {
      heading: 'Πες μας τη γνώμη σου!',
      intro: "Συνδέσου ή φτιάξε λογαριασμό για να δεις τα μηνύματά σου και τις απαντήσεις του Κράμπι.",
      tabLogin: 'Σύνδεση', tabSignup: 'Εγγραφή',
      nickname: 'Μικρό όνομα ή παρατσούκλι', nicknameHelp: 'Μη γράψεις το πλήρες όνομά σου.',
      email: 'Email', emailHelp: 'Καλύτερα το email ενός μεγάλου.',
      password: 'Κωδικός', passwordHelp: 'Τουλάχιστον 8 γράμματα ή αριθμοί.',
      grownup: 'Είμαι μεγάλος/η ή ένας μεγάλος μού είπε ότι μπορώ να εγγραφώ.',
      privacy: "Κρατάμε μόνο το παρατσούκλι και το email σου για να διαβάσουμε και να απαντήσουμε στη γνώμη σου. Δεν τα δείχνουμε ποτέ στον ιστότοπο και δεν τα δίνουμε σε κανέναν. Αν δείξουμε ένα μήνυμα στον ιστότοπο, δεν φαίνεται ποτέ το όνομα ή το email σου.",
      btnSignup: 'Φτιάξε τον λογαριασμό μου', btnLogin: 'Σύνδεση',
      forgot: 'Ξέχασες τον κωδικό σου;', btnReset: 'Στείλε μου σύνδεσμο επαναφοράς', backToLogin: '← Πίσω στη σύνδεση',
      checkEmail: 'Σχεδόν έτοιμο! Στείλαμε ένα email στο {email}. Πάτησε τον σύνδεσμο μέσα για να ολοκληρωθεί η εγγραφή.',
      confirmed: 'Η εγγραφή σου ολοκληρώθηκε! 🦀',
      resetSent: 'Αν υπάρχει λογαριασμός με αυτό το email, στείλαμε σύνδεσμο για νέο κωδικό.',
      newPassword: 'Διάλεξε νέο κωδικό', savePassword: 'Αποθήκευση νέου κωδικού',
      passwordSaved: 'Ο κωδικός άλλαξε — έχεις συνδεθεί.',
      hello: 'Γεια σου {name}!', logout: 'Αποσύνδεση',
      about: 'Για ποιο θέμα είναι;', general: 'Για τον ιστότοπο γενικά',
      rating: 'Πόσο σου άρεσε;', ratingOf: '{n} στα 5',
      message: 'Η γνώμη σου', messagePh: 'Τι σου άρεσε; Τι να κάνει μετά ο Κράμπι;',
      send: 'Αποστολή', sending: 'Αποστολή…',
      thanks: 'Ευχαριστούμε! Ο Κράμπι πήρε το μήνυμά σου. 🦀', another: 'Στείλε κι άλλο',
      errLogin: 'Το email και ο κωδικός δεν ταιριάζουν. Δοκίμασε ξανά.',
      errExists: 'Υπάρχει ήδη λογαριασμός με αυτό το email — δοκίμασε να συνδεθείς.',
      errShort: 'Ο κωδικός χρειάζεται τουλάχιστον 8 χαρακτήρες.',
      errGrownup: 'Τσέκαρε πρώτα το κουτάκι — ρώτα έναν μεγάλο αν χρειαστεί.',
      errNotConfirmed: 'Πάτησε πρώτα τον σύνδεσμο στο email σου για να ολοκληρωθεί η εγγραφή.',
      errEmpty: 'Γράψε πρώτα τη γνώμη σου.',
      errLink: 'Αυτός ο σύνδεσμος έχει λήξει ή έχει ήδη χρησιμοποιηθεί.',
      errSetup: 'Οι λογαριασμοί δεν έχουν ενεργοποιηθεί ακόμα. Δοκίμασε ξανά σύντομα.',
      errGeneric: 'Κάτι πήγε στραβά. Δοκίμασε ξανά σε λίγο.',
      myHeading: "Τα μηνύματά σου",
      myIntro: "Ό,τι έχεις στείλει στον Κράμπι, και οι απαντήσεις μας.",
      myEmpty: "Δεν έχεις στείλει ακόμα μηνύματα.",
      myWaiting: "Δεν υπάρχει απάντηση ακόμα — ο Κράμπι διαβάζει κάθε μήνυμα.",
      myReplyFrom: "Απάντηση από {name}",
      mySent: "Έγραψες στις {date}",
      myGeneral: "Η ιστοσελίδα",
      myError: "Τα μηνύματά σου δεν μπορούν να εμφανιστούν αυτή τη στιγμή.",
      formIntro: "Δεν χρειάζεται λογαριασμός — απλώς γράψε στον Κράμπι!",
      nameOpt: "Το μικρό σου όνομα ή παρατσούκλι",
      optional: "(προαιρετικό)",
      emailOpt: "Email",
      emailOptHelp: "Μόνο αν θέλεις απάντηση — καλύτερα το email ενός μεγάλου.",
      grownupEmail: "Είμαι μεγάλος/η ή ένας μεγάλος μού είπε ότι μπορώ να δώσω αυτό το email.",
      haveAccount: "Θέλεις να βλέπεις τα μηνύματά σου και τις απαντήσεις του Κράμπι;",
      backToForm: "← Πίσω",
      errEmail: "Αυτό το email δεν φαίνεται σωστό.",
      errGrownupEmail: "Τσέκαρε το κουτάκι για τους μεγάλους ή άφησε το email κενό.",
      thanksReply: "Ευχαριστούμε! Ο Κράμπι πήρε το μήνυμά σου και θα απαντήσει με email. 🦀",
      reactQ: "Σου άρεσε αυτή η ιστορία;",
      reactLove: "Τη λάτρεψα!",
      reactLike: "Μου άρεσε",
      reactOk: "Ήταν εντάξει",
      reactThanks: "Ευχαριστούμε που το είπες στον Κράμπι! 🦀",
      pubHeading: "Τι λένε οι αναγνώστες",
      pubReader: "Ένας αναγνώστης",
      pubReply: "Η απάντηση του Κράμπι",
      replyQ: "Θέλεις να σου απαντήσει ο Κράμπι;",
      replyLink: "Συνδέσου ή κάνε εγγραφή πρώτα."
    },
    it: {
      heading: 'Dicci cosa ne pensi!',
      intro: "Accedi o crea un account per vedere i tuoi messaggi e le risposte di Crabby.",
      tabLogin: 'Accedi', tabSignup: 'Registrati',
      nickname: 'Nome o soprannome', nicknameHelp: 'Per favore non usare il nome completo.',
      email: 'Email', emailHelp: "Meglio l'email di un adulto.",
      password: 'Password', passwordHelp: 'Almeno 8 lettere o numeri.',
      grownup: 'Sono un adulto, oppure un adulto mi ha detto che posso registrarmi.',
      privacy: "Teniamo solo il tuo soprannome e la tua email per leggere e rispondere al tuo parere. Non li mostriamo mai sul sito e non li diamo a nessuno. Se mostriamo un messaggio sul sito, non compaiono mai il tuo nome o la tua email.",
      btnSignup: 'Crea il mio account', btnLogin: 'Accedi',
      forgot: 'Hai dimenticato la password?', btnReset: 'Mandami un link per reimpostarla', backToLogin: "← Torna all'accesso",
      checkEmail: 'Ci siamo quasi! Abbiamo mandato un\'email a {email}. Clicca sul link per completare la registrazione.',
      confirmed: 'Registrazione completata! 🦀',
      resetSent: "Se esiste un account con quell'email, gli abbiamo mandato un link per scegliere una nuova password.",
      newPassword: 'Scegli una nuova password', savePassword: 'Salva la nuova password',
      passwordSaved: 'Password cambiata — hai effettuato l\'accesso.',
      hello: 'Ciao {name}!', logout: 'Esci',
      about: 'Di cosa si tratta?', general: 'Il sito in generale',
      rating: 'Quanto ti è piaciuto?', ratingOf: '{n} su 5',
      message: 'Il tuo parere', messagePh: 'Cosa ti è piaciuto? Cosa dovrebbe fare Crabby adesso?',
      send: 'Invia', sending: 'Invio in corso…',
      thanks: 'Grazie! Crabby ha ricevuto il tuo messaggio. 🦀', another: 'Mandane un altro',
      errLogin: "L'email e la password non corrispondono. Riprova.",
      errExists: "Esiste già un account con quell'email — prova ad accedere.",
      errShort: 'La password deve avere almeno 8 caratteri.',
      errGrownup: 'Prima spunta la casella — chiedi a un adulto se serve.',
      errNotConfirmed: 'Prima clicca sul link nella tua email per completare la registrazione.',
      errEmpty: 'Prima scrivi il tuo parere.',
      errLink: 'Questo link è scaduto o è già stato usato.',
      errSetup: 'Gli account non sono ancora attivi. Riprova presto.',
      errGeneric: 'Qualcosa è andato storto. Riprova tra poco.',
      myHeading: "I tuoi messaggi",
      myIntro: "Tutto quello che hai inviato a Crabby, e le nostre risposte.",
      myEmpty: "Non hai ancora inviato messaggi.",
      myWaiting: "Nessuna risposta per ora — Crabby legge ogni messaggio.",
      myReplyFrom: "Risposta di {name}",
      mySent: "Hai scritto il {date}",
      myGeneral: "Il sito",
      myError: "Al momento non è possibile mostrare i tuoi messaggi.",
      formIntro: "Non serve un account — scrivi pure a Crabby!",
      nameOpt: "Il tuo nome o soprannome",
      optional: "(facoltativo)",
      emailOpt: "Email",
      emailOptHelp: "Solo se vuoi una risposta — meglio l'email di un adulto.",
      grownupEmail: "Sono un adulto, oppure un adulto mi ha detto che posso dare questa email.",
      haveAccount: "Vuoi vedere i tuoi messaggi e le risposte di Crabby?",
      backToForm: "← Indietro",
      errEmail: "Questa email non sembra corretta.",
      errGrownupEmail: "Spunta la casella dell'adulto, oppure lascia vuota l'email.",
      thanksReply: "Grazie! Crabby ha ricevuto il tuo messaggio e ti risponderà via email. 🦀",
      reactQ: "Ti è piaciuta questa storia?",
      reactLove: "Tantissimo!",
      reactLike: "Mi è piaciuta",
      reactOk: "Così così",
      reactThanks: "Grazie per averlo detto a Crabby! 🦀",
      pubHeading: "Cosa dicono i lettori",
      pubReader: "Un lettore",
      pubReply: "La risposta di Crabby",
      replyQ: "Vuoi che Crabby ti risponda?",
      replyLink: "Prima accedi o registrati."
    },
    fr: {
      heading: "Dis-nous ce que tu en as pensé !",
      intro: "Connecte-toi ou crée un compte pour voir tes messages et les réponses de Crabby.",
      tabLogin: 'Se connecter', tabSignup: "S'inscrire",
      nickname: 'Prénom ou surnom', nicknameHelp: "Merci de ne pas mettre ton nom complet.",
      email: 'E-mail', emailHelp: "L'e-mail d'un adulte, c'est mieux.",
      password: 'Mot de passe', passwordHelp: 'Au moins 8 lettres ou chiffres.',
      grownup: "Je suis un adulte, ou un adulte m'a dit que je pouvais m'inscrire.",
      privacy: "Nous gardons seulement ton surnom et ton e-mail pour lire ton avis et y répondre. Nous ne les affichons jamais sur le site et ne les donnons à personne. Si nous partageons un message sur le site, ton nom et ton e-mail n'apparaissent jamais.",
      btnSignup: 'Créer mon compte', btnLogin: 'Se connecter',
      forgot: 'Mot de passe oublié ?', btnReset: "Envoyez-moi un lien", backToLogin: '← Retour à la connexion',
      checkEmail: "Presque fini ! Nous avons envoyé un e-mail à {email}. Clique sur le lien pour terminer ton inscription.",
      confirmed: 'Ton inscription est terminée ! 🦀',
      resetSent: "S'il existe un compte avec cet e-mail, nous lui avons envoyé un lien pour choisir un nouveau mot de passe.",
      newPassword: 'Choisis un nouveau mot de passe', savePassword: 'Enregistrer',
      passwordSaved: 'Mot de passe changé — tu es connecté.',
      hello: 'Bonjour {name} !', logout: 'Se déconnecter',
      about: "C'est à propos de quoi ?", general: 'Le site en général',
      rating: "Tu as aimé comment ?", ratingOf: '{n} sur 5',
      message: 'Ton avis', messagePh: "Qu'est-ce qui t'a plu ? Que devrait faire Crabby ensuite ?",
      send: 'Envoyer', sending: 'Envoi…',
      thanks: 'Merci ! Crabby a bien reçu ton message. 🦀', another: 'En envoyer un autre',
      errLogin: "L'e-mail et le mot de passe ne correspondent pas. Réessaie.",
      errExists: 'Il existe déjà un compte avec cet e-mail — essaie de te connecter.',
      errShort: 'Ton mot de passe doit avoir au moins 8 caractères.',
      errGrownup: "Coche d'abord la case — demande à un adulte si besoin.",
      errNotConfirmed: "Clique d'abord sur le lien dans ton e-mail pour terminer ton inscription.",
      errEmpty: "Écris d'abord ton avis.",
      errLink: 'Ce lien a expiré ou a déjà été utilisé.',
      errSetup: "Les comptes ne sont pas encore activés. Réessaie bientôt.",
      errGeneric: "Un problème est survenu. Réessaie dans un instant.",
      myHeading: "Tes messages",
      myIntro: "Tout ce que tu as envoyé à Crabby, et nos réponses.",
      myEmpty: "Tu n'as encore envoyé aucun message.",
      myWaiting: "Pas encore de réponse — Crabby lit chaque message.",
      myReplyFrom: "Réponse de {name}",
      mySent: "Tu as écrit le {date}",
      myGeneral: "Le site",
      myError: "Impossible d'afficher tes messages pour le moment.",
      formIntro: "Pas besoin de compte — écris simplement à Crabby !",
      nameOpt: "Ton prénom ou surnom",
      optional: "(facultatif)",
      emailOpt: "E-mail",
      emailOptHelp: "Seulement si tu veux une réponse — l'e-mail d'un adulte, c'est mieux.",
      grownupEmail: "Je suis un adulte, ou un adulte m'a dit que je pouvais donner cet e-mail.",
      haveAccount: "Tu veux voir tes messages et les réponses de Crabby ?",
      backToForm: "← Retour",
      errEmail: "Cet e-mail ne semble pas correct.",
      errGrownupEmail: "Coche la case adulte, ou laisse l'e-mail vide.",
      thanksReply: "Merci ! Crabby a bien reçu ton message et te répondra par e-mail. 🦀",
      reactQ: "Tu as aimé cette histoire ?",
      reactLove: "Adoré !",
      reactLike: "Aimé",
      reactOk: "Pas mal",
      reactThanks: "Merci de l'avoir dit à Crabby ! 🦀",
      pubHeading: "Ce que disent les lecteurs",
      pubReader: "Un lecteur",
      pubReply: "La réponse de Crabby",
      replyQ: "Tu veux que Crabby te réponde ?",
      replyLink: "Connecte-toi ou inscris-toi d'abord."
    },
    es: {
      heading: '¡Cuéntanos qué te pareció!',
      intro: "Inicia sesión o crea una cuenta para ver tus mensajes y las respuestas de Crabby.",
      tabLogin: 'Entrar', tabSignup: 'Registrarse',
      nickname: 'Nombre o apodo', nicknameHelp: 'Por favor, no pongas tu nombre completo.',
      email: 'Correo electrónico', emailHelp: 'Mejor el correo de un adulto.',
      password: 'Contraseña', passwordHelp: 'Al menos 8 letras o números.',
      grownup: 'Soy un adulto, o un adulto me ha dicho que puedo registrarme.',
      privacy: "Solo guardamos tu apodo y tu correo para leer tu opinión y responderte. Nunca los mostramos en la web ni se los damos a nadie. Si compartimos un mensaje en la web, nunca aparecen tu nombre ni tu correo.",
      btnSignup: 'Crear mi cuenta', btnLogin: 'Entrar',
      forgot: '¿Olvidaste tu contraseña?', btnReset: 'Envíame un enlace', backToLogin: '← Volver a entrar',
      checkEmail: '¡Ya casi está! Hemos enviado un correo a {email}. Pulsa el enlace para terminar de registrarte.',
      confirmed: '¡Ya estás registrado! 🦀',
      resetSent: 'Si hay una cuenta con ese correo, le hemos enviado un enlace para elegir una contraseña nueva.',
      newPassword: 'Elige una contraseña nueva', savePassword: 'Guardar contraseña',
      passwordSaved: 'Contraseña cambiada — ya has entrado.',
      hello: '¡Hola, {name}!', logout: 'Salir',
      about: '¿De qué se trata?', general: 'La web en general',
      rating: '¿Cuánto te gustó?', ratingOf: '{n} de 5',
      message: 'Tu opinión', messagePh: '¿Qué te gustó? ¿Qué debería hacer Crabby ahora?',
      send: 'Enviar', sending: 'Enviando…',
      thanks: '¡Gracias! Crabby ha recibido tu mensaje. 🦀', another: 'Enviar otro',
      errLogin: 'El correo y la contraseña no coinciden. Inténtalo otra vez.',
      errExists: 'Ya hay una cuenta con ese correo — prueba a entrar.',
      errShort: 'La contraseña necesita al menos 8 caracteres.',
      errGrownup: 'Marca primero la casilla — pregunta a un adulto si hace falta.',
      errNotConfirmed: 'Primero pulsa el enlace de tu correo para terminar de registrarte.',
      errEmpty: 'Escribe primero tu opinión.',
      errLink: 'Ese enlace ha caducado o ya se ha usado.',
      errSetup: 'Las cuentas aún no están activadas. Vuelve a intentarlo pronto.',
      errGeneric: 'Algo ha fallado. Inténtalo de nuevo en un momento.',
      myHeading: "Tus mensajes",
      myIntro: "Todo lo que le has enviado a Crabby, y nuestras respuestas.",
      myEmpty: "Todavía no has enviado ningún mensaje.",
      myWaiting: "Todavía no hay respuesta — Crabby lee todos los mensajes.",
      myReplyFrom: "Respuesta de {name}",
      mySent: "Escribiste el {date}",
      myGeneral: "La web",
      myError: "Ahora mismo no se pueden mostrar tus mensajes.",
      formIntro: "¡No hace falta cuenta — escríbele a Crabby!",
      nameOpt: "Tu nombre o apodo",
      optional: "(opcional)",
      emailOpt: "Correo electrónico",
      emailOptHelp: "Solo si quieres respuesta — mejor el correo de un adulto.",
      grownupEmail: "Soy un adulto, o un adulto me ha dicho que puedo dar este correo.",
      haveAccount: "¿Quieres ver tus mensajes y las respuestas de Crabby?",
      backToForm: "← Volver",
      errEmail: "Ese correo no parece correcto.",
      errGrownupEmail: "Marca la casilla del adulto, o deja el correo vacío.",
      thanksReply: "¡Gracias! Crabby ha recibido tu mensaje y te responderá por correo. 🦀",
      reactQ: "¿Te ha gustado esta historia?",
      reactLove: "¡Me encantó!",
      reactLike: "Me gustó",
      reactOk: "Estuvo bien",
      reactThanks: "¡Gracias por contárselo a Crabby! 🦀",
      pubHeading: "Lo que dicen los lectores",
      pubReader: "Un lector",
      pubReply: "La respuesta de Crabby",
      replyQ: "¿Quieres que Crabby te responda?",
      replyLink: "Primero inicia sesión o regístrate."
    }
  };

  // ---------- styles ----------
  var css =
    '.feedback-box{margin:46px auto 0;max-width:560px;padding:26px 24px 24px;border-radius:14px;background:#fff;' +
      'box-shadow:0 8px 24px rgba(90,66,30,.16);color:#2b2b2b;' +
      'font:16px/1.5 "Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",Arial,sans-serif}' +
    '.feedback-box h2{font:400 34px/1.15 "Alex Brush","Segoe Script","Brush Script MT",cursive;color:#163a5c;text-align:center;margin:0 0 8px}' +
    'html[lang="el"] .feedback-box h2{font:italic 26px/1.2 Georgia,"Times New Roman",serif}' +
    '.feedback-box .fb-intro{text-align:center;margin:0 0 18px;color:#555}' +
    '.fb-tabs{display:flex;gap:6px;justify-content:center;margin-bottom:18px}' +
    '.fb-tabs button{font-family:inherit;font-weight:600;font-size:15px;padding:8px 18px;border-radius:999px;border:2px solid #163a5c;background:transparent;color:#163a5c;cursor:pointer}' +
    '.fb-tabs button[aria-selected="true"]{background:#163a5c;color:#fff}' +
    '.feedback-box label.fb-field{display:block;margin-bottom:14px;font-weight:600;color:#163a5c}' +
    '.feedback-box .fb-help{display:block;font-weight:400;font-size:14px;color:#666}' +
    '.feedback-box input[type=text],.feedback-box input[type=email],.feedback-box input[type=password],.feedback-box select,.feedback-box textarea{' +
      'display:block;width:100%;margin-top:5px;padding:10px 12px;border:1.5px solid #c9bfa3;border-radius:8px;background:#fffdf6;font:inherit;font-weight:400;color:#2b2b2b}' +
    '.feedback-box textarea{min-height:120px;resize:vertical}' +
    '.feedback-box input:focus,.feedback-box select:focus,.feedback-box textarea:focus{outline:2px solid #163a5c;outline-offset:1px;border-color:#163a5c}' +
    '.fb-check{display:flex;gap:10px;align-items:flex-start;margin:4px 0 14px;font-size:15px}' +
    '.fb-check input{margin-top:4px;width:18px;height:18px;flex:none}' +
    '.fb-privacy{font-size:13.5px;line-height:1.5;color:#666;margin:0 0 16px;text-align:left}' +
    '.fb-btn{display:inline-block;padding:11px 24px;border-radius:10px;border:none;background:#163a5c;color:#fff;font-family:inherit;font-weight:700;font-size:16px;cursor:pointer}' +
    '.fb-btn[disabled]{opacity:.6;cursor:default}' +
    '.fb-link{background:none;border:none;padding:0;color:#163a5c;text-decoration:underline;font:inherit;font-size:14.5px;cursor:pointer}' +
    '.fb-row{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;margin-top:4px}' +
    '.fb-msg{text-align:left;line-height:1.5;margin:0 0 14px;padding:10px 12px;border-radius:8px;font-size:15px}' +
    '.fb-msg.err{background:#fde8e4;color:#8a2412}' +
    '.fb-msg.ok{background:#e6f2e2;color:#245b16}' +
    '.fb-user{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;font-weight:600;color:#163a5c}' +
    '.fb-rating{border:none;margin:0 0 14px;padding:0}' +
    '.fb-rating legend{font-weight:600;color:#163a5c;margin-bottom:4px}' +
    '.fb-crabs{display:flex;gap:4px;flex-direction:row-reverse;justify-content:flex-end}' +
    '.fb-crabs input{position:absolute;opacity:0;width:1px;height:1px}' +
    '.fb-crabs label{font-size:30px;line-height:1;cursor:pointer;filter:grayscale(1);opacity:.45;transition:transform .1s}' +
    '.fb-crabs label:hover,.fb-crabs label:hover ~ label,.fb-crabs input:checked ~ label{filter:none;opacity:1}' +
    '.fb-crabs label:hover{transform:scale(1.15)}' +
    '.fb-crabs input:focus-visible + label{outline:2px solid #163a5c;outline-offset:2px;border-radius:6px}' +
    '.fb-hp{position:absolute;left:-9999px}' +
    '.my-messages{margin:30px auto 0;max-width:560px;font:16px/1.5 "Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",Arial,sans-serif;color:#2b2b2b}' +
    '.my-messages h2{font:400 34px/1.15 "Alex Brush","Segoe Script","Brush Script MT",cursive;color:#163a5c;text-align:center;margin:0 0 4px}' +
    'html[lang="el"] .my-messages h2{font:italic 26px/1.2 Georgia,"Times New Roman",serif}' +
    '.my-messages .my-intro{text-align:center;color:#666;margin:0 0 16px}' +
    '.my-msg{background:#fff;border-radius:14px;box-shadow:0 8px 24px rgba(90,66,30,.12);padding:16px 18px;margin-bottom:14px}' +
    '.my-msg-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 12px;font-size:14px;color:#6b6456;margin-bottom:6px}' +
    '.my-msg-head strong{color:#163a5c;font-size:15.5px}' +
    '.my-text{white-space:pre-wrap;overflow-wrap:anywhere;margin:0}' +
    '.my-reply{margin:12px 0 0;padding:10px 14px;border-radius:12px;background:#eef6ea;border-left:4px solid #6aa35a}' +
    '.my-reply-head{font-size:13.5px;color:#245b16;font-weight:700;margin-bottom:3px}' +
    '.my-wait{margin:10px 0 0;font-size:14px;color:#6b6456;font-style:italic}' +
    '.my-empty{text-align:center;color:#6b6456}' +
    '.my-messages .my-text{text-align:left;font-size:16px;line-height:1.5;text-indent:0}' +
    '.feedback-box .fb-opt{font-weight:400;font-size:14px;color:#777}' +
    '.fb-replyhint{margin:12px 0 0;font-size:14.5px;color:#555}' +
    '.fb-replyhint a{color:#163a5c}' +
    '.fb-account{text-align:center;margin:22px -24px -24px;padding:18px 24px 22px;border-top:1.5px solid #eee3c8;background:#fdf8ea;border-radius:0 0 14px 14px}' +
    '.fb-account p{margin:0 0 12px;font-weight:600;color:#163a5c}' +
    '.fb-account-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}' +
    '.fb-account-btns .fb-btn{min-width:130px}' +
    '.fb-btn-outline{background:#fff;color:#163a5c;box-shadow:inset 0 0 0 2px #163a5c}' +
    '.fb-back{margin:0 0 6px}' +
    '.reactions{margin:36px auto 0;max-width:560px;text-align:center;font:16px/1.4 "Segoe UI",-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",Arial,sans-serif;color:#163a5c}' +
    '.reactions .react-q{font-weight:700;font-size:19px;margin:0 0 12px;text-align:center;color:#163a5c;text-indent:0}' +
    '.react-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}' +
    '.react-btn{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:96px;padding:12px 14px 10px;border-radius:16px;border:2px solid #e3d9bf;background:#fff;color:#163a5c;font:inherit;font-weight:600;font-size:14.5px;cursor:pointer;box-shadow:0 4px 12px rgba(90,66,30,.12);transition:transform .12s}' +
    '.react-btn:hover:not([disabled]){transform:translateY(-3px) scale(1.04)}' +
    '.react-btn:focus-visible{outline:3px solid #163a5c;outline-offset:2px}' +
    '.react-emoji{font-size:40px;line-height:1}' +
    '.react-btn[disabled]{cursor:default;opacity:.45}' +
    '.react-btn.picked{opacity:1;border-color:#163a5c;background:#fff7dc}' +
    '@media print{.feedback-box,.reactions{display:none!important}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- helpers ----------
  function lang() { return (window.CrabbyLang && CrabbyLang.lang) || 'en'; }
  function t(key, vars) {
    var s = (TEXT[lang()] && TEXT[lang()][key]) || TEXT.en[key] || key;
    for (var v in (vars || {})) s = s.replace('{' + v + '}', vars[v]);
    return s;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- talking to Netlify Identity ----------
  function loadSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch (e) { return null; }
  }
  function saveSession(tok) {
    var s = tok ? {
      access_token: tok.access_token,
      refresh_token: tok.refresh_token,
      expires_at: Date.now() + ((tok.expires_in || 3600) - 60) * 1000,
      user: tok.user || (loadSession() || {}).user
    } : null;
    try { s ? localStorage.setItem(SESSION_KEY, JSON.stringify(s)) : localStorage.removeItem(SESSION_KEY); } catch (e) {}
    setCookie(s);
    return s;
  }

  // Netlify checks this cookie before opening Administrator-only pages
  // (the /preview/ rules in _redirects), so it mirrors the login token.
  function setCookie(s) {
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = s
      ? 'nf_jwt=' + s.access_token + '; Path=/; Max-Age=' + Math.max(60, Math.round((s.expires_at - Date.now()) / 1000) + 60) + '; SameSite=Lax' + secure
      : 'nf_jwt=; Path=/; Max-Age=0; SameSite=Lax' + secure;
  }

  // The roles written inside a login token.
  function tokenRoles(accessToken) {
    try {
      var part = accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      var claims = JSON.parse(decodeURIComponent(escape(atob(part))));
      return (claims.app_metadata && claims.app_metadata.roles) || [];
    } catch (e) { return []; }
  }
  function roleFrom(roles) { return roles && roles.indexOf('admin') !== -1 ? 'admin' : (roles && roles.length ? 'user' : ''); }

  function call(path, opts) {
    opts = opts || {};
    var headers = opts.headers || {};
    if (opts.json) { headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(opts.json); }
    if (opts.token) headers.Authorization = 'Bearer ' + opts.token;
    return fetch(API + path, { method: opts.method || 'GET', headers: headers, body: opts.body })
      .then(function (r) {
        return r.text().then(function (txt) {
          var data; try { data = txt ? JSON.parse(txt) : {}; } catch (e) { data = { msg: txt }; }
          if (!r.ok) { var err = new Error(data.error_description || data.msg || data.error || ('HTTP ' + r.status)); err.status = r.status; throw err; }
          return data;
        });
      });
  }

  function tokenRequest(fields) {
    var body = Object.keys(fields).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(fields[k]);
    }).join('&');
    return call('/token', { method: 'POST', body: body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  }

  function withUser(tok, refreshed) {
    // Fetch the account details that go with a fresh token, then remember both.
    return call('/user', { token: tok.access_token }).then(function (user) {
      var role = roleFrom(user.app_metadata && user.app_metadata.roles);
      // A role given at this very login may not be inside the token yet —
      // swap it for a fresh one once, so Administrator pages open.
      if (!refreshed && role && roleFrom(tokenRoles(tok.access_token)) !== role) {
        return tokenRequest({ grant_type: 'refresh_token', refresh_token: tok.refresh_token })
          .then(function (t2) { return withUser(t2, true); }, function () { return finish(); });
      }
      return finish();
      function finish() {
        tok.user = { email: user.email, name: (user.user_metadata && user.user_metadata.full_name) || '', role: role };
        return saveSession(tok);
      }
    });
  }

  // Returns a still-valid session (refreshing it if needed), or null.
  function currentSession() {
    var s = loadSession();
    if (!s) return Promise.resolve(null);
    if (Date.now() < s.expires_at) {
      setCookie(s);
      // logins saved before roles existed: look the role up once
      if (s.user && s.user.role === undefined) {
        return withUser({ access_token: s.access_token, refresh_token: s.refresh_token,
                          expires_in: Math.round((s.expires_at - Date.now()) / 1000) + 60 })
          .catch(function () { return s; });
      }
      return Promise.resolve(s);
    }
    return tokenRequest({ grant_type: 'refresh_token', refresh_token: s.refresh_token })
      .then(withUser)
      .catch(function () { saveSession(null); return null; });
  }

  function friendlyError(err, where) {
    var m = (err && err.message || '').toLowerCase();
    if (err && err.status === 404) return t('errSetup');
    if (/not confirmed|email not confirmed/.test(m)) return t('errNotConfirmed');
    if (where === 'login' && (/invalid|no user|password/.test(m) || err.status === 400)) return t('errLogin');
    if (where === 'signup' && /already|registered|exists/.test(m)) return t('errExists');
    if (where === 'signup' && /password/.test(m)) return t('errShort');
    if (where === 'verify') return t('errLink');
    return t('errGeneric');
  }

  // ---------- the box itself ----------
  var boxes = [];
  var flash = null;       // one-off message shown at the top of every box
  var view = 'form';      // form | thanks | login | signup | reset | newpassword
  var session = null;
  var draft = {};         // keeps typed text when the language changes

  function renderAll() { boxes.forEach(render); }

  function msgHtml() {
    return flash ? '<p class="fb-msg ' + flash.kind + '" role="status">' + esc(flash.text) + '</p>' : '';
  }

  function render(box) {
    var story = box.getAttribute('data-story');
    var h = '<h2>' + esc(t('heading')) + '</h2>';

    if (view === 'form' || view === 'thanks') {
      if (session) {
        var name = (session.user && (session.user.name || session.user.email)) || '';
        h += '<div class="fb-user"><span>' + esc(t('hello', { name: name })) + '</span>' +
             '<button type="button" class="fb-link" data-act="logout">' + esc(t('logout')) + '</button></div>';
      }
      h += msgHtml();
      if (view === 'thanks') {
        h += '<button type="button" class="fb-btn" data-act="another">' + esc(t('another')) + '</button>';
      } else {
        h += '<form data-form="feedback" novalidate>';
        h += '<p class="fb-hp"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>';
        if (!story) {
          h += '<label class="fb-field">' + esc(t('about')) + '<select name="story">' +
               '<option value="The website in general">' + esc(t('general')) + '</option>';
          STORIES.forEach(function (s) {
            var label = (window.CrabbyLang && CrabbyLang.t(s[0], s[1])) || s[1];
            h += '<option value="' + esc(s[1]) + '"' + (draft.story === s[1] ? ' selected' : '') + '>' + esc(label) + '</option>';
          });
          h += '</select></label>';
        }
        h += '<fieldset class="fb-rating"><legend>' + esc(t('rating')) + '</legend><div class="fb-crabs">';
        for (var n = 5; n >= 1; n--) {
          var id = 'fbr-' + boxes.indexOf(box) + '-' + n;
          h += '<input type="radio" name="rating" value="' + n + '" id="' + id + '"' + (String(draft.rating) === String(n) ? ' checked' : '') + '>' +
               '<label for="' + id + '" title="' + esc(t('ratingOf', { n: n })) + '" aria-label="' + esc(t('ratingOf', { n: n })) + '">🦀</label>';
        }
        h += '</div></fieldset>';
        h += '<label class="fb-field">' + esc(t('message')) +
             '<textarea name="message" maxlength="3000" placeholder="' + esc(t('messagePh')) + '">' + esc(draft.message || '') + '</textarea></label>';
        if (!session) {
          // No account needed. The name is optional and only ever seen by
          // Administrators. No email here — people who want a reply sign up
          // (the sign-up form has the email, grown-up tick-box and privacy note).
          h += '<label class="fb-field">' + esc(t('nameOpt')) + ' <span class="fb-opt">' + esc(t('optional')) + '</span>' +
               '<input type="text" name="nickname" maxlength="40" autocomplete="nickname" value="' + esc(draft.nickname || '') + '"></label>';
        }
        h += '<button type="submit" class="fb-btn">' + esc(t('send')) + '</button>';
        if (!session) {
          // How to get a reply: on the Feedback page the Log in / Sign up
          // panel is just below; on a story it links to the Feedback page.
          h += '<p class="fb-replyhint">' + esc(t('replyQ')) + ' ' + (story
            ? '<a href="/feedback#login">' + esc(t('replyLink')) + '</a>'
            : '<button type="button" class="fb-link" data-act="login">' + esc(t('replyLink')) + '</button>') + '</p>';
        }
        h += '</form>';
        // Only the Feedback page (no data-story) offers the optional login.
        if (!session && !story) {
          h += '<div class="fb-account"><p>' + esc(t('haveAccount')) + '</p><div class="fb-account-btns">' +
               '<button type="button" class="fb-btn fb-btn-outline" data-act="login">' + esc(t('tabLogin')) + '</button>' +
               '<button type="button" class="fb-btn" data-act="signup">' + esc(t('tabSignup')) + '</button></div></div>';
        }
      }
    } else if (view === 'newpassword') {
      h += msgHtml();
      h += '<form data-form="newpassword" novalidate>' +
           '<label class="fb-field">' + esc(t('newPassword')) + '<span class="fb-help">' + esc(t('passwordHelp')) + '</span>' +
           '<input type="password" name="password" autocomplete="new-password" required></label>' +
           '<button type="submit" class="fb-btn">' + esc(t('savePassword')) + '</button></form>';
    } else if (view === 'reset') {
      h += msgHtml();
      h += '<form data-form="reset" novalidate>' +
           '<label class="fb-field">' + esc(t('email')) + '<input type="email" name="email" autocomplete="email" required value="' + esc(draft.email || '') + '"></label>' +
           '<div class="fb-row"><button type="submit" class="fb-btn">' + esc(t('btnReset')) + '</button>' +
           '<button type="button" class="fb-link" data-act="login">' + esc(t('backToLogin')) + '</button></div></form>';
    } else {
      var signup = view === 'signup';
      h += '<p class="fb-back"><button type="button" class="fb-link" data-act="form">' + esc(t('backToForm')) + '</button></p>';
      h += '<p class="fb-intro">' + esc(t('intro')) + '</p>';
      h += '<div class="fb-tabs" role="tablist">' +
           '<button type="button" role="tab" data-act="login" aria-selected="' + !signup + '">' + esc(t('tabLogin')) + '</button>' +
           '<button type="button" role="tab" data-act="signup" aria-selected="' + signup + '">' + esc(t('tabSignup')) + '</button></div>';
      h += msgHtml();
      h += '<form data-form="' + (signup ? 'signup' : 'login') + '" novalidate>';
      if (signup) {
        h += '<label class="fb-field">' + esc(t('nickname')) + '<span class="fb-help">' + esc(t('nicknameHelp')) + '</span>' +
             '<input type="text" name="nickname" maxlength="40" autocomplete="nickname" required value="' + esc(draft.nickname || '') + '"></label>';
      }
      h += '<label class="fb-field">' + esc(t('email')) + (signup ? '<span class="fb-help">' + esc(t('emailHelp')) + '</span>' : '') +
           '<input type="email" name="email" autocomplete="email" required value="' + esc(draft.email || '') + '"></label>';
      h += '<label class="fb-field">' + esc(t('password')) + (signup ? '<span class="fb-help">' + esc(t('passwordHelp')) + '</span>' : '') +
           '<input type="password" name="password" autocomplete="' + (signup ? 'new-password' : 'current-password') + '" required></label>';
      if (signup) {
        h += '<label class="fb-check"><input type="checkbox" name="grownup"' + (draft.grownup ? ' checked' : '') + '><span>' + esc(t('grownup')) + '</span></label>';
        h += '<p class="fb-privacy">' + esc(t('privacy')) + '</p>';
        h += '<button type="submit" class="fb-btn">' + esc(t('btnSignup')) + '</button>';
      } else {
        h += '<div class="fb-row"><button type="submit" class="fb-btn">' + esc(t('btnLogin')) + '</button>' +
             '<button type="button" class="fb-link" data-act="reset">' + esc(t('forgot')) + '</button></div>';
      }
      h += '</form>';
    }
    box.innerHTML = h;
  }

  function go(next, message) {
    view = next;
    flash = message || null;
    renderAll();
    loadMine();
  }

  // ---------- "Your messages" (on the Feedback page) ----------
  // Any element with data-my-messages shows the logged-in reader's own
  // feedback and the replies to it. Hidden when nobody is logged in.
  var mine = null, mineErr = false, mineFor = null;
  function loadMine() {
    var hosts = document.querySelectorAll('[data-my-messages]');
    if (!hosts.length) return;
    var s = session;
    if (!s) { mine = null; mineFor = null; return renderMine(); }
    if (mineFor === s.access_token + view) return;   // already loaded for this login + step
    mineFor = s.access_token + view;
    window.CrabbyAccount.fetch('/.netlify/functions/my-messages')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (d) { mine = d.messages || []; mineErr = false; renderMine(); },
            function () { mine = null; mineErr = true; renderMine(); });
  }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString(lang() === 'en' ? 'en-AU' : lang(), { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch (e) { return iso; }
  }
  function renderMine() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-my-messages]'), function (el) {
      if (!session || (!mine && !mineErr)) { el.innerHTML = ''; el.hidden = true; return; }
      el.hidden = false;
      var h = '<h2>' + esc(t('myHeading')) + '</h2><p class="my-intro">' + esc(t('myIntro')) + '</p>';
      if (mineErr) h += '<p class="my-empty">' + esc(t('myError')) + '</p>';
      else if (!mine.length) h += '<p class="my-empty">' + esc(t('myEmpty')) + '</p>';
      else mine.forEach(function (m) {
        var story = STORIES.filter(function (x) { return x[1] === m.story; })[0];
        var title = story ? ((window.CrabbyLang && CrabbyLang.t(story[0], story[1])) || story[1]) : t('myGeneral');
        h += '<article class="my-msg"><div class="my-msg-head"><strong>' + esc(title) + '</strong><span>' +
             esc(t('mySent', { date: fmtDate(m.created_at) })) + (parseInt(m.rating, 10) ? ' · ' + new Array(parseInt(m.rating, 10) + 1).join('🦀') : '') +
             '</span></div><p class="my-text">' + esc(m.message) + '</p>';
        (m.replies || []).forEach(function (r) {
          h += '<div class="my-reply"><div class="my-reply-head">' + esc(t('myReplyFrom', { name: r.by || 'Crabby' })) + ' · ' + esc(fmtDate(r.at)) + '</div>' +
               '<p class="my-text">' + esc(r.text) + '</p></div>';
        });
        if (!m.replies || !m.replies.length) h += '<p class="my-wait">' + esc(t('myWaiting')) + '</p>';
        h += '</article>';
      });
      el.innerHTML = h;
    });
  }

  function busy(form, on, label) {
    var b = form.querySelector('button[type=submit]');
    if (!b) return;
    if (on) { b.dataset.label = b.textContent; b.textContent = label || '…'; b.disabled = true; }
    else { b.textContent = b.dataset.label || b.textContent; b.disabled = false; }
  }

  function keepDraft(form) {
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === 'password' || el.name === 'bot-field') return;
      if (el.type === 'checkbox') draft[el.name] = el.checked;
      else if (el.type === 'radio') { if (el.checked) draft[el.name] = el.value; }
      else draft[el.name] = el.value;
    });
  }

  // ---------- what each button / form does ----------
  function onClick(e) {
    var act = e.target.closest && e.target.closest('[data-act]');
    if (!act) return;
    var a = act.getAttribute('data-act');
    var form = act.closest('.feedback-box').querySelector('form');
    if (form) keepDraft(form);
    if (a === 'login' || a === 'signup' || a === 'reset' || a === 'form') go(a);
    else if (a === 'another') { draft.message = ''; draft.rating = ''; go('form'); }
    else if (a === 'logout') {
      var s = loadSession();
      if (s) call('/logout', { method: 'POST', token: s.access_token }).catch(function () {});
      saveSession(null); session = null; go('form');
    }
  }

  function onSubmit(e) {
    var form = e.target;
    var kind = form.getAttribute('data-form');
    if (!kind) return;
    e.preventDefault();
    keepDraft(form);
    var f = form.elements;

    if (kind === 'login') {
      busy(form, true);
      tokenRequest({ grant_type: 'password', username: f.email.value.trim(), password: f.password.value })
        .then(withUser)
        .then(function (s) { session = s; go('form'); })
        .catch(function (err) { go('login', { kind: 'err', text: friendlyError(err, 'login') }); });
    }

    else if (kind === 'signup') {
      if (!f.grownup.checked) return go('signup', { kind: 'err', text: t('errGrownup') });
      if (f.password.value.length < MIN_PASSWORD) return go('signup', { kind: 'err', text: t('errShort') });
      var email = f.email.value.trim();
      busy(form, true);
      call('/signup', { method: 'POST', json: {
        email: email, password: f.password.value,
        data: { full_name: f.nickname.value.trim().slice(0, 40), grown_up_ok: true }
      } })
        .then(function (user) {
          // If email confirmation is switched off in Netlify, the account is ready straight away.
          if (user.confirmed_at || user.access_token) {
            return tokenRequest({ grant_type: 'password', username: email, password: f.password.value })
              .then(withUser).then(function (s) { session = s; go('form', { kind: 'ok', text: t('confirmed') }); });
          }
          draft.nickname = '';
          go('login', { kind: 'ok', text: t('checkEmail', { email: email }) });
        })
        .catch(function (err) { go('signup', { kind: 'err', text: friendlyError(err, 'signup') }); });
    }

    else if (kind === 'reset') {
      busy(form, true);
      call('/recover', { method: 'POST', json: { email: f.email.value.trim() } })
        .catch(function () {})   // same answer either way, so nobody can test which emails have accounts
        .then(function () { go('login', { kind: 'ok', text: t('resetSent') }); });
    }

    else if (kind === 'newpassword') {
      if (f.password.value.length < MIN_PASSWORD) return go('newpassword', { kind: 'err', text: t('errShort') });
      busy(form, true);
      call('/user', { method: 'PUT', token: session.access_token, json: { password: f.password.value } })
        .then(function () { go('form', { kind: 'ok', text: t('passwordSaved') }); })
        .catch(function (err) { go('newpassword', { kind: 'err', text: friendlyError(err) }); });
    }

    else if (kind === 'feedback') {
      if (!f.message.value.trim()) return go('form', { kind: 'err', text: t('errEmpty') });
      var typedEmail = f.email ? f.email.value.trim() : '';
      if (typedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(typedEmail)) return go('form', { kind: 'err', text: t('errEmail') });
      if (typedEmail && !f.grownup.checked) return go('form', { kind: 'err', text: t('errGrownupEmail') });
      busy(form, true, t('sending'));
      var box = form.closest('.feedback-box');
      // Logged in: the account's name + email go with the message.
      // Not logged in: whatever (if anything) was typed in the form.
      currentSession().then(function (s) {
        session = s;
        var rating = form.querySelector('input[name=rating]:checked');
        var email = s ? (s.user.email || '') : typedEmail;
        var fields = {
          'form-name': 'feedback',
          'bot-field': f['bot-field'].value,
          name: s ? (s.user.name || '') : (f.nickname ? f.nickname.value.trim().slice(0, 40) : ''),
          email: email,
          story: box.getAttribute('data-story') || (f.story ? f.story.value : ''),
          rating: rating ? rating.value + ' / 5' : '',
          message: f.message.value.trim(),
          page: location.pathname,
          language: lang()
        };
        var body = Object.keys(fields).map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(fields[k]);
        }).join('&');
        return fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
          .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            draft.message = ''; draft.rating = '';
            go('thanks', { kind: 'ok', text: t(email ? 'thanksReply' : 'thanks') });
          });
      }).catch(function () { go('form', { kind: 'err', text: t('errGeneric') }); });
    }
  }

  // ---------- links from the sign-up / reset emails ----------
  // They arrive as  /feedback#confirmation_token=…  or  #recovery_token=…
  function handleEmailLink() {
    var m = location.hash.match(/(confirmation|recovery)_token=([^&]+)/);
    if (!m) return null;
    if (window.history && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    var type = m[1] === 'confirmation' ? 'signup' : 'recovery';
    return call('/verify', { method: 'POST', json: { token: decodeURIComponent(m[2]), type: type } })
      .then(withUser)
      .then(function (s) {
        session = s;
        if (type === 'recovery') { go('newpassword'); }
        else go('form', { kind: 'ok', text: t('confirmed') });
      })
      .catch(function (err) { go('login', { kind: 'err', text: friendlyError(err, 'verify') }); });
  }

  // ---------- for other pages (home page badge, Admin page) ----------
  window.CrabbyAccount = {
    // Promise of the current login (refreshed if needed), or null.
    current: currentSession,
    // Re-reads the account from Netlify, e.g. to pick up a role change.
    reload: function () {
      return currentSession().then(function (s) {
        return s ? withUser({ access_token: s.access_token, refresh_token: s.refresh_token,
                              expires_in: Math.round((s.expires_at - Date.now()) / 1000) + 60 }) : null;
      }).catch(function () { return loadSession(); });
    },
    logout: function () {
      var s = loadSession();
      if (s) call('/logout', { method: 'POST', token: s.access_token }).catch(function () {});
      saveSession(null);
      session = null;
      if (boxes.length) go('form');
    },
    // Calls one of the site's own functions with the login attached.
    fetch: function (path, opts) {
      return currentSession().then(function (s) {
        opts = opts || {};
        var headers = { Authorization: 'Bearer ' + (s ? s.access_token : '') };
        if (opts.json) headers['Content-Type'] = 'application/json';
        return fetch(path, { method: opts.method || (opts.json ? 'POST' : 'GET'), headers: headers,
                             body: opts.json ? JSON.stringify(opts.json) : undefined });
      });
    }
  };

  // ---------- "What readers are saying" (public, no login) ----------
  // Any element with data-public-feedback shows the messages an
  // Administrator chose to show ("Show on website" on /admin), with the
  // replies. Add data-story="English title" to show only that story's.
  // Names and emails are never sent to the browser — each is "A reader".
  // Hidden when there's nothing to show.
  var pubHosts = [], pubList = null;
  function loadPublic() {
    if (!pubHosts.length) return;
    fetch('/.netlify/functions/public-feedback')
      .then(function (r) { return r.ok ? r.json() : { messages: [] }; })
      .then(function (d) { pubList = d.messages || []; pubHosts.forEach(renderPublic); },
            function () { pubList = []; pubHosts.forEach(renderPublic); });
  }
  function renderPublic(el) {
    var only = el.getAttribute('data-story');
    var list = (pubList || []).filter(function (m) { return !only || m.story === only; });
    if (!list.length) { el.hidden = true; el.innerHTML = ''; return; }
    el.hidden = false;
    var h = '<h2>' + esc(t('pubHeading')) + '</h2>';
    list.forEach(function (m) {
      var story = STORIES.filter(function (x) { return x[1] === m.story; })[0];
      var title = only ? '' : (story ? ((window.CrabbyLang && CrabbyLang.t(story[0], story[1])) || story[1]) : t('myGeneral'));
      var n = parseInt(m.rating, 10) || 0;
      h += '<article class="my-msg"><div class="my-msg-head"><strong>' + esc(t('pubReader')) + (title ? ' · ' + esc(title) : '') + '</strong><span>' +
           esc(fmtDate(m.created_at)) + (n ? ' · ' + new Array(n + 1).join('🦀') : '') + '</span></div>' +
           '<p class="my-text">' + esc(m.message) + '</p>';
      (m.replies || []).forEach(function (r) {
        h += '<div class="my-reply"><div class="my-reply-head">' + esc(t('pubReply')) + '</div><p class="my-text">' + esc(r.text) + '</p></div>';
      });
      h += '</article>';
    });
    el.innerHTML = h;
  }

  // ---------- one-tap reactions ("Did you enjoy this story?") ----------
  // Any element with  data-reactions data-story="English title"  shows
  // three buttons. A tap posts to the Netlify form "reaction" (declared
  // in /feedback.html) — no typing, no account. Each browser can react
  // once per story; the choice is remembered in localStorage.
  var REACTIONS = [['love', '😍', 'reactLove'], ['like', '🙂', 'reactLike'], ['ok', '😐', 'reactOk']];
  var REACT_KEY = 'crabby-reactions';
  var reactHosts = [];
  function reacted() { try { return JSON.parse(localStorage.getItem(REACT_KEY)) || {}; } catch (e) { return {}; } }
  function renderReactions(el) {
    var story = el.getAttribute('data-story') || '';
    var done = reacted()[story];
    var h = '<p class="react-q">' + esc(done ? t('reactThanks') : t('reactQ')) + '</p><div class="react-row">';
    REACTIONS.forEach(function (r) {
      var picked = done === r[0];
      h += '<button type="button" class="react-btn' + (picked ? ' picked' : '') + '" data-react="' + r[0] + '"' +
           (done ? ' disabled' : '') + ' aria-pressed="' + picked + '">' +
           '<span class="react-emoji" aria-hidden="true">' + r[1] + '</span><span class="react-label">' + esc(t(r[2])) + '</span></button>';
    });
    el.innerHTML = h + '</div>';
  }
  function onReact(e) {
    var btn = e.target.closest && e.target.closest('[data-react]');
    if (!btn || btn.disabled) return;
    var el = btn.closest('[data-reactions]');
    var story = el.getAttribute('data-story') || '';
    var map = reacted();
    if (map[story]) return;
    map[story] = btn.getAttribute('data-react');
    try { localStorage.setItem(REACT_KEY, JSON.stringify(map)); } catch (err) {}
    renderReactions(el);   // say thank you straight away
    var fields = { 'form-name': 'reaction', 'bot-field': '', story: story, reaction: map[story],
                   page: location.pathname, language: lang() };
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: Object.keys(fields).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(fields[k]); }).join('&')
    }).catch(function () {});
  }

  function init() {
    pubHosts = Array.prototype.slice.call(document.querySelectorAll('[data-public-feedback]'));
    pubHosts.forEach(function (el) { el.classList.add('my-messages', 'public-feedback'); el.hidden = true; });
    loadPublic();
    reactHosts = Array.prototype.slice.call(document.querySelectorAll('[data-reactions]'));
    reactHosts.forEach(function (el) {
      el.classList.add('reactions');
      el.addEventListener('click', onReact);
      renderReactions(el);
    });
    boxes = Array.prototype.slice.call(document.querySelectorAll('[data-feedback]'));
    boxes.forEach(function (b) {
      b.classList.add('feedback-box');
      b.addEventListener('click', onClick);
      b.addEventListener('submit', onSubmit);
    });
    if (window.CrabbyLang) CrabbyLang.onChange(function () {
      boxes.forEach(function (b) { var f = b.querySelector('form'); if (f) keepDraft(f); });
      renderAll();
      renderMine();
      reactHosts.forEach(renderReactions);
      if (pubList) pubHosts.forEach(renderPublic);
    });
    if (!boxes.length) return;
    renderAll();
    if (handleEmailLink()) return;
    currentSession().then(function (s) {
      session = s;
      // "Log in or sign up first" links on the stories arrive as /feedback#login
      if (!s && location.hash === '#login') {
        go('login');
        var b = boxes[0]; if (b && b.scrollIntoView) b.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else go('form');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
