/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

t.render(function(){
  t.sizeTo('#comments'); // resize popup based on content
});

const key = '0b15414357140fe88faecea94f0a22b1';
const trelloApi = 'https://api.trello.com/1';
const container = document.getElementById('comments');

const myMemberId = t.getContext().member;

function myOwnComment(comment) {
  return comment.memberCreator.id === myMemberId;
}

// get user's token
t.get('member', 'private', 'token')
.then(function(token) {
  
  // load comments
  t.card('id').then(function(card) {
    // https://developers.trello.com/advanced-reference/card#get-1-cards-card-id-or-shortlink-actions
    $.get(`${trelloApi}/cards/${card.id}/actions`, { key, filter: 'commentCard', token })
    .always(function(){
      $('.js-spinner').hide();
    })
    .fail(function(err){
      const p = document.createElement('p');
      p.appendChild(document.createTextNode('🚧 Expired auth token. Please try again.'));
      container.appendChild(p);
      localStorage.setItem('token', token);
      t.remove('member', 'private', 'token'); // will cause auth popup to display on next click
    })
    .done(function(res){
      const comments = res.filter(myOwnComment);
      if (!comments.length) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode('Please add a comment to your card first. Then, you will be able to edit it by clicking this button again.'));
        container.appendChild(p);
        return;
      }
      comments.forEach(function(comment) {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(comment.data.text));
        li.addEventListener('click', function(){
          // open comment outliner (editor) in new tab
          const url = `comment-editor.html?${card.id}/${comment.id}/${token}/${comment.date}`;
          //window.open(url);
          t.overlay({
            url: url,
            args: {}
          });
          t.closePopup();
        });
        container.appendChild(li);
      });
    });
  })
  .catch(function(err){
    alert('Oops, there was an error while loading comments. Can you refresh and try again?');
    console.error('Error loading card comments:', err);
  });
});
