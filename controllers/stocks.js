const { getStockBySymbolQuery } = require("../queries/index");
var { sql } = require("../stores/database");
var { APIError } = require("../config/error");
const httpStatus = require("http-status");
const { get } = require("../app");

const addPortfolioPosition = async (users_id) => {
  try {
    const symbol1 = "TSLA";
    const [stock1] = await getStockBySymbolQuery(symbol1);
    const total_quant1 = 5.0;

    const symbol2 = "AAPL";
    const [stock2] = await getStockBySymbolQuery(symbol2);
    const total_quant2 = 20.0;

    const symbol3 = "AMZN";
    const [stock3] = await getStockBySymbolQuery(symbol3);
    const total_quant3 = 30;

    const createNewPortfolioQuery = async (payload) => {
      return sql`INSERT INTO portfolio ${sql(
        payload,
        "user_id",
        "symbol",
        "total_quantity",
        "equity_value"
      )}RETURNING *`;
    };
    payload1 = {
      user_id: users_id,
      symbol: stock1.symbol,
      total_quantity: total_quant1,
      equity_value: parseInt(stock1.price_per_share) * parseInt(total_quant1),
    };
    console.log(payload1.equity_value);
    const [portfolio1] = await createNewPortfolioQuery(payload1);
    console.log("bitchhhhhhh", portfolio1.equity_value);

    payload2 = {
      user_id: users_id,
      symbol: stock2.symbol,
      total_quantity: total_quant2,
      equity_value: parseInt(stock2.price_per_share) * parseInt(total_quant2),
    };
    const [portfolio2] = await createNewPortfolioQuery(payload2);

    payload3 = {
      user_id: users_id,
      symbol: stock3.symbol,
      total_quantity: total_quant3,
      equity_value: parseInt(stock3.price_per_share) * parseInt(total_quant3),
    };
    const [portfolio3] = await createNewPortfolioQuery(payload3);
    const portfolioValue =
      parseInt(portfolio1.equity_value) +
      parseInt(portfolio2.equity_value) +
      parseInt(portfolio3.equity_value);
    console.log("$", portfolioValue);
    const setPortfolioValueQuery = async () => {
      return sql`UPDATE users SET portfolio_value = ${portfolioValue} WHERE id = ${users_id}`;
    };

    await setPortfolioValueQuery();
    return portfolio1, portfolio2, portfolio3;
  } catch (error) {
    console.error(error);
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

module.exports = {
  addPortfolioPosition,
};
