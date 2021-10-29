const {
  getPorfolioValueByUserIdQuery,
  getLoanByUserIdQuery,
  activateLoanQuery,
  getActiveLoanByUserIdQuery,
  getUserByIdQuery,
  addNewLoanHistoryQuery,
  updateLoanQuery,
  getLoanHistoryByUserIdQuery,
} = require("../queries/index");
const { sendMail } = require("../config/mailer");
var { APIError } = require("../config/error");
const httpStatus = require("http-status");
const { now } = require("../utils/index");

const takeALoan = async (payload) => {
  console.log(await getActiveLoanByUserIdQuery());
  try {
    const { user_id } = await payload.user_id;
    const [user] = await getUserByIdQuery(user_id);
    if (!user.bank_account_number) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: `Please fill in your bank details in your profile`,
        errors: `Please fill in your bank details in your profile`,
      });
    }

    if (!user.bank_name) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: `Please fill in your bank details in your profile`,
        errors: `Please fill in your bank details in your profile`,
      });
    }

    if (!user.bank_username) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: `Please fill in your bank details in your profile`,
        errors: `Please fill in your bank details in your profile`,
      });
    }

    if (!payload.amount || !payload.duration) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: `Please enter the amount and duration you want`,
        errors: "Please enter the amount and duration you want",
      });
    }
    // payload.user_id   payload.amount   payload.duration
    const [available] = await getPorfolioValueByUserIdQuery(user_id);
    if (!available) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: `User does not exist`,
        errors: "User does not exist",
      });
    }
    const availableCash = available.portfolio_value;
    console.log(availableCash, "money");

    // check if user already has an active loan
    const loanExists = await getLoanByUserIdQuery(user_id);
    console.log(loanExists, "loaner");
    if (loanExists) {
      for (let i = 0; i < loanExists.length; i++) {
        if (loanExists[i].active === true) {
          throw new APIError({
            status: httpStatus.BAD_REQUEST,
            message: `Sorry, you have to clear up all pending loans to get a new loan`,
            errors:
              "Sorry, you have to clear up all pending loans to get a new loan",
          });
        }
      }
    }

    //get the amount the user wants
    const loanRequest = parseInt(payload.amount);
    const loanLimit = parseInt(availableCash) * 0.6;

    if (loanLimit < loanRequest) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: `Sorry, we can't loan you more than 60% (${loanLimit}) of your available fund`,
        errors: "Loan limit exceeded",
      });
    }

    //get loan duration
    const duration = parseInt(payload.duration);
    if (duration > 12) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: `Sorry, the maximum duration is 12 months`,
        errors: "Duration limit exceeded",
      });
    }

    const loan_amount = loanRequest;
    //   set the loan to active
    const active = true;
    const amount_repaid = 0;
    const duration_spent = 0;
    const amount_left = loan_amount - amount_repaid;
    const payment_per_month = loan_amount / duration;
    const duration_left = duration - duration_spent;

    pay = {
      user_id: user_id,
      active: active,
      loan_amount: loan_amount,
      amount_repaid: amount_repaid,
      amount_left: amount_left,
      payment_per_month: payment_per_month,
      duration: duration,
      duration_left: duration_left,
      duration_spent: duration_spent,
      updated_at: now(),
    };
    // activate loan
    const [data] = await activateLoanQuery(pay);
    takeMonthlyPayment(user_id);
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const takeMonthlyPayment = async (user_id) => {
  try {
    const [loanDetails] = await getActiveLoanByUserIdQuery(user_id);
    console.log(loanDetails, "juse");
    let amount_left = parseInt(await loanDetails.amount_left);
    let loan_id = loanDetails.id;

    let loan_amount = parseInt(loanDetails.loan_amount);
    //   set the loan to active
    let active = true;
    let amount_repaid = parseInt(loanDetails.amount_repaid);
    let duration_spent = parseInt(loanDetails.duration_spent);
    let duration = parseInt(loanDetails.duration);
    let payment_per_month = parseInt(loanDetails.payment_per_month);
    let duration_left = parseInt(loanDetails.duration_left);

    const run = async () => {
      console.log(`
      ${loanDetails.payment_per_month} was debited from ${loanDetails.user_id},
       debt will be completed in ${parseInt(duration_left)}
      `);
      if (amount_left > 0) {
        amount_left = amount_left - payment_per_month;
        amount_repaid = amount_repaid + payment_per_month;
        duration_left = duration_left - 1;
        duration_spent = duration_spent + 1;

        console.log(loan_amount);
        console.log(amount_left);
        console.log(amount_repaid);
        console.log(duration);
        console.log(duration_left);
        console.log(duration_spent);

        const pay = {
          user_id: user_id,
          loan_id: loan_id,
          payment_amount: loan_amount,
          amount_repaid: amount_repaid,
          amount_left: amount_left,
        };

        payLoan = {
          active: active,
          amount_repaid: amount_repaid,
          amount_left: amount_left,
          duration_left: duration_left,
          duration_spent: duration_spent,
          updated_at: now(),
        };

        let updatedLoan = await updateLoanQuery(loan_id, payLoan);
        console.log(updatedLoan);

        let history = await addNewLoanHistoryQuery(pay);
        console.log(history);
      } else {
        active = false;
        payLoan = {
          active: active,
          amount_repaid: amount_repaid,
          amount_left: amount_left,
          duration_left: duration_left,
          duration_spent: duration_spent,
          updated_at: now(),
        };
        console.log("debt cleared");
        let updatedLoan = await updateLoanQuery(loan_id, payLoan);
        console.log(updatedLoan);
        clearInterval(monthly);
      }
    };

    var monthly = setInterval(run, 3000);
    const final = await getLoanByUserIdQuery(user_id);
    return final;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const getActiveLoanByUserId = async (users_id) => {
  try {
    const id = users_id.id;
    const activeLoan = await getActiveLoanByUserIdQuery(id);
    console.log(activeLoan);
    return activeLoan;
  } catch (error) {
    console.error(error);
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const getLoanHistoryByUserId = async (users_id) => {
  try {
    const id = users_id.id;
    const loanHistory = await getLoanHistoryByUserIdQuery(id);
    console.log(loanHistory);
    return loanHistory;
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
  takeALoan,
  takeMonthlyPayment,
  getActiveLoanByUserId,
  getLoanHistoryByUserId,
};
