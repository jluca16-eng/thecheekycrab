/* /.netlify/functions/public-feedback — for everyone, no login.
   GET → the feedback messages an Administrator chose to show on the
         website ("Show on website" on /admin), newest first, with the
         replies. Names and email addresses are NEVER included — the
         website shows each one as "A reader".
   Used by the "What readers are saying" section (account/feedback.js). */
var F = require('../lib/feedback-store');

// Replies usually start "Hi Mia," — drop that first line so the
// reader stays anonymous on the website.
function publicReply(text) {
  return String(text || '').replace(/^\s*(hi|hello|hey|dear|hiya)\b[^\n]{0,60}\n+/i, '').trim();
}

exports.handler = function (event) {
  F.connect(event);
  return F.listMessages().then(function (list) {
    var shown = list.filter(function (m) { return m.published; }).map(function (m) {
      return {
        id: m.id, created_at: m.created_at, story: m.story,
        rating: m.rating, message: m.message, language: m.language,
        replies: m.replies.map(function (r) { return { at: r.at, text: publicReply(r.text) }; })
      };
    });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=60' },
      body: JSON.stringify({ messages: shown })
    };
  }).catch(function () {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [] }) };
  });
};
