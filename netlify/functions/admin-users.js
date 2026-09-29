/* /.netlify/functions/admin-users — Administrators only.
   GET                          → list every account
   POST {action:'role', id, role:'admin'|'user'}  → change a role
   POST {action:'delete', id}   → delete an account
   POST {action:'replyto', id, value} → an Administrator's own reply address
                                  (where readers' answers to their replies go;
                                  empty = the site default, REPLY_TO)
   Nobody can change their own role or delete themselves (so the site
   can't be left without an Administrator), and ADMIN_EMAILS accounts
   always stay Administrators. */
var R = require('../lib/roles');

function shape(u) {
  return {
    id: u.id,
    email: u.email,
    name: (u.user_metadata && u.user_metadata.full_name) || '',
    role: R.roleFor(u),
    owner: R.isOwner(u.email),
    reply_to: (u.app_metadata && u.app_metadata.reply_to) || '',
    created_at: u.created_at,
    confirmed: !!u.confirmed_at,
    last_login: u.last_sign_in_at || null
  };
}

exports.handler = function (event, context) {
  return R.requireAdmin(context).then(function (a) {
    if (a.error) return a.error;
    var id = a.identity;

    if (event.httpMethod === 'GET') {
      return R.identityApi(id, '/admin/users?per_page=500').then(function (d) {
        var list = (d.users || []).map(shape);
        list.sort(function (x, y) { return String(y.created_at).localeCompare(String(x.created_at)); });
        return R.json(200, { me: a.me.id, users: list });
      });
    }

    if (event.httpMethod !== 'POST') return R.json(405, { error: 'Not allowed' });
    var body = {};
    try { body = JSON.parse(event.body || '{}'); } catch (e) {}
    if (!body.id) return R.json(400, { error: 'Which account?' });
    if (body.id === a.me.id && body.action !== 'replyto') return R.json(400, { error: "You can't change or delete your own account from here." });

    return R.identityApi(id, '/admin/users/' + body.id).then(function (target) {
      if (body.action === 'role') {
        if (body.role !== 'admin' && body.role !== 'user') return R.json(400, { error: 'Unknown role' });
        if (R.isOwner(target.email) && body.role !== 'admin') return R.json(400, { error: 'This account is always an Administrator (ADMIN_EMAILS).' });
        var app = Object.assign({}, target.app_metadata || {}, { roles: [body.role] });
        return R.identityApi(id, '/admin/users/' + body.id, { method: 'PUT', body: { app_metadata: app } })
          .then(function (u) { return R.json(200, { user: shape(u) }); });
      }
      if (body.action === 'replyto') {
        var addr = String(body.value || '').trim().toLowerCase();
        if (addr && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) return R.json(400, { error: "That doesn't look like an email address." });
        if (R.roleFor(target) !== 'admin') return R.json(400, { error: 'Only Administrators send replies.' });
        var app2 = Object.assign({}, target.app_metadata || {});
        if (addr) app2.reply_to = addr; else delete app2.reply_to;
        return R.identityApi(id, '/admin/users/' + body.id, { method: 'PUT', body: { app_metadata: app2 } })
          .then(function (u) { return R.json(200, { user: shape(u) }); });
      }
      if (body.action === 'delete') {
        if (R.isOwner(target.email)) return R.json(400, { error: "This account can't be deleted here (ADMIN_EMAILS)." });
        return R.identityApi(id, '/admin/users/' + body.id, { method: 'DELETE' })
          .then(function () { return R.json(200, { deleted: body.id }); });
      }
      return R.json(400, { error: 'Unknown action' });
    });
  }).catch(function (err) {
    return R.json(err.status === 404 ? 404 : 500, { error: err.message || 'Something went wrong' });
  });
};
