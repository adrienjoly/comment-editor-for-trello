$('.js-save-edit').click(function() {
  var value = $('.js-new-comment-input').val();
  console.log('saving', value, '...');
  $.post('/save', { token: '{{token}}', commentId: '{{comment.id}}', value: value }, function(res){
    console.log('=>', res);
  }).fail(function() {
    console.log('=> FAIL:', arguments);
  });
});
