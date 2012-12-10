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

var arithmetic = {
  "+": function(op1, op2) {
    return op1 + op2;
  },
  "-": function(op1, op2) {
    return op1 - op2;
  },
  "*": function(op1, op2) {
    return op1 * op2;
  },
  "/": function(op1, op2) {
    return op1 / op2;
  }
}

stack = []
var eval = function(ast) {
  // recursively append things to stack
  // on the way back up, evaluate when we encounter an operator
  // recursively apply operator to top of stack
  //
  // Must know results of child expressions before we can eval parent
  if (ast[0] > 0) {
    return parseInt(ast[0]);
  }
  if (arithmetic.hasOwnProperty(ast[0])) {
    console.log('**** NEW CALL ****');
    var left = ast[1];
    var right = ast[2];
    var func = arithmetic[ast[0]];
    console.log('func was ' + ast[0]);

    console.log('left was ' + left);
    var left_eval = eval(left);
    console.log('eval(left) was ' + left_eval)

    console.log('right was ' + right);
    var right_eval = eval(right);
    console.log('eval(right) was ' + right_eval)

    var result = func(left_eval, right_eval);
    console.log(func);
    console.log(left_eval);
    console.log(right_eval);
    console.log('result was ' + result);
    return result;
  } else if (ast[0] == 'quote') {
  } else if (ast[0] == 'if') {
  } else if (ast[0] == 'set!') {
  } else if (ast[0] == 'defined') {
  } else if (ast[0] == 'lambda') {
  } else if (ast[0] == 'begin') {
  } 
}

var interpret = function(strn){
  p = new Parser(strn); // Turn strn into series of lists
  return eval(p.ast);
}
interpret('(+ 2 (* 5 6))');
