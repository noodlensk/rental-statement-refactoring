function statement(customer, movies) {
  let totalAmount = 0;
  let frequentRenterPoints = 0;
  let result = `Rental Record for ${customer.name}\n`;
  for (const rental of customer.rentals) {
    const movie = movies[rental.movieID];
    const amount = amountFor(movie.code, rental.days);
    frequentRenterPoints += pointsFor(movie.code, rental.days);

    result += `\t${movie.title}\t${amount}\n`;
    totalAmount += amount;
  }
  result += `Amount owed is ${totalAmount}\n`;
  result += `You earned ${frequentRenterPoints} frequent renter points\n`;

  return result;
}

const PRICING = {
  regular: { basePrice: 2, daysIncluded: 2, pricePerExtraDay: 1.5 },
  new: { basePrice: 0, daysIncluded: 0, pricePerExtraDay: 3 },
  childrens: { basePrice: 1.5, daysIncluded: 3, pricePerExtraDay: 1.5 },
};

function amountFor(priceCode, days) {
  if (!Object.hasOwn(PRICING, priceCode)) return 0;

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
