/* global TrelloPowerUp */

TrelloPowerUp.initialize({
  'card-buttons': function(t, opts) {
    // check that viewing member has write permissions on this board
    if (opts.context.permissions.board !== 'write') {
      return [];
    }
    return t.get('member', 'private', 'token')
    .then(function(token){
      return [{
        icon: 'https://github.com/adrienjoly/comment-editor-for-trello/raw/master/icon-transparent.png',
        text: 'Edit Comment',
        callback: function(context) {
          if (!token) {
            context.popup({
              title: 'Authorize Your Account',
              url: './auth.html',
              height: 75
            });
          } else {
            context.closePopup();
            return context.popup({
              title: 'Select a comment to edit',
              url: './comment-selector.html',
              height: 75
            });
          }
        }
      }];
    });
  },
});
