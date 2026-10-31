function statement(customer, movies) {
  return renderText(statementData(customer, movies));
}

function statementData(customer, movies) {
  const lines = customer.rentals.map((rental) => {
    if (!Object.hasOwn(movies, rental.movieID)) {
      throw new Error(`Unknown movie: ${rental.movieID}`);
    }

    const movie = movies[rental.movieID];
    return {
      title: movie.title,
      amount: amountFor(movie.code, rental.days),
      points: pointsFor(movie.code, rental.days),
    };
  });

  return {
    customerName: customer.name,
    lines,
    totalAmount: lines.reduce((total, line) => total + line.amount, 0),
    frequentRenterPoints: lines.reduce((total, line) => total + line.points, 0),
  };
}

function renderText(data) {
  const header = `Rental Record for ${data.customerName}\n`;
  const body = data.lines
    .map((line) => `\t${line.title}\t${line.amount}\n`)
    .join("");
  const footer =
    `Amount owed is ${data.totalAmount}\n` +
    `You earned ${data.frequentRenterPoints} frequent renter points\n`;

  return header + body + footer;
}

const PRICING = {
  regular: { basePrice: 2, daysIncluded: 2, pricePerExtraDay: 1.5 },
  new: { basePrice: 0, daysIncluded: 0, pricePerExtraDay: 3 },
  childrens: { basePrice: 1.5, daysIncluded: 3, pricePerExtraDay: 1.5 },
};

function amountFor(priceCode, days) {
  if (!Object.hasOwn(PRICING, priceCode)) {
    throw new Error(`Unknown price code: ${priceCode}`);
  }

  const { basePrice, daysIncluded, pricePerExtraDay } = PRICING[priceCode];
  const extraDays = Math.max(0, days - daysIncluded);
  return basePrice + extraDays * pricePerExtraDay;
}

function pointsFor(priceCode, days) {
  // add bonus for a two day new release rental
  return priceCode === "new" && days > 2 ? 2 : 1;
}

const customer = {
  name: "martin",
  rentals: [
    { movieID: "F001", days: 3 },
    { movieID: "F002", days: 1 },
    { movieID: "F003", days: 1 },
    { movieID: "F004", days: 1 },
  ],
};

const movies = {
  F001: { title: "Ran", code: "regular" },
  F002: { title: "Trois Couleurs: Bleu", code: "regular" },
  F003: { title: "Sunes Sommar", code: "childrens" },
  F004: { title: "Yara", code: "new" },
};

if (require.main === module) console.log(statement(customer, movies));

module.exports = { statement };
