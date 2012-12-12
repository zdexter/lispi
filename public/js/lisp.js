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
  "=": function(op1, op2) {
    return op1 == op2;
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
  console.log(ast);
  if (typeof(ast) != 'object') {
    if (parseInt(ast) > 0) {
      console.log ('>>>>> Returned ' + parseInt(ast));
      return parseInt(ast);
    }
    switch(typeof(ast)) {
      case 'string':
        if (typeof(symbolTable[ast]) != 'undefined') {
          ast = symbolTable[ast];
        }
        console.log('>>>>> Returned ' + ast);
        return ast;
    }
  }
  if (typeof(ast) === 'undefined') {
    throw('Unexpected token');
  }
  if (arithmetic.hasOwnProperty(ast[0])) {
    var func = arithmetic[ast.shift()];
  } else if (ast[0] == 'quote') {
  } else if (ast[0] == 'if') {
    // (if <test> <consequent> <alternate>)
    ast.shift();
    var test = ast.shift();
    var consequent = ast.shift();
    var alternate = ast.shift();
    var func = function(test, consequent, alternate) {
      test = eval(test);
      if (test == true) {
        return eval(consequent);
      } else {
        return eval(alternate);
      }
    }
    return func(test, consequent, alternate);
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
    ast.shift();
    var func = function(symbol_name) {
      if (typeof(symbolTable[symbol_name]) != 'undefined') {
        appendOutput(symbol_name + ' is ' + symbolTable[symbol_name]);
        return true;
      }
      return false;
    }
    return func(ast.shift());
  } else if (ast[0] == 'define') { // define procedure
    ast.shift();
    var func = function(name, func_body) {
      procTable[name] = func_body;
      return true;
    }
  } else if (ast[0] == 'lambda') {
    // Save function inside lambda for later execution
    ast.shift();
    var varname = ast.shift();
    var func = function(varname, passed_ast) {
      for (var i=0; i<passed_ast.length; i++) {
        if (passed_ast[i] === varname) {
          passed_ast[i] = passed_ast;
        }
      }

      var stored_ast = ast[0]; // Closed over; stores AST with var to replace
      return function(arg_val) {
        // Called at execution time; arg_val is actual param to anon func
        var stored_ast_copy = [];
        for (var i=0; i<stored_ast.length; i++) {
          if (stored_ast[i] === varname) {
            stored_ast_copy[i] = arg_val;
          } else {
            stored_ast_copy[i] = stored_ast[i];
          }
        }
        return eval(stored_ast_copy);
      }
    }
    return func(varname, ast);
  } else if (ast[0] == 'begin') {
  } else {
    if (typeof(procTable[ast[0]]) != 'undefined') {
      var func = procTable[ast[0]]; // recall stored procedure
      ast.shift(); // don't eval function name again
     }
  }
  
  var left = ast.shift();
  var right = ast;

  console.log('left was ' + left);
  var left_eval = eval(left);
  console.log('eval(left) was ' + left_eval)

  if (Array.isArray(right)) {
    right = ast.shift();
  }
  console.log('right was ' + right + ' with type ' + typeof(right));
  
  if (typeof(right) != 'undefined') {
    var right_eval = eval(right);
    console.log('eval(right) was ' + right_eval)
    if (typeof(func) != 'undefined') {
      var result = func(left_eval, right_eval);
    } else { // pass actual param to anonymous function
      try {
        var result = right_eval(left_eval);
      } catch (err) {
        var err = 'Not a valid function'
        appendOutput(err);
        throw(err);
      }
    }
  } else {
    if (typeof(func) != 'undefined') {
      var result = func(left_eval);
    } else {
      return left_eval;
    }
  }
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
