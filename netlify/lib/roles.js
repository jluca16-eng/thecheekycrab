/* ==========================================================
   ROLES — shared by the functions in netlify/functions/
   ----------------------------------------------------------
   Every account has exactly one role, stored by Netlify Identity
   in the account's app_metadata.roles:
       "admin"  — shown on the site as "Administrator"
       "user"   — shown as "User" (everyone else)

   The email address(es) in the ADMIN_EMAILS environment variable
   (Netlify: Project configuration → Environment variables) are
   always Administrators, even if someone changes them by mistake.
   Separate several with commas. Kept out of the code so the
   address isn't published in the public GitHub repo.
   ========================================================== */
function ownerEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .toLowerCase().split(/[\s,;]+/).filter(Boolean);
}

function isOwner(email) {
  return !!email && ownerEmails().indexOf(String(email).toLowerCase()) !== -1;
}

function rolesOf(user) {
  return (user && user.app_metadata && user.app_metadata.roles) || [];
}

// The single role an account should have.
function roleFor(user) {
  if (isOwner(user && user.email)) return 'admin';
  return rolesOf(user).indexOf('admin') !== -1 ? 'admin' : 'user';
}

function json(status, body) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body)
  };
}

// Talk to Netlify Identity's admin API, using the one-off admin key
// Netlify hands every function call.
function identityApi(identity, path, opts) {
  opts = opts || {};
  return fetch(identity.url + path, {
    method: opts.method || 'GET',
    headers: Object.assign({ Authorization: 'Bearer ' + identity.token },
      opts.body ? { 'Content-Type': 'application/json' } : {}),
    body: opts.body ? JSON.stringify(opts.body) : undefined
  }).then(function (r) {
    return r.text().then(function (t) {
      var data; try { data = t ? JSON.parse(t) : {}; } catch (e) { data = { msg: t }; }
      if (!r.ok) { var err = new Error(data.msg || data.error_description || ('Identity HTTP ' + r.status)); err.status = r.status; throw err; }
      return data;
    });
  });
}

// Checks the caller is a logged-in Administrator. Looks the account up
// fresh (rather than trusting the role inside their login token), so a
// role change takes effect straight away.
// Resolves to { identity, me } or to { error: <response> }.
function requireAdmin(context) {
  var cc = (context && context.clientContext) || {};
  if (!cc.identity) return Promise.resolve({ error: json(503, { error: 'Accounts are not switched on yet.' }) });
  if (!cc.user) return Promise.resolve({ error: json(401, { error: 'Please log in first.' }) });
  return identityApi(cc.identity, '/admin/users/' + cc.user.sub).then(function (me) {
    if (roleFor(me) !== 'admin') return { error: json(403, { error: 'This is for Administrators only.' }) };
    return { identity: cc.identity, me: me };
  }, function () {
    return { error: json(401, { error: 'Please log in again.' }) };
  });
}

module.exports = { isOwner: isOwner, rolesOf: rolesOf, roleFor: roleFor, json: json, identityApi: identityApi, requireAdmin: requireAdmin };
