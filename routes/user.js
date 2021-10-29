var express = require("express");
var router = express.Router();
var httpStatus = require("http-status");

const {
  signUpUser,
  loginUser,
  updateUserById,
  changePasswordUserById,
} = require("../controllers/auth");

/* GET users listing. */
router.post("/signup", async function (req, res, next) {
  try {
    const {
      first_name,
      last_name,
      phonenumber,
      email,
      password,
      bank_name,
      bank_username,
      bank_account_number,
      date_of_birth,
    } = req.body;
    const data = await signUpUser({
      first_name,
      last_name,
      phonenumber,
      email,
      password,
      bank_name,
      bank_username,
      bank_account_number,
      date_of_birth,
    });
    console.log({ data });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    next(error);
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await loginUser({
      email,
      password,
    });
    console.log({ data });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put("/update/:id", async function (req, res, next) {
  try {
    const id = req.params;
    const {
      first_name,
      last_name,
      phonenumber,
      bank_name,
      bank_username,
      bank_account_number,
      date_of_birth,
    } = req.body;
    const data = await updateUserById(id, {
      first_name,
      last_name,
      phonenumber,
      bank_name,
      bank_username,
      bank_account_number,
      date_of_birth,
    });
    console.log({ data });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put("/change-password/:id", async function (req, res, next) {
  try {
    const id = req.params;
    const { old_password, new_password, confirm_new_password } = req.body;
    const data = await changePasswordUserById(id, {
      old_password,
      new_password,
      confirm_new_password,
    });
    console.log({ data });
    res.status(httpStatus.CREATED).json({ data });
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
