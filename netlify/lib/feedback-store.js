/* ==========================================================
   FEEDBACK STORE — shared by admin-feedback and my-messages
   ----------------------------------------------------------
   • The messages themselves are Netlify Forms submissions (form
     "feedback"). Reading them needs the NETLIFY_API_TOKEN
     environment variable.
   • One-tap story reactions are the form "reaction" (listReactions).
   • Things added afterwards live in Netlify Blobs, store "feedback":
       "replies"  { <message id>: [ { at, by, text, emailed } ] }
       "replied"  { <message id>: { at, by } }   (marked by hand)
       "published" { <message id>: { at, by } }  (shown on the website)
   ========================================================== */
var blobs = require('@netlify/blobs');

var API = 'https://api.netlify.com/api/v1';
var SITE_ID = process.env.SITE_ID || '8e5240ba-87a0-4848-8681-92e3eb7e298f';
var FORM_NAME = 'feedback';

function netlify(path, method) {
  if (!process.env.NETLIFY_API_TOKEN) { var e0 = new Error('no-token'); e0.status = 503; e0.code = 'no-token'; return Promise.reject(e0); }
  return fetch(API + path, {
    method: method || 'GET',
    headers: { Authorization: 'Bearer ' + process.env.NETLIFY_API_TOKEN }
  }).then(function (r) {
    if (r.status === 401 || r.status === 403) { var e1 = new Error('bad-token'); e1.status = 503; e1.code = 'bad-token'; throw e1; }
    if (!r.ok) { var e = new Error('Netlify API ' + r.status); e.status = r.status; throw e; }
    return r.status === 204 ? {} : r.json();
  });
}

function store() { return blobs.getStore('feedback'); }
function load(key) { return store().get(key, { type: 'json' }).then(function (m) { return m || {}; }); }
function save(key, value) { return store().setJSON(key, value); }

// Every feedback message, newest first, with its replies attached.
function listMessages() {
  return netlify('/sites/' + SITE_ID + '/forms').then(function (forms) {
    var form = forms.filter(function (f) { return f.name === FORM_NAME; })[0];
    if (!form) return [];
    return Promise.all([
      netlify('/forms/' + form.id + '/submissions?per_page=1000'),
      load('replies'),
      load('replied'),
      load('published')
    ]).then(function (res) {
      var replies = res[1], replied = res[2], published = res[3];
      return res[0].map(function (s) {
        var d = s.data || {};
        var rs = replies[s.id] || [];
        var last = rs[rs.length - 1];
        return {
          id: s.id, created_at: s.created_at,
          name: d.name || '', email: d.email || '', story: d.story || '',
          rating: d.rating || '', message: d.message || '',
          page: d.page || '', language: d.language || '',
          replies: rs,
          published: published[s.id] || null,
          replied: replied[s.id] || (last ? { at: last.at, by: last.by } : null)
        };
      }).sort(function (a, b) { return String(b.created_at).localeCompare(String(a.created_at)); });
    });
  });
}

// Tally of the one-tap story reactions (Netlify form "reaction"):
// { <story>: { love, like, ok, total } }
function listReactions() {
  return netlify('/sites/' + SITE_ID + '/forms').then(function (forms) {
    var form = forms.filter(function (f) { return f.name === 'reaction'; })[0];
    if (!form) return {};
    return netlify('/forms/' + form.id + '/submissions?per_page=1000').then(function (subs) {
      var out = {};
      subs.forEach(function (s) {
        var d = s.data || {};
        var r = d.reaction;
        if (['love', 'like', 'ok'].indexOf(r) === -1) return;
        var k = d.story || 'Unknown story';
        var row = out[k] = out[k] || { love: 0, like: 0, ok: 0, total: 0 };
        row[r]++; row.total++;
      });
      return out;
    });
  });
}

module.exports = {
  listReactions: listReactions,
  connect: function (event) { blobs.connectLambda(event); },
  netlify: netlify, load: load, save: save, listMessages: listMessages
};
