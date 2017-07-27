const rp = require('request-promise');
Promise = require('bluebird');

const trelloApi = 'https://api.trello.com/1';

// helper to call Trello API to get comments of a card
// params = { cardId, token }
const getCardComments = Promise.coroutine(function* (params){
  const apiReq = {
    uri: `${trelloApi}/cards/${params.cardId}/actions`,
    qs: Object.assign({ key: process.env.APP_KEY, filter: 'commentCard' }, params),
    json: true
  };
  try {
    return yield rp.get(apiReq);
  } catch (apiErr) {
    console.error(`Error fetching comments from Trello API. cardId=${params.cardId} error=${apiErr.message}`);
    return false;
  }
});

// helper to call Trello API to save a card's comment
// params = { commentId, token, value }
const saveCardComment = Promise.coroutine(function* (params){
  const apiReq = {
    uri: `${trelloApi}/actions/${params.commentId}/text`,
    body: {
      key: process.env.APP_KEY,
      token: params.token,
      id: params.commentId,
      value: params.value,
    },
    json: true
  };
  try {
    return yield rp.put(apiReq);
  } catch (apiErr) {
    console.error(`Error saving comment to Trello API. commentId=${params.commentId} error=${apiErr.message}`);
    return false;
  }
});

const routes = (app) => {

  // POST /save
  app.post('/save', Promise.coroutine(function* (req, res) {
    console.log('POST', req.path, req.params, req.body);
    if (/\/test\/edit$/.test(req.headers.referer || '')) {
      // mock endpoint, for testing the editor from /test/edit URL
      return setTimeout(() => res.send({ ok: true }), 4000);
    }
    return res.send({ ok: yield saveCardComment(req.body) });
    // TODO: return status code based on result, instead of `ok`
  })),

  app.get('/test/edit', (req, res) => res.render('comment-editor.html', {
    comment: { data: { board: {}, card: {} }, date: new Date().toISOString() },
    token: 'dummy_token',
  })),

  // GET /edit
  app.get('/edit/:cardId/:commentId/:token/:date', Promise.coroutine(function* (req, res) {
    console.log('GET', req.path, req.params);
    const params = Object.assign({}, req.params, {
      since: new Date(new Date(req.params.date).getTime() - 1).toISOString(),
      before: new Date(new Date(req.params.date).getTime() + 1).toISOString(),
    });
    const comments = yield getCardComments(params); // { cardId, token, commentId }
    const comment = comments.filter(comment => comment.id == req.params.commentId)[0];
    res.render('comment-editor.html', { comment, token: req.params.token });
    // TODO: don't keep token and IDs visible in URL,
    // e.g. by opening popup using POST, cf https://stackoverflow.com/a/3951843/592254
  })),

  // GET /comments
  app.get('/comments', Promise.coroutine(function* (req, res) {
    console.log('GET /comments', req.query);
    const comments = yield getCardComments(req.query); // { cardId, token }
    return res.send({ comments: comments });
  }))

};

module.exports = routes;
