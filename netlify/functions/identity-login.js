// Runs automatically every time someone logs in (Netlify Identity
// event). Fixes up the account's role if it's missing or out of date —
// see netlify/lib/assign-role.js.
var assign = require('../lib/assign-role');
exports.handler = function (event) { return assign(event); };
