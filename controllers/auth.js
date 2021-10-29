const {
  signUpUserQuery,
  loginUserQuery,
  getUserEmailQuery,
  getUserPhoneQuery,
  getUserByIdQuery,
  updateUserByIdQuery,
  changePasswordByUserIdQuery,
} = require("../queries/index");
const { sendMail } = require("../config/mailer");
const { addPortfolioPosition } = require("../controllers/stocks");
var { APIError } = require("../config/error");
const httpStatus = require("http-status");
const argon2 = require("argon2");
var jwt = require("jsonwebtoken");
const { now } = require("../utils");

const signUpUser = async (payload) => {
  try {
    const userEmail = await getUserEmailQuery(payload.email);
    const userPhone = await getUserPhoneQuery(payload.phonenumber);
    const reciever = await payload.email;
    const mailSubject = "Welcome to Trove";
    const mailContent = "The content comes here in HTML FORMAT";

    if (userEmail.length) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "This email address is already in use, please login instead.",
        errors: "Email address already exists",
      });
    }

    if (userPhone.length) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "This phone number is already in use, please login instead.",
        errors: "Phone number already exists",
      });
    }

    const hashedpassword = await argon2.hash(payload.password);
    const details = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      phonenumber: payload.phonenumber,
      email: payload.email,
      password: hashedpassword,
      bank_name: payload.bank_name,
      bank_username: payload.bank_username,
      bank_account_number: payload.bank_account_number,
      date_of_birth: payload.date_of_birth,
    };
    const [data] = await signUpUserQuery(details);
    await addPortfolioPosition(data.id);
    console.log("heloooooo", data.id);
    sendMail(reciever, mailSubject, mailContent);
    console.log(data);
    return data;
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const loginUser = async (payload) => {
  try {
    const [userDetails] = await loginUserQuery(payload.email);
    // const reciever = await payload.email;
    // const mailSubject = "Welcome to Trove";
    // const mailContent = "The content comes here in HTML FORMAT";

    if (!userDetails) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "This email address does not eaxist, please sign up instead.",
        errors: "Email does not exists",
      });
    }
    const password = await payload.password;
    const hashedPassword = await userDetails.password;

    console.log(password);
    console.log(hashedPassword);
    if (await argon2.verify(hashedPassword, password)) {
      const token = jwt.sign(
        {
          id: userDetails.id,
          email: userDetails.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );
    } else {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        errors: "Incorrect Credentials",
        message: "Incorrect Credentials, Please check and try again",
      });
    }
    return { userDetails, token };
  } catch (error) {
    console.error(error);
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const updateUserById = async (user, payload) => {
  console.log(user.id, payload);
  try {
    const id = user.id;
    const [userInfo] = await getUserByIdQuery(id);
    console.log(userInfo, "HELLLLLL");
    if (!userInfo) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "User does not exist",
        errors: "User does not exist",
      });
    }

    const pay = {
      first_name: payload.first_name || userInfo.first_name,
      last_name: payload.last_name || userInfo.last_name,
      phonenumber: payload.phonenumber || userInfo.phonenumber,
      email: userInfo.email,
      password: userInfo.password,
      bank_name: payload.bank_name || userInfo.bank_name,
      bank_username: payload.bank_username || userInfo.bank_username,
      bank_account_number:
        payload.bank_account_number || userInfo.bank_account_number,
      date_of_birth: payload.date_of_birth || userInfo.date_of_birth,
      updated_at: now(),
    };

    const [data] = await updateUserByIdQuery(userInfo.id, pay);
    const { password, ...rest } = data;
    return { ...rest };
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

const changePasswordUserById = async (user, payload) => {
  try {
    const id = user.id;
    const [userInfo] = await getUserByIdQuery(id);
    if (!userInfo) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "User does not exist",
        errors: "User does not exist",
      });
    }

    const hashedPassword = userInfo.password;
    if (!(await argon2.verify(hashedPassword, payload.old_password))) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Incorrect Password, think and try again",
        errors: "Incorrect Password, think and try again",
      });
    }

    if (payload.new_password.length < 6) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Please use a strong password atleast 6 characters long",
        errors: "Please use a strong password atleast 6 characters long",
      });
    }

    if (payload.new_password !== payload.confirm_new_password) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        message: "Confirm Password must be the same with new password",
        errors: "Confirm Password must be the same with new password",
      });
    }

    const verifiedPassword = await argon2.hash(payload.new_password);

    const pay = {
      password: verifiedPassword || userInfo.password,
      updated_at: now(),
    };

    const [data] = await changePasswordByUserIdQuery(userInfo.id, pay);
    const { password, ...rest } = data;

    return { ...rest };
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

module.exports = {
  signUpUser,
  loginUser,
  updateUserById,
  changePasswordUserById,
};
