/* /.netlify/functions/admin-feedback — Administrators only.
   GET                                  → every feedback message, with its replies,
                                          plus a tally of the one-tap story reactions
   POST {action:'reply', id, text}      → email a reply to the reader and record it
                                          (no email left: just record it — it can then
                                          be shown on the website with the message)
   POST {action:'replied', id, value}   → mark / unmark as replied by hand
   POST {action:'publish', id, value}   → show / hide a message (and its replies) on the website
   POST {action:'delete', id}           → delete one message (and its replies)
   Storage: see netlify/lib/feedback-store.js. Email: netlify/lib/send-email.js. */
var R = require('../lib/roles');
var F = require('../lib/feedback-store');
var Mail = require('../lib/send-email');

function dateText(iso) {
  return new Date(iso).toLocaleString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Australia/Perth' });
}

exports.handler = function (event, context) {
  F.connect(event);
  return R.requireAdmin(context).then(function (a) {
    if (a.error) return a.error;
    var myName = (a.me.user_metadata && a.me.user_metadata.full_name) || a.me.email;

    if (event.httpMethod === 'GET') {
      return Promise.all([
        F.listMessages(),
        F.listReactions().catch(function () { return null; })   // reactions are a bonus; never block the messages
      ]).then(function (res) { return R.json(200, { messages: res[0], reactions: res[1] }); });
    }
    if (event.httpMethod !== 'POST') return R.json(405, { error: 'Not allowed' });
    var body = {};
    try { body = JSON.parse(event.body || '{}'); } catch (e) {}
    if (!body.id) return R.json(400, { error: 'Which message?' });

    if (body.action === 'reply') {
      var text = String(body.text || '').trim();
      if (!text) return R.json(400, { error: 'Write your reply first.' });
      if (text.length > 5000) return R.json(400, { error: 'That reply is too long (5000 characters at most).' });
      return F.listMessages().then(function (list) {
        var m = list.filter(function (x) { return x.id === body.id; })[0];
        if (!m) return R.json(404, { error: 'That message has gone.' });
        // No email left: record the reply without emailing it. It shows on the
        // website under the message once an Administrator clicks "Show on website".
        var send = m.email ? null : Promise.resolve(false);
        var about = !m.story || m.story === 'The website in general' ? 'The Adventures of Crabby' : '"' + m.story + '"';
        return (send || Mail.sendReply({
          to: m.email, name: m.name,
          subject: 'Re: your feedback on ' + about,
          text: text, original: m.message, originalDate: dateText(m.created_at),
          replyTo: a.me.app_metadata && a.me.app_metadata.reply_to
        })).then(function (emailId) {
          return F.load('replies').then(function (all) {
            var entry = { at: new Date().toISOString(), by: myName, text: text, emailed: !!emailId };
            (all[m.id] = all[m.id] || []).push(entry);
            return F.save('replies', all).then(function () {
              return R.json(200, { id: m.id, reply: entry, replies: all[m.id] });
            });
          });
        });
      });
    }

    if (body.action === 'replied') {
      return F.load('replied').then(function (map) {
        if (body.value) map[body.id] = { at: new Date().toISOString(), by: myName };
        else delete map[body.id];
        return F.save('replied', map).then(function () { return R.json(200, { id: body.id, replied: map[body.id] || null }); });
      });
    }

    if (body.action === 'publish') {
      return F.load('published').then(function (map) {
        if (body.value) map[body.id] = { at: new Date().toISOString(), by: myName };
        else delete map[body.id];
        return F.save('published', map).then(function () { return R.json(200, { id: body.id, published: map[body.id] || null }); });
      });
    }

    if (body.action === 'delete') {
      return F.netlify('/submissions/' + encodeURIComponent(body.id), 'DELETE')
        .then(function () { return Promise.all([F.load('replied'), F.load('replies'), F.load('published')]); })
        .then(function (maps) {
          var jobs = [];
          if (maps[2][body.id]) { delete maps[2][body.id]; jobs.push(F.save('published', maps[2])); }
          if (maps[0][body.id]) { delete maps[0][body.id]; jobs.push(F.save('replied', maps[0])); }
          if (maps[1][body.id]) { delete maps[1][body.id]; jobs.push(F.save('replies', maps[1])); }
          return Promise.all(jobs);
        })
        .then(function () { return R.json(200, { deleted: body.id }); });
    }
    return R.json(400, { error: 'Unknown action' });
  }).catch(function (err) {
    if (err.code) return R.json(503, { error: err.code });
    return R.json(err.status || 500, { error: err.message || 'Something went wrong' });
  });
};
