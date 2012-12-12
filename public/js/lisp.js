/*************
 * Scheme interpreter by Zach Dexter
 * **********/

// Utility functions

var isUndefined = function(x) {
  return typeof(x) === 'undefined';
}
var isDefined = function(x) {
  return !isUndefined(x);
}

var replace = function(char, source, replace_with) {
  // Recursively replace all instances of char in source
  // source can be an n-dimensional array
  var output = [];
  for (var i=0; i<source.length; i++) {
    if (source[i] == char) {
      output[i] = replace_with;
    } else {
      if (!(typeof(source[i]) === 'string') && Array.isArray(source[i])) {
        output[i] = replace(char, source[i], replace_with);
      } else {
        output[i] = source[i];
      }
    }
  }
  return output;
}

// Lexical analysis

var Parser = function(s) {
  this.tokens = this.lex(s);
  this.ast = this.parse(this.tokens);
}

Parser.prototype.lex = function(s) {
  return s.replace(/\(/g,' ( ').replace(/\)/g,' ) ').match(/[^ ]+/g);
}

Parser.prototype.parse = function(tokens) {
  var current = tokens.shift();
  if (isUndefined(current)) {
    throw 'Parse error: expected token, got nothing';
  }
  switch(current) {
    case '(':
      var stack = [];
      while (tokens[0] !== ')') {
        stack.push(this.parse(tokens));
      }
      tokens.shift(); // pop ')'
      return stack;
    case ')':
      appendOutput('Error: Unexpected )');
      break;
    default:
      return current;
  }
}

// Semantic analysis

var arithmetic = {
  "=": function(op1, op2) {
    return op1 === op2;
  },
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
  },
  ">": function(op1, op2) {
    return op1 > op2;
  },
  "<": function(op1, op2) {
    return op1 < op2;
  },
  "<=": function(op1, op2) {
    return op1 <= op2;
  },
  ">=": function(op1, op2) {
    return op1 >= op2;
  }
}

symbolTable = {}; // name: value
procTable = {}; // name: callable
var eval = function(ast) {
  // Types and symbols
   
  console.log('***** Called eval() with ast ' + ast + ' of type ' + typeof(ast));
  switch (typeof(ast)) {
    case 'object':
      break;
    case 'number':
      return ast;
    case 'string':
      if (parseInt(ast) > 0) {
        return parseInt(ast);
      }
      if (isDefined(symbolTable[ast])) {
        ast = symbolTable[ast];
      }
      return ast;
  }

  if (isUndefined(ast)) {
    throw('Unexpected token');
  }
  
  switch (ast[0]) {
    case 'if':
      // (if <test> <consequent> <alternate>)
      ast.shift();
      var test = ast.shift();
      var func = function(consequent, alternate) {
        test = eval(test);
        if (test === true) {
          return eval(consequent);
        } else {
          return eval(alternate);
        }
      }
      break;
    case 'set!':
      ast.shift();
      var symbol_name = ast.shift(); // Symbol is literal string, not eval'd string
      var func = function(value) {
        if (parseInt(symbol_name) > 0) {
          throw('Error: Symbols must be strings.');
        }
        symbolTable[symbol_name] = value;
        return true;
      }
      break;
    case 'defined':
      ast.shift();
      var func = function(symbol_name) {
        if (isDefined(symbolTable[symbol_name])) {
          appendOutput(symbol_name + ' is ' + symbolTable[symbol_name]);
          return true;
        }
        return false;
      }
      return func(ast.shift());
    case 'define': // store procedure
      ast.shift();
      var func = function(name, func_body) {
        procTable[name] = func_body;
        return true;
      }
      break;
    case 'lambda':
      // Save function inside lambda for later execution
      ast.shift();
      var varname = ast.shift();
      var func = function(varname, passed_ast) {
        return function(arg_val) {
          return eval(replace(varname, passed_ast, arg_val));
        }
      }
      return func(varname, ast);
    default:
      if (arithmetic.hasOwnProperty(ast[0])) {
        var func = arithmetic[ast.shift()];
        break;
      }
      if (isDefined(procTable[ast[0]])) {
        var func = procTable[ast[0]]; // recall stored procedure
        ast.shift(); // don't eval function name again
      }
    }

  // Consume arguments
  var left = ast.shift();
  var right = ast.shift();

  console.log('left was ' + left);
  var left_eval = eval(left);
  console.log('eval(left) was ' + left_eval)

  console.log('right was ' + right + ' with type ' + typeof(right));

  if (isDefined(right)) {
    var right_eval = eval(right);
  }

  if (isDefined(func)) {
    if (isDefined(right_eval)) {
      var result = func(left_eval, right_eval);
    } else {
      var result = func(left_eval);
    }
  } else {
    if (isDefined(right_eval)) {
      // Call anonymous function
      try {
        var result = right_eval(left_eval);
      } catch (err) {
        var err = 'Not a valid function'
        appendOutput(err);
        throw(err);
      }
    } else {
      return left_eval;
    }
  }
  console.log('Result: ' + result);
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
