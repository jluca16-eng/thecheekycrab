/* ==========================================================
   SENDING EMAIL — replies to feedback go out through Resend
   (resend.com), using these environment variables in Netlify:
     RESEND_API_KEY  the key from Resend (API Keys → Create)
     REPLY_FROM      who it's from, e.g.
                     The Adventures of Crabby <crabby@thecheekycrab.com.au>
                     (the domain must be verified in Resend)
     REPLY_TO        where readers' answers go, e.g. your Gmail
   ========================================================== */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function sendReply(opts) {
  // opts: { to, name, subject, text, original, originalDate }
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
  if (process.env.REPLY_TO) body.reply_to = process.env.REPLY_TO;
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

module.exports = { sendReply: sendReply };
