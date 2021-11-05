var express = require("express");
var router = express.Router();
var httpStatus = require("http-status");
const { isLoggedIn } = require("../middlewares/index");
const { getPortfolioByUserId } = require("../controllers/portfolio");

router.get("/portfolios/:id", isLoggedIn, async function (req, res, next) {
  try {
    const id = req.params;
    const data = await getPortfolioByUserId(id);
    console.log({ data });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
