$('#cmd').keyup(function(event) {
  if (event.keyCode == 13) {
    var inp = $('#cmd').val();
    $('#output').append(inp+'\n');
    $('#output').append('>> ' + interpret(inp) + '\n');
  }
});
