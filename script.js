const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');

let expression = '';

function updateDisplay() {
  display.value = expression || '0';
}

function clearAll() {
  expression = '';
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function appendValue(value) {
  // Prevent two operators in a row (except a leading minus for negative numbers)
  const lastChar = expression.slice(-1);
  const isOperator = ch => ['+', '-', '*', '/'].includes(ch);

  if (isOperator(value) && isOperator(lastChar)) {
    expression = expression.slice(0, -1) + value; // replace, don't stack operators
  } else {
    expression += value;
  }
  updateDisplay();
}

/*
 * Safe expression evaluator.
 * We avoid raw `eval()` on user input and instead implement a small
 * recursive-descent parser that respects operator precedence
 * (multiplication/division before addition/subtraction) and parentheses.
 *
 * Grammar:
 *   expression -> term (('+' | '-') term)*
 *   term       -> factor (('*' | '/') factor)*
 *   factor     -> number | '(' expression ')' | '-' factor
 */
function evaluateExpression(expr) {
  let pos = 0;

  function peek() {
    return expr[pos];
  }

  function consumeNumber() {
    let start = pos;
    while (pos < expr.length && /[0-9.]/.test(expr[pos])) pos++;
    if (start === pos) throw new Error('Expected a number');
    return parseFloat(expr.slice(start, pos));
  }

  function parseFactor() {
    if (peek() === '(') {
      pos++; // consume '('
      const value = parseExpression();
      if (peek() !== ')') throw new Error('Missing closing parenthesis');
      pos++; // consume ')'
      return value;
    }
    if (peek() === '-') {
      pos++;
      return -parseFactor();
    }
    return consumeNumber();
  }

  function parseTerm() {
    let value = parseFactor();
    while (peek() === '*' || peek() === '/') {
      const operator = expr[pos];
      pos++;
      const rhs = parseFactor();
      if (operator === '*') value *= rhs;
      else {
        if (rhs === 0) throw new Error('Division by zero');
        value /= rhs;
      }
    }
    return value;
  }

  function parseExpression() {
    let value = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const operator = expr[pos];
      pos++;
      const rhs = parseTerm();
      value = operator === '+' ? value + rhs : value - rhs;
    }
    return value;
  }

  const result = parseExpression();
  if (pos !== expr.length) throw new Error('Unexpected character in expression');
  return result;
}

function calculate() {
  try {
    const result = evaluateExpression(expression.replace(/\s+/g, ''));
    expression = String(Math.round(result * 1e10) / 1e10); // trim floating point noise
    updateDisplay();
  } catch (err) {
    display.value = 'Error';
    expression = '';
  }
}

// Button clicks
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    if (value === 'C') clearAll();
    else if (value === 'backspace') backspace();
    else if (value === '=') calculate();
    else appendValue(value);
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (/[0-9.+\-*/()]/.test(e.key)) {
    appendValue(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
  } else if (e.key === 'Backspace') {
    backspace();
  } else if (e.key === 'Escape') {
    clearAll();
  }
});

updateDisplay();