function statement(customer, movies) {
  let totalAmount = 0;
  let frequentRenterPoints = 0;
  let result = `Rental Record for ${customer.name}\n`;
  for (const rental of customer.rentals) {
    const movie = movies[rental.movieID];
    let amount = 0;

    switch (movie.code) {
      case "regular":
        amount = 2;
        if (rental.days > 2) {
          amount += (rental.days - 2) * 1.5;
        }
        break;
      case "new":
        amount = rental.days * 3;
        break;
      case "childrens":
        amount = 1.5;
        if (rental.days > 3) {
          amount += (rental.days - 3) * 1.5;
        }
        break;
    }

    frequentRenterPoints++;
    // add bonus for a two day new release rental
    if (movie.code === "new" && rental.days > 2) frequentRenterPoints++;

    result += `\t${movie.title}\t${amount}\n`;
    totalAmount += amount;
  }
  result += `Amount owed is ${totalAmount}\n`;
  result += `You earned ${frequentRenterPoints} frequent renter points\n`;

  return result;
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
