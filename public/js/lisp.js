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
  if (typeof(current) == 'undefined') {
    throw 'Parse error: expected token, got nothing';
  }
  if (current === '(') {
    var stack = new Array;
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
  },
  "%": function(op1, op2) {
    return op1 % op2;
  }
}

symbolTable = {}
var eval = function(ast) {
  // Types and symbols
   
  console.log('***** Called eval() with ast ' + ast + ' of type ' + typeof(ast));
  if (parseInt(ast) > 0) {
    console.log ('>>>>> Returned ' + parseInt(ast));
    return parseInt(ast);
  }
  switch(typeof(ast)) {
    case 'string':
      if (typeof(symbolTable[ast]) != 'undefined') {
        appendOutput(ast + ' is ' + symbolTable[ast]);
      }
      console.log('>>>>> Returned ' + ast);
      return ast;
  }

  if (typeof(ast) === 'undefined') {
    throw('Unexpected token');
  }
  if (arithmetic.hasOwnProperty(ast[0])) {
    var func = arithmetic[ast.shift()];
  } else if (ast[0] == 'quote') {
  } else if (ast[0] == 'if') {
  } else if (ast[0] == 'set!') {
    ast.shift();
    var func = function(symbol_name, value) {
      if (parseInt(symbol_name) > 0) {
        throw('Error: Symbols must be strings.');
      }
      symbolTable[symbol_name] = value;
      console.log("Set " + symbol_name + " to " + value);
      return true;
    }
  } else if (ast[0] == 'defined') {
  } else if (ast[0] == 'lambda') {
  } else if (ast[0] == 'begin') {
  } 
  
  if (typeof(func) === 'undefined') {
    throw('Invalid function name: ' + ast[0]);
    return empty;
  }

  var left = ast.shift();
  var right = ast;

  console.log('left was ' + left);
  var left_eval = eval(left);
  console.log('eval(left) was ' + left_eval)

  if (Array.isArray(right)) {
    right = ast.shift();
  }
  console.log('right was ' + right);
  var right_eval = eval(right);
  console.log('eval(right) was ' + right_eval)

  var result = func(left_eval, right_eval);
  //console.log(func);
  //console.log(left_eval);
  //console.log(right_eval);
  console.log('Result:' + result);
  return result;
}

var interpret = function(strn){
  p = new Parser(strn); // Turn strn into series of lists
  if (p.ast) {
    console.log('Starting eval()');
    return eval(p.ast);
  }
  console.log('Could not create ast');
}
