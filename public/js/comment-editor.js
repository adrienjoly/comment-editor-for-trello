function initEditor(token, commentId) {

  var $editor = $('.mod-comment-type');
  var $input = $('.js-new-comment-input');
  var $lastSavedTime = $('.date > span');
  var $save = $('.js-save-edit');

  function refreshLastSavedTime(date) {
    $lastSavedTime.text(new Date(date || new Date()).toLocaleTimeString());
  }

  function toggleChangedState(hasChanged) {
    $editor.toggleClass('has-changed', hasChanged);
  }

  function toggleSavingState(isSaving) {
    $editor.toggleClass('is-saving', isSaving);
    $save.attr('disabled', isSaving ? '' : null);
  }

  function toggleFailureState(hasFailed) {
    $editor.toggleClass('has-failed-save', hasFailed);
  }

  $('.js-save-edit').click(function() {
    console.log('saving...');
    toggleSavingState(true);
    $.post('/save', { token: token, commentId: commentId, value: $input.val() })
    .always(function(res){
      console.log('=>', arguments);
      toggleSavingState(false);
      toggleChangedState(!res.ok);
      toggleFailureState(!res.ok);
      if (res.ok) {
        refreshLastSavedTime();
      }
    });

  });

  $input.on('keyup', function() {
    toggleChangedState(true);
  });

  return {
    refreshLastSavedTime: refreshLastSavedTime,
  };
}
