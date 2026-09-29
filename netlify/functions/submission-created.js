/* Runs automatically (Netlify event) every time a form is sent and
   passes Netlify's spam check. For the "feedback" form it emails every
   Administrator: the story, rating, message, who sent it (if they
   said), and a button to the Admin page. Reactions (😍 🙂 😐) don't
   send emails. Uses the same email service as replies (Resend). */
var blobs = require('@netlify/blobs');
var Admins = require('../lib/admin-list');
var Mail = require('../lib/send-email');

exports.handler = function (event, context) {
  try { blobs.connectLambda(event); } catch (e) {}
  var payload = {};
  try { payload = JSON.parse(event.body || '{}').payload || {}; } catch (e) {}
  if (payload.form_name !== 'feedback') return Promise.resolve({ statusCode: 204, body: '' });
  var d = payload.data || {};
  if (d['bot-field']) return Promise.resolve({ statusCode: 204, body: '' });

  return Admins.adminEmails(context).then(function (to) {
    if (!to.length) return { statusCode: 204, body: '' };
    return Mail.sendNewFeedback({ to: to, data: d, created_at: payload.created_at })
      .then(function () { return { statusCode: 200, body: 'notified ' + to.length }; });
  }).catch(function (err) {
    console.log('New-feedback email failed:', err && err.message);
    return { statusCode: 200, body: 'not notified' };   // never block the form itself
  });
};
