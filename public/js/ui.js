$('#cmd').keyup(function(event) {
  if (event.keyCode == 13) {
    var inp_from = $('#cmd');
    var inp = $(inp_from).val();
    var out_to = $('#output');
    $(out_to).append(inp+'\n');
    try {
      var out = interpret(inp);
    } catch (err) {
      $(out_to).append(">> "+err+"\n");
    }
    if (out) {
      $(out_to).append('>> ' + interpret(inp) + '\n');
      $(inp_from).val('');
    }
  }
});
