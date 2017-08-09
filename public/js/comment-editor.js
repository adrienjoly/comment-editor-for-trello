/* global TrelloPowerUp */

function initEditor(token, commentId, SimpleMDE) {

  var TAB_KEY_CODE = 9;
  var CLOSE_MESSAGE = '🚧 You should save your comment first! \nAre you sure you want to close that window now?';

  function inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  var $editor = $('.mod-comment-type');
  var $input = $('.js-new-comment-input');
  var $lastSavedTime = $('.date > span');
  var $save = $('.js-save-edit');

  function confirmIfPendingChanges() {
    return !hasChangedState() || confirm(CLOSE_MESSAGE);
  }

  // ways to close the overlay, if opened inside of trello ui
  if (inIframe()) {
    var t = TrelloPowerUp.iframe();
    function closeEditor(confirmed){
      if (confirmed === true || confirmIfPendingChanges()) {
        t.closeOverlay();
      }
    }
    $('.js-close-window').click(closeEditor);
    $('.window-overlay').click(closeEditor);
    $(document).keyup(function(e) {
      if (e.keyCode == 27) { // escape key maps to keycode `27`
        closeEditor()
      }
    });
    $('.js-new-tab').click(function() {
      if (confirmIfPendingChanges()) {
        window.open(window.location.href);
        closeEditor(true);
      }
    });
  } else {
    $('.js-close-window').hide();
    $('.js-new-tab').hide();
  }

  function refreshLastSavedTime(date) {
    $lastSavedTime.text(new Date(date || new Date()).toLocaleTimeString());
  }

  function hasChangedState() {
    return $editor.hasClass('has-changed');
  }

  function hasSavingState() {
    return $editor.hasClass('is-saving');
  }

  function toggleChangedState(hasChanged) {
    $editor.toggleClass('has-changed', hasChanged);
    applyState();
  }

  function toggleSavingState(isSaving) {
    $editor.toggleClass('is-saving', isSaving);
    applyState();
  }

  function toggleFailureState(hasFailed) {
    $editor.toggleClass('has-failed-save', hasFailed);
    applyState();
  }

  function applyState() {
    $save.attr('disabled', hasSavingState() || !hasChangedState() ? '' : null);
  }

  function getValue() {
    //return $input.val();
    return simplemde.value();
  }

  $('.js-save-edit').click(function() {
    //console.log('saving...');
    toggleSavingState(true);
    $.post('/save', { token: token, commentId: commentId, value: getValue() })
    .always(function(res){
      //console.log('=>', arguments);
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

  window.onbeforeunload = function (e) {
    if (!hasChangedState()) return;
    e = e || window.event;
    // For IE and Firefox
    if (e) {
      e.returnValue = CLOSE_MESSAGE;
    }
    // For Safari
    return CLOSE_MESSAGE;
  };

  return {
    refreshLastSavedTime: refreshLastSavedTime,
  };
}
