// Used by identity-signup and identity-login (Netlify runs those
// automatically). Makes sure the account has exactly one role:
// "admin" for ADMIN_EMAILS or anyone already made an Administrator,
// otherwise "user".
var roles = require('./roles');

module.exports = function (event) {
  var payload = {};
  try { payload = JSON.parse(event.body || '{}'); } catch (e) {}
  var user = payload.user || {};
  var want = [roles.roleFor(user)];
  var have = roles.rolesOf(user);
  if (have.length === 1 && have[0] === want[0]) return Promise.resolve({ statusCode: 204, body: '' });
  var app = Object.assign({}, user.app_metadata || {}, { roles: want });
  return Promise.resolve({ statusCode: 200, body: JSON.stringify({ app_metadata: app }) });
};
