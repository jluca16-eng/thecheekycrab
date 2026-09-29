/* ==========================================================
   WHO GETS "NEW FEEDBACK" EMAILS — every Administrator.
   ----------------------------------------------------------
   The list of Administrator emails is looked up from Netlify
   Identity when possible, and a copy is kept in Netlify Blobs
   (store "feedback", key "admins") so it's still known when the
   lookup isn't available. The copy is refreshed whenever the
   Admin page's Users tab loads or a role changes.
   ADMIN_EMAILS (environment variable) are always included.
   ========================================================== */
var blobs = require('@netlify/blobs');
var R = require('./roles');

function ownerEmails() {
  return (process.env.ADMIN_EMAILS || '').toLowerCase().split(/[\s,;]+/).filter(Boolean);
}
function unique(list) {
  var seen = {};
  return list.map(function (e) { return String(e || '').trim().toLowerCase(); })
    .filter(function (e) { return e && !seen[e] && (seen[e] = true); });
}
function store() { return blobs.getStore('feedback'); }

// users: a full list of Identity accounts — saves the Administrators among them.
function saveFromUsers(users) {
  var admins = unique((users || []).filter(function (u) { return R.roleFor(u) === 'admin'; })
    .map(function (u) { return u.email; }));
  return store().setJSON('admins', admins).then(function () { return admins; }, function () { return admins; });
}

function saved() {
  return store().get('admins', { type: 'json' }).then(function (a) { return a || []; }, function () { return []; });
}

// Every Administrator's email address.
function adminEmails(context) {
  var cc = (context && context.clientContext) || {};
  var fresh = cc.identity
    ? R.identityApi(cc.identity, '/admin/users?per_page=500').then(function (d) { return saveFromUsers(d.users); })
    : Promise.reject(new Error('no identity'));
  return fresh.catch(saved).then(function (list) { return unique(list.concat(ownerEmails())); });
}

module.exports = { saveFromUsers: saveFromUsers, adminEmails: adminEmails };
