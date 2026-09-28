// Runs automatically when someone signs up (Netlify Identity event).
// Gives the new account its role — see netlify/lib/assign-role.js.
var assign = require('../lib/assign-role');
exports.handler = function (event) { return assign(event); };
