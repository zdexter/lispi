var stripChar = function(charToStrip, s) {
  chars = []
  for (i=0; i < s.length; i++) {
    if (s[i] != charToStrip) {
      chars.push(s[i]);
    }
  }
  return chars;
}

var Parser = function(s) {
  this.tokens = this.lex(s);
  this.ast = this.parse(this.tokens);
}

Parser.prototype.lex = function(s) {
  s = s.replace(/\(/g,' ( ').replace(/\)/g,' ) ').split(" ");
  return stripChar("", s);
}

Parser.prototype.parse = function(tokens) {
  var current = tokens.shift();
  if (current === '(') {
    var stack = [];
    while (tokens[0] !== ')') {
      stack.push(this.parse(tokens));
    }
    tokens.shift(); // pop ')'
    return stack;
  } else if (current === ')') {
    console.log('unexpected )');
  } else {
    return this.atom(current);
  }
}

Parser.prototype.atom = function(token) {
  return token;
}

Parser.prototype.atom = function(token) {
  return token;
}

var GlobalEnv = {
  "+": function() {
    var args = Array.prototype.slice.call(arguments);
    return args.reduce(function (x, y) {
      return x + y;
    });
  }
}

var eval = function(ast) {
  
}

var interpret = function(strn){
  // Turn strn into series of lists
  p = new Parser('(+ 2 (* 5 6))');
  console.log(eval(p.ast));
}
interpret();
