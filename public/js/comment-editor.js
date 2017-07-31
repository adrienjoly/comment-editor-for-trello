function initEditor(token, commentId, SimpleMDE) {

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

  function getValue() {
    //return $input.val();
    return simplemde.value();
  }

  $('.js-save-edit').click(function() {
    console.log('saving...');
    toggleSavingState(true);
    $.post('/save', { token: token, commentId: commentId, value: getValue() })
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

  var simplemde = new SimpleMDE({
    element: $input[0],
    autoDownloadFontAwesome: true,
    autofocus: true,
    autosave: false,
    forceSync: true,
    initialValue: $input.val(),
    placeholder: $input.attr('placeholder'),
    codeSyntaxHighlighting: false, // TODO: read https://github.com/sparksuite/simplemde-markdown-editor
    status: false,
  });

  simplemde.codemirror.on('change', function(){
    toggleChangedState(true);
  });

  return {
    refreshLastSavedTime: refreshLastSavedTime,
  };
}
