function initEditor(token, commentId) {

  var TAB_KEY_CODE = 9;

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

  function insertTextAtCursor(text) {
    var cursorPos = $input.prop('selectionStart');
    var v = $input.val();
    var textBefore = v.substring(0,  cursorPos);
    var textAfter  = v.substring(cursorPos, v.length);
    $input.val(textBefore + text + textAfter);
  }

  $input.on('keydown', function(evt) {
    if(evt.keyCode == TAB_KEY_CODE) {
      insertTextAtCursor('\t');
      // TODO: after checking that tab is persisted in trello's db, put it at start of line instead
      evt.preventDefault();
      return false;
    }
  });

  $input.on("change keyup paste", function() {
    toggleChangedState(true);
  });

  $input.focus();

  return {
    refreshLastSavedTime: refreshLastSavedTime,
  };
}
