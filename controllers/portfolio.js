const { getPortfolioByUserIdQuery } = require("../queries/index");
var { sql } = require("../stores/database");
var { APIError } = require("../config/error");
const httpStatus = require("http-status");
const { get } = require("../app");

const getPortfolioByUserId = async (users_id) => {
  try {
    const id = users_id.id;
    const portfolios = await getPortfolioByUserIdQuery(id);
    console.log(portfolios);
    return portfolios;
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
  getPortfolioByUserId,
};
