/* /.netlify/functions/admin-feedback — Administrators only.
   GET                        → every message sent with the feedback form
   POST {action:'delete', id} → delete one message

   Reading form messages needs a Netlify access token, saved as the
   environment variable NETLIFY_API_TOKEN (Netlify: User settings →
   Applications → Personal access tokens → New access token; then
   Project configuration → Environment variables). */
var R = require('../lib/roles');
var API = 'https://api.netlify.com/api/v1';
var SITE_ID = process.env.SITE_ID || '8e5240ba-87a0-4848-8681-92e3eb7e298f';
var FORM_NAME = 'feedback';

function netlify(path, method) {
  return fetch(API + path, {
    method: method || 'GET',
    headers: { Authorization: 'Bearer ' + process.env.NETLIFY_API_TOKEN }
  }).then(function (r) {
    if (!r.ok) { var e = new Error('Netlify API ' + r.status); e.status = r.status; throw e; }
    return r.status === 204 ? {} : r.json();
  });
}

exports.handler = function (event, context) {
  return R.requireAdmin(context).then(function (a) {
    if (a.error) return a.error;
    if (!process.env.NETLIFY_API_TOKEN) return R.json(503, { error: 'no-token' });

    if (event.httpMethod === 'GET') {
      return netlify('/sites/' + SITE_ID + '/forms').then(function (forms) {
        var form = forms.filter(function (f) { return f.name === FORM_NAME; })[0];
        if (!form) return R.json(200, { messages: [] });
        return netlify('/forms/' + form.id + '/submissions?per_page=1000').then(function (subs) {
          var list = subs.map(function (s) {
            var d = s.data || {};
            return {
              id: s.id, created_at: s.created_at,
              name: d.name || '', email: d.email || '', story: d.story || '',
              rating: d.rating || '', message: d.message || '',
              page: d.page || '', language: d.language || ''
            };
          });
          return R.json(200, { messages: list });
        });
      });
    }

    if (event.httpMethod !== 'POST') return R.json(405, { error: 'Not allowed' });
    var body = {};
    try { body = JSON.parse(event.body || '{}'); } catch (e) {}
    if (body.action === 'delete' && body.id) {
      return netlify('/submissions/' + encodeURIComponent(body.id), 'DELETE')
        .then(function () { return R.json(200, { deleted: body.id }); });
    }
    return R.json(400, { error: 'Unknown action' });
  }).catch(function (err) {
    if (err.status === 401 || err.status === 403) return R.json(503, { error: 'bad-token' });
    return R.json(500, { error: err.message || 'Something went wrong' });
  });
};
