var history = []
var historyIndex = 0;
var empty = 'empty'; // indicates when we shouldn't print subtree

var appendOutput = function(output) {
  if (output === 'empty') return;
  var out_to = $('#output');
  $(out_to).append(output + '\n');
  $(out_to).scrollTop($(out_to)[0].scrollHeight);
}

$('#cmd').keyup(function(event) {
  var inp_from = $('#cmd');
  var inp = $(inp_from).val();
  if (event.keyCode == 13) {
    appendOutput('>> ' + inp);
    try {
      var out = interpret(inp);
      if (history.length > 10) {
        history.shift;
        history[9] = inp;
      } else {
        history.push(inp);
      }
      historyIndex = history.length; // reset user's search position in history buffer
    } catch (err) {
      appendOutput(err);
      return;
    }
    appendOutput(out);
    $(inp_from).val('');
  } else if (event.keyCode == 38) { // up
    if (historyIndex >= 0) {
        if (historyIndex > 0) {
          historyIndex--;
        }
      if (typeof(history[historyIndex]) != 'undefined') {
        $(inp_from).val(history[historyIndex]);
      }
    }
  } else if (event.keyCode == 40) { // down
    if (historyIndex < history.length) {
        if (historyIndex < history.length-1) {
          historyIndex++;
        }
      if (typeof(history[historyIndex]) != 'undefined') {
        $(inp_from).val(history[historyIndex]);
      }
    }
  }
});
