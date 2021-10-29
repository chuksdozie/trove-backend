var express = require("express");
var router = express.Router();
var httpStatus = require("http-status");

const {
  takeALoan,
  getActiveLoanByUserId,
  getLoanHistoryByUserId,
} = require("../controllers/loan");

/* GET users listing. */
router.post("/take-a-loan/:user_id", async function (req, res, next) {
  try {
    const user_id = req.params;
    const { amount, duration } = req.body;
    const data = await takeALoan({
      user_id,
      amount,
      duration,
    });
    console.log({ data });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params;
    const data = await getActiveLoanByUserId(id);
    console.log({ data });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/history/:id", async function (req, res, next) {
  try {
    const id = req.params;
    const data = await getLoanHistoryByUserId(id);
    console.log({ data });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
