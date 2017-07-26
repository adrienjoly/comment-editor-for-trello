const _ = require('lodash');
const db = require('./database');
const rp = require('request-promise');

Promise = require('bluebird');

const trelloApi = 'https://api.trello.com/1';

// helper to call Trello API to get comments of a card
const getCardComments = Promise.coroutine(function* (params){
  // params = { cardId, token }
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
const saveCardComment = Promise.coroutine(function* (params){
  // params = { commentId, token, value }
  const apiReq = {
    method: 'PUT',
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
  app.post('/save', Promise.coroutine(function* (req, res) {
    console.log('POST', req.path, req.params, req.body);
    return res.send({ ok: yield saveCardComment(req.body) });
    // TODO: return status code based on result, instead of `ok`
  })),
  // TODO: remove token and IDs from URL by opening popup using POST, cf https://stackoverflow.com/a/3951843/592254
  app.get('/edit/:cardId/:commentId/:token/:date', Promise.coroutine(function* (req, res) {
    console.log('GET', req.path, req.params);
    const params = Object.assign({}, req.params, {
      since: new Date(new Date(req.params.date).getTime() - 1).toISOString(),
      before: new Date(new Date(req.params.date).getTime() + 1).toISOString(),
    });
    const comments = yield getCardComments(params); // { cardId, token, commentId }
    const comment = comments.filter(comment => comment.id == req.params.commentId)[0];
    res.render('comment-editor.html', { comment, token: req.params.token });
    
  })),
  app.get('/comments', Promise.coroutine(function* (req, res) {
    console.log('GET /comments', req.query);
    const comments = yield getCardComments(req.query); // { cardId, token }
    return res.send({ comments: comments });
  }))
  /*
  // Add route handler for creating and updating card snoozes
  app.post('/snooze', Promise.coroutine(function* (req, res) {
    // check that the request contains the fields we expect
    if (!req.body) {
      console.error('Missing body');
      return res.sendStatus(400);
    }
    const token = req.body.token;
    if (!token || !/^[0-9a-f]{64}$/.test(token)){
      console.error(`Missing or invalid token: ${token.substring(0, 15)}`);
      return res.sendStatus(400);
    }
    const cardId = req.body.cardId;
    if (!cardId || !/^[0-9a-f]+$/.test(cardId)) {
      console.error(`Missing or invalid cardId: ${cardId}`);
      return res.sendStatus(400);
    }
    if (!req.body.snoozeTime) {
      console.error(`Missing snoozeTime: ${req.body.snoozeTime}`);
      return res.sendStatus(400);
    }
    let snoozeTime;
    try {
      snoozeTime = parseInt(req.body.snoozeTime, 10);
    } catch (parseErr) {
      console.error(`Invalid snoozeTime: ${req.body.snoozeTime}`);
      return res.sendStatus(400);
    }
    // We know we have what we need, and that it _looks_ valid
    // Now we need to check that the token especially really is valid
    // and has the appropriate access to the card in question
    const success = yield updateCardClosed(cardId, token, true);
    if (!success) {
      return res.sendStatus(403);
    }

    // Everything checks out, store the snooze
    db.find({ cardId }, (err, docs) => {
      if (err) {
        console.error(`Error finding snooze in DB. error=${err.message}`);
        return res.sendStatus(500);
      }
      if (!docs || docs.length === 0) {
        db.insert({ cardId, snoozeTime, token }, function (err, added) {
          if (err) {
            console.error(err);
            console.error(`Error inserting snooze into DB. error=${err.message}, ` +
              `cardId=${cardId}, until=${snoozeTime}, token=${token.substring(0, 15)}`);
            return res.sendStatus(500);
          }
          console.log(`🎉 Inserted snooze into DB. cardId=${cardId} until=${snoozeTime}`);
          return res.sendStatus(200);
        });
      } else {
        db.update({ cardId }, { $set: { snoozeTime } }, function (err, added) {
          if (err) {
            console.error(`Error inserting snooze into DB. error=${err.message}`);
            return res.sendStatus(500);
          }
          console.log(`🎉 Updated snooze in DB. cardId=${cardId} until=${snoozeTime}`);
          return res.sendStatus(200);
        });
      }
    });
  }));
  */
  /*
  // Create route handler for removing card snoozes
  app.delete('/snooze/:cardId', Promise.coroutine(function* (req, res) {
    // check that the request contains the fields we expect
    if (!req.query) {
      return res.sendStatus(400);
    }
    if (!req.query.token || !/^[0-9a-f]{64}$/.test(req.query.token)) {
      console.error('Missing or invalid token');
      return res.sendStatus(400);
    }
    if (!req.params.cardId || !/^[0-9a-f]+$/.test(req.params.cardId)) {
      console.error(`Missing or invalid cardId: ${req.params.cardId}`);
      return res.sendStatus(400);
    }
    
    // We know we have what we need, and that it _looks_ valid
    // Now we need to check that the token especially really is valid
    // and has the appropriate access to the card in question
    const success = yield updateCardClosed(req.params.cardId, req.query.token, false);
    if (!success) {
      return res.sendStatus(403);
    }
    
    // Everything checks out, perform the delete operation
    db.remove({ cardId: req.params.cardId }, {}, (err, numRemoved) => {
      if (err) {
        res.sendStatus(500);
        throw err;
      } else {
        res.sendStatus(200);
        console.log(`🗑 Deleted ${numRemoved} snooze(s) in DB. cardId=${req.params.cardId}`);
      }
    });
  }));
  */
  /*
  // Create route handler to verify card is still archived
  app.post('/snooze/:cardId/verify', (req, res) => {
    if (!req.params.cardId || !/^[0-9a-f]+$/.test(req.params.cardId)) {
      console.error(`Missing or invalid cardId: ${req.params.cardId}`);
      return res.sendStatus(400);
    }
    
    const cardId = req.params.cardId;
    
    // We have what we need, let's check on this snooze
    db.find({ cardId: cardId }, Promise.coroutine(function* (err, docs) {
      if (err) {
        console.error(`Error finding snooze in DB. cardId=${cardId} error=${err.message}`);
        return;
      }
      
      if (docs.length === 1) {
        const snooze = docs[0];
        const getReq = {
          uri: `${trelloApi}/cards/${cardId}`,
          qs: {
            fields: 'closed',
            key: process.env.APP_KEY,
            token: snooze.token
          },
          json: true
        }
        let card;
        try {
          card = yield rp(getReq);
        } catch (apiErr) {
          console.error(`Error loading card to verify snooze. cardId=${cardId} error=${apiErr.message}`);
          return;
        }
        
        if (!card.closed) {
          db.remove({ cardId: cardId }, {}, (remErr, numRemoved) => {
            if (remErr) {
              console.error(`Error removing snooze after verify. cardId=${cardId} error=${remErr.message}`);
            } else {
              console.log(`Removed ${numRemoved} invalid snooze after verify. cardId=${cardId}`);
            }
          });
        }
      }
    }));
    res.sendStatus(200);
  });
  */
};

module.exports = routes;