// returns the position of the last line-break before (or at) position
  function findPosOfLine(text, position) {
    return position - text.substr(0, position).split('\n').pop().length;
  }
  /*
  // unit tests
  assert.equal(findPosOfLine('a\nb\nc', 0), 0);
  assert.equal(findPosOfLine('a\nb\nc', 1), 0);
  assert.equal(findPosOfLine('a\nb\nc', 2), 2);
  assert.equal(findPosOfLine('a\nb\nc', 3), 2);
  assert.equal(findPosOfLine('a\nb\nc', 4), 4);
  assert.equal(findPosOfLine('a\nb\nc', 5), 4);
  assert.equal(findPosOfLine('a\nb\nc', 6), 5);
  */

  // returns text with indented lines between start and end positions
  function applyIndents(text, start, end, indent) {
    // 1. select text from 1st line to end
    var firstLinePos = findPosOfLine(text, start);
    var range = '\n' + text.substring(firstLinePos, end);
    // 2. change indentation of lines in that range
    var output;
    if (indent === 1) {
      output = range.replace(/\n/g, '\n\t'); // prepend every line with a tab
    } else if (indent === -1) {
      output = range.replace(/\n\t/g, '\n');
    }
    return text.substr(0, firstLinePos)
      + output.substr(1) // remove the '\n' prefix, added for simpler algorithm
      + text.substr(end);
  }

  $input.on('keydown', function(evt) {
    if (evt.key === 'Tab' || evt.keyCode === TAB_KEY_CODE) { // (i) keyCode is deprecated
      evt.preventDefault && evt.preventDefault();
      // if tab was pressed, we are going to update the level of indentation
      // of the selected lines, and leave the selection range as is.
      var indent = evt.shiftKey ? -1 : 1,
          input = $input.val(),
          start = $input.prop('selectionStart'),
          end = $input.prop('selectionEnd');
      // TODO: use (end - 1) in order to avoid moving next line too easily ?
      var output = applyIndents(input, start, end, indent);
      $input
        .val(output)
        .prop('selectionStart', start + indent)
        .prop('selectionEnd', end + (output.length - input.length));
      return false; // in case evt.preventDefault() was not effective
    }
  });

  $input.on("change keyup paste", function() {
    toggleChangedState(true);
  });
