var history = []
var historyIndex = 0;

$('#cmd').keyup(function(event) {
  var inp_from = $('#cmd');
  var inp = $(inp_from).val();
  var out_to = $('#output');
  if (event.keyCode == 13) {
    $(out_to).append(inp+'\n');
    
    $(out_to).scrollTop($(out_to)[0].scrollHeight);

    try {
      var out = interpret(inp);
      if (history.length > 10) {
        history.shift;
        history[9] = inp;
      } else {
        history.push(inp);
      }
      historyIndex = history.length-1; // reset user's search position in history buffer
    } catch (err) {
      $(out_to).append(">> "+err+"\n");
    }
    if (out) {
      $(out_to).append('>> ' + interpret(inp) + '\n');
      $(inp_from).val('');
    }
  } else if (event.keyCode == 38) { // up
    console.log('up ' + historyIndex);
    console.log(history);
    if (historyIndex >= 0) {
      if (typeof(history[historyIndex]) != 'undefined') {
        $(inp_from).val(history[historyIndex]);
        if (historyIndex > 0) {
          historyIndex--;
        }
      }
    }
  } else if (event.keyCode == 40) { // down
    console.log('down ' + historyIndex);
    console.log(history);
    if (historyIndex <= history.length) {
      if (historyIndex == 0) {
        historyIndex++;
      }
      if (typeof(history[historyIndex]) != 'undefined') {
        $(inp_from).val(history[historyIndex]);
        if (historyIndex < history.length-1) {
          historyIndex++;
        }
      }
    }
  }
});
