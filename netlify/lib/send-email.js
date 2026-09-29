/* ==========================================================
   SENDING EMAIL — replies to feedback go out through Resend
   (resend.com), using these environment variables in Netlify:
     RESEND_API_KEY  the key from Resend (API Keys → Create)
     REPLY_FROM      who it's from, e.g.
                     The Adventures of Crabby <crabby@thecheekycrab.com.au>
                     (the domain must be verified in Resend)
     REPLY_TO        where readers' answers go when the Administrator
                     sending the reply hasn't set their own address
                     (Admin page → Users → "Replies come back to")
   ========================================================== */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function sendReply(opts) {
  // opts: { to, name, subject, text, original, originalDate, replyTo }
  if (!process.env.RESEND_API_KEY) { var e0 = new Error('no-email'); e0.code = 'no-email'; e0.status = 503; return Promise.reject(e0); }
  var from = process.env.REPLY_FROM || 'The Adventures of Crabby <crabby@thecheekycrab.com.au>';
  var site = 'https://thecheekycrab.com.au/feedback';
  var quoted = opts.original.split('\n').map(function (l) { return '> ' + l; }).join('\n');
  var text = opts.text + '\n\n' +
    'You can see your messages and our replies any time at ' + site + '\n\n' +
    '———\nOn ' + opts.originalDate + ' you wrote:\n' + quoted + '\n';
  var html =
    '<div style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:#2b2b2b;max-width:600px">' +
    '<div style="white-space:pre-wrap">' + esc(opts.text) + '</div>' +
    '<p style="margin:22px 0;font-size:14px;color:#555">You can see your messages and our replies any time on ' +
    '<a href="' + site + '" style="color:#163a5c">thecheekycrab.com.au</a>.</p>' +
    '<div style="border-left:3px solid #e6dcc2;padding:4px 0 4px 12px;color:#6b6456;font-size:14px">' +
    '<div style="margin-bottom:4px">On ' + esc(opts.originalDate) + ' you wrote:</div>' +
    '<div style="white-space:pre-wrap">' + esc(opts.original) + '</div></div></div>';
  var body = { from: from, to: [opts.to], subject: opts.subject, text: text, html: html };
  var replyTo = opts.replyTo || process.env.REPLY_TO;
  if (replyTo) body.reply_to = replyTo;
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(function (r) {
    return r.json().catch(function () { return {}; }).then(function (d) {
      if (!r.ok) { var e = new Error(d.message || ('Email service said ' + r.status)); e.status = 502; throw e; }
      return d.id || true;
    });
  });
}

// "New feedback" alert to the Administrators (see functions/submission-created.js).
function sendNewFeedback(opts) {
  // opts: { to: [emails], data: {name, email, story, rating, message, page, language}, created_at }
  if (!process.env.RESEND_API_KEY) { var e0 = new Error('no-email'); e0.code = 'no-email'; return Promise.reject(e0); }
  var d = opts.data || {};
  var from = process.env.REPLY_FROM || 'The Adventures of Crabby <crabby@thecheekycrab.com.au>';
  var admin = 'https://thecheekycrab.com.au/admin';
  var story = d.story || 'The website in general';
  var n = parseInt(d.rating, 10) || 0;
  var who = (d.name || 'Someone') + (d.email ? ' (' + d.email + ')' : ' (no email left, so no reply possible)');
  var langs = { en: 'English', el: 'Greek', it: 'Italian', fr: 'French', es: 'Spanish' };
  var when = new Date(opts.created_at || Date.now()).toLocaleString('en-AU', { day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', timeZone: 'Australia/Perth' });
  var rows = [['Story', story], ['Rating', n ? new Array(n + 1).join('🦀') + ' (' + n + ' / 5)' : 'No rating'], ['From', who],
              ['Language', langs[d.language] || d.language || 'English'], ['Sent', when + ' (Perth time)']];
  var text = 'New feedback on The Adventures of Crabby\n\n' +
    rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n') + '\n\n' + (d.message || '') +
    '\n\nRead, reply or share it on the Admin page: ' + admin + '\n';
  var html =
    '<div style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:#2b2b2b;max-width:600px">' +
    '<h2 style="font-size:20px;color:#163a5c;margin:0 0 12px">New feedback on The Adventures of Crabby 🦀</h2>' +
    '<table style="border-collapse:collapse;font-size:15px;margin-bottom:14px">' +
    rows.map(function (r) { return '<tr><td style="padding:3px 14px 3px 0;color:#6b6456;vertical-align:top">' + esc(r[0]) + '</td><td style="padding:3px 0">' + esc(r[1]) + '</td></tr>'; }).join('') +
    '</table>' +
    '<div style="white-space:pre-wrap;background:#fffaf0;border-left:4px solid #e6dcc2;padding:12px 14px;border-radius:6px">' + esc(d.message || '') + '</div>' +
    '<p style="margin:22px 0 6px"><a href="' + admin + '" style="display:inline-block;background:#163a5c;color:#fff;text-decoration:none;font-weight:700;padding:11px 22px;border-radius:10px">Open the Admin page</a></p>' +
    '<p style="font-size:13px;color:#777;margin:14px 0 0">Reply from the Admin page so the reader gets it from crabby@thecheekycrab.com.au and it\'s recorded there. ' +
    'You get this email because you\'re an Administrator of thecheekycrab.com.au.</p></div>';
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: from, to: opts.to, subject: 'New feedback: ' + story + (n ? ' ' + new Array(n + 1).join('🦀') : ''), text: text, html: html })
  }).then(function (r) {
    return r.json().catch(function () { return {}; }).then(function (res) {
      if (!r.ok) throw new Error(res.message || ('Email service said ' + r.status));
      return res.id || true;
    });
  });
}

module.exports = { sendReply: sendReply, sendNewFeedback: sendNewFeedback };
