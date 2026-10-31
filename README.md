# Rental statement refactoring

Refactoring of the `statement` function from Martin Fowler's video store example.

## Requirements

Node.js 18 or newer. No dependencies to install.

## Run

```sh
npm start   # prints the statement for the sample customer
npm test    # runs the tests
```

## What changed and why

The commit history is the best way to read this: `git log --oneline --reverse`.

1. **Pinned the current behaviour first.** Exact-output tests against the original code, covering every pricing branch, the day boundaries, and an empty rental list.
2. **Refactored with the tests unchanged.** Renames, then two pure functions (`amountFor`, `pointsFor`), then a pricing table instead of a `switch`, then calculation (`statementData`) split from text rendering (`renderText`). `statement(customer, movies)` keeps its signature.
3. **Fixed two bugs, test first.** An unknown price code used to cost 0 silently; an unknown movie crashed with a `TypeError`. Both now throw a clear error.

The pricing table is the main design choice. All three price codes follow the same rule (base price, days included, price per extra day), so the rules read as data rather than as a class per movie type.

## Deliberately not done

- Classes per price code: the codes differ only in numbers. Worth it once a code needs a different formula.
- TypeScript, ESLint config, performance tuning, an HTML renderer: more setup than this code needs. The calculation/rendering split makes a second renderer easy when one is needed.

## Open questions

- **Bonus point rule:** the original comment says "two day new release rental", but the code gives the bonus at 3+ days (`days > 2`). Which is intended? The behaviour is unchanged and the comment is kept until this is answered.
- **Money:** amounts are floats and printed unformatted (`3.5`). Production code should use integer minor units and currency formatting.
- **Rental days are not validated:** zero, negative or fractional days are accepted. One invalid case changed in the refactor: a new release for `-1` days used to cost `-3` and now costs `0`.

## How this was built

Built in collaboration with Claude Code: I used it to bounce ideas and draft each step, argued with its proposals, and reviewed and committed every change myself.
