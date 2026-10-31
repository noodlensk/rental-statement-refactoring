const test = require("node:test");
const assert = require("node:assert");
const { statement } = require("./statement");

const movies = {
  F001: { title: "Ran", code: "regular" },
  F002: { title: "Trois Couleurs: Bleu", code: "regular" },
  F003: { title: "Sunes Sommar", code: "childrens" },
  F004: { title: "Yara", code: "new" },
};

test("sample customer from the task", () => {
  const customer = {
    name: "martin",
    rentals: [
      { movieID: "F001", days: 3 },
      { movieID: "F002", days: 1 },
      { movieID: "F003", days: 1 },
      { movieID: "F004", days: 1 },
    ],
  };

  assert.strictEqual(
    statement(customer, movies),
    "Rental Record for martin\n" +
      "\tRan\t3.5\n" +
      "\tTrois Couleurs: Bleu\t2\n" +
      "\tSunes Sommar\t1.5\n" +
      "\tYara\t3\n" +
      "Amount owed is 10\n" +
      "You earned 4 frequent renter points\n",
  );
});

test("long rentals: childrens extra days and new release bonus point", () => {
  const customer = {
    name: "anna",
    rentals: [
      { movieID: "F003", days: 4 },
      { movieID: "F004", days: 3 },
    ],
  };

  assert.strictEqual(
    statement(customer, movies),
    "Rental Record for anna\n" +
      "\tSunes Sommar\t3\n" +
      "\tYara\t9\n" +
      "Amount owed is 12\n" +
      "You earned 3 frequent renter points\n",
  );
});

test("boundary days: no extra charge and no bonus point yet", () => {
  const customer = {
    name: "erik",
    rentals: [
      { movieID: "F001", days: 2 },
      { movieID: "F003", days: 3 },
      { movieID: "F004", days: 2 },
    ],
  };

  assert.strictEqual(
    statement(customer, movies),
    "Rental Record for erik\n" +
      "\tRan\t2\n" +
      "\tSunes Sommar\t1.5\n" +
      "\tYara\t6\n" +
      "Amount owed is 9.5\n" +
      "You earned 3 frequent renter points\n",
  );
});

test("unknown price code costs nothing but still earns a point", () => {
  const customer = { name: "lisa", rentals: [{ movieID: "X001", days: 5 }] };
  const moviesWithUnknownCode = {
    X001: { title: "Mystery", code: "documentary" },
  };

  assert.strictEqual(
    statement(customer, moviesWithUnknownCode),
    "Rental Record for lisa\n" +
      "\tMystery\t0\n" +
      "Amount owed is 0\n" +
      "You earned 1 frequent renter points\n",
  );
});

test("customer with no rentals", () => {
  const customer = { name: "olof", rentals: [] };

  assert.strictEqual(
    statement(customer, movies),
    "Rental Record for olof\n" +
      "Amount owed is 0\n" +
      "You earned 0 frequent renter points\n",
  );
});
