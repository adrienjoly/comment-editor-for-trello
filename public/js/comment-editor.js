var $editor = $('.mod-comment-type');
var $input = $('.js-new-comment-input');
var $lastSavedTime = $('.date > span');
var $save = $('.js-save-edit');

function refreshLastSavedTime(date) {
  $lastSavedTime.text(new Date(date || new Date()).toLocaleTimeString());
}

$('.js-save-edit').click(function() {
  var value = $input.val();
  console.log('saving', value, '...');
  $editor.addClass('is-saving');
  $save.attr('disabled', '');
  $.post('/save', { token: '{{token}}', commentId: '{{comment.id}}', value: value })
  .then(function(res){
    console.log('=>', res);
    // TODO: make sure that res.ok
    $editor.removeClass('has-changed');
    refreshLastSavedTime();
  }, function() {
    console.log('=> FAIL:', arguments);
  }).always(function() {
    $editor.removeClass('is-saving');
    $save.attr('disabled', null);
  });

});

$input.on('keyup', function() {
  $editor.addClass('has-changed');
});
