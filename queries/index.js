var { sql } = require("../stores/database");

const runner = async () => {
  console.log(await sql`SELECT * FROM users`);
};

/**
 * HERE ARE THE USER QUERIES
 */

const signUpUserQuery = async (payload) => {
  return sql`INSERT INTO users ${sql(
    payload,
    "first_name",
    "last_name",
    "phonenumber",
    "email",
    "password",
    "bank_name",
    "bank_username",
    "bank_account_number",
    "date_of_birth"
  )}RETURNING *`;
};

const getUserByIdQuery = async (id) => {
  return await sql`SELECT * FROM users
  WHERE id = ${id}`;
};

const getUserEmailQuery = async (email) => {
  return await sql`SELECT * FROM users
  WHERE email = ${email}`;
};

const getUserPhoneQuery = async (phone) => {
  return await sql`SELECT * FROM users
  WHERE phonenumber = ${phone}`;
};

const loginUserQuery = async (email) => {
  return sql`SELECT * FROM users
    WHERE
    email = ${email}`;
};

const updateUserByIdQuery = async (id, pay) => {
  return await sql`UPDATE users SET ${sql(
    pay,
    "first_name",
    "last_name",
    "phonenumber",
    "email",
    "password",
    "bank_name",
    "bank_username",
    "bank_account_number",
    "date_of_birth",
    "updated_at"
  )}
  WHERE id = ${id}
  RETURNING *`;
};

const changePasswordByUserIdQuery = async (id, pay) => {
  return await sql`UPDATE users SET ${sql(pay, "password", "updated_at")}
  WHERE id = ${id}
  RETURNING *`;
};

/**
 * PORTFOLIO QUERIES
 */
const getPortfolioByUserIdQuery = async (id) => {
  return await sql`SELECT * FROM portfolio
  WHERE user_id = ${id}`;
};

/**
 * HERE ARE THE STOCK QUERIES
 */

const createStockQuery = async (payload) => {
  return sql`INSERT INTO stocks ${sql(
    payload,
    "name",
    "symbol",
    "price_per_share"
  )}RETURNING *`;
};

const deleteStockQuery = async () => {
  return sql`DELETE FROM stocks`;
};

const getStockBySymbolQuery = async (symbol) => {
  return await sql`SELECT * FROM stocks
  WHERE symbol = ${symbol}`;
};

const deletePortfolioQuery = async () => {
  return sql`DELETE FROM stocks`;
};

/**
 * PORTFOLIO QUERIES
 */

const getPorfolioByIdQuery = async (id) => {
  return await sql`SELECT * FROM portfolio
  WHERE id = ${id}`;
};

const getPorfolioValueByUserIdQuery = async (id) => {
  return await sql`SELECT portfolio_value FROM users
  WHERE id = ${id}`;
};

/**
 * LOAN QUERIES
 */

const getLoanByUserIdQuery = async (id) => {
  return await sql`SELECT * FROM loans
  WHERE user_id = ${id}`;
};

const activateLoanQuery = async (payload) => {
  return await sql`INSERT INTO loans  ${sql(
    payload,
    "active",
    "loan_amount",
    "amount_repaid",
    "amount_left",
    "payment_per_month",
    "duration",
    "duration_spent",
    "duration_left",
    "user_id",
    "updated_at"
  )}
  RETURNING *`;
};

const updateLoanQuery = async (id, pay) => {
  return await sql`UPDATE loans SET ${sql(
    pay,
    "amount_repaid",
    "amount_left",
    "duration_spent",
    "duration_left",
    "active",
    "updated_at"
  )}
  WHERE 
  id = ${id}
  RETURNING *`;
};

const getActiveLoanByUserIdQuery = async (id) => {
  return await sql`SELECT * FROM loans
  WHERE user_id = ${id}
  AND
  active = ${true}`;
};

/**
 * LOAN HISTORY QUERIES
 */
const addNewLoanHistoryQuery = async (payload) => {
  return await sql`INSERT INTO loanhistory  ${sql(
    payload,
    "user_id",
    "loan_id",
    "payment_amount",
    "amount_repaid",
    "amount_left"
  )}
  RETURNING *`;
};

const getLoanHistoryByUserIdQuery = async (id) => {
  return await sql`SELECT * FROM loanhistory
  WHERE user_id = ${id}`;
};

module.exports = {
  runner,
  getUserEmailQuery,
  getUserByIdQuery,
  getUserPhoneQuery,
  signUpUserQuery,
  loginUserQuery,
  updateUserByIdQuery,
  changePasswordByUserIdQuery,
  getPortfolioByUserIdQuery,
  createStockQuery,
  deleteStockQuery,
  getStockBySymbolQuery,
  deletePortfolioQuery,
  getPorfolioByIdQuery,
  getPorfolioValueByUserIdQuery,
  getLoanByUserIdQuery,
  activateLoanQuery,
  updateLoanQuery,
  getActiveLoanByUserIdQuery,
  addNewLoanHistoryQuery,
  getLoanHistoryByUserIdQuery,
};
