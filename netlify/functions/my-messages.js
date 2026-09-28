/* /.netlify/functions/my-messages — for any logged-in reader.
   GET → the feedback messages sent with this account's email address,
         newest first, with the replies from the Cheeky Crab team.
   The email comes from the reader's login (checked by Netlify), never
   from the browser, so people only ever see their own messages. */
var R = require('../lib/roles');
var F = require('../lib/feedback-store');

exports.handler = function (event, context) {
  F.connect(event);
  var user = context.clientContext && context.clientContext.user;
  if (!user || !user.email) return Promise.resolve(R.json(401, { error: 'Please log in first.' }));
  var email = String(user.email).toLowerCase();
  return F.listMessages().then(function (list) {
    var mine = list.filter(function (m) { return String(m.email).toLowerCase() === email; }).map(function (m) {
      return {
        id: m.id, created_at: m.created_at, story: m.story, rating: m.rating, message: m.message,
        replies: m.replies.map(function (r) { return { at: r.at, by: r.by, text: r.text }; })
      };
    });
    return R.json(200, { messages: mine });
  }).catch(function (err) {
    return R.json(503, { error: err.code || 'unavailable' });
  });
};
