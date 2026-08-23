# Calculator App
**Live demo:** https://anixsanmi-max.github.io/web-taskboard-projects/calculator-app/

A calculator built with vanilla HTML, CSS, and JavaScript — no libraries.

## Features

- Standard operations: `+`, `-`, `*`, `/`, parentheses
- Correct operator precedence (multiplication/division before addition/subtraction) via a hand-written recursive-descent expression parser — **no `eval()`** on user input
- Full keyboard support (digits, operators, Enter to calculate, Escape to clear, Backspace to delete)
- Responsive layout down to small mobile widths

## Why not `eval()`?

`eval()` would technically work for a calculator, but it executes arbitrary JavaScript from a string. Writing a small parser instead (see `evaluateExpression` in `script.js`) is safer and is a genuinely useful exercise in how calculators/interpreters actually work under the hood — it follows this grammar:

expression -> term (('+' | '-') term)*
term       -> factor (('*' | '/') factor)*
factor     -> number | '(' expression ')' | '-' factor

## Run it

Just open `index.html` in a browser — no build step needed.
