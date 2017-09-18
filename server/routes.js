
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
    console.log('POST', req.path, req.body);
    if (/\/test\/edit$/.test(req.headers.referer || '')) {
      // mock endpoint, for testing the editor from /test/edit URL
      return setTimeout(() => res.send({ ok: req.body }), 1000);
    }
    return res.send({ ok: yield saveCardComment(req.body) });
    // TODO: return status code based on result, instead of `ok`
  })),

  app.get('/test/edit', (req, res) => res.render('comment-editor.html', {
    comment: { data: { board: {}, card: {} }, date: new Date().toISOString() },
    token: 'dummy_token',
  })),

};

module.exports = routes;
