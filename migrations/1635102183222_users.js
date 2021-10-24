/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func("uuid_generate_v4()"),
      comment: "The Unique id of a user",
    },
    first_name: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The first name of a user",
    },
    last_name: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The last name of a user",
    },
    phonenumber: {
      type: "VARCHAR(250)",
      notNull: true,
      unique: true,
      comment: "The phone number of a user",
    },
    email: {
      type: "VARCHAR(250)",
      notNull: true,
      unique: true,
      comment: "The email of a user",
    },
    password: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The password of a user",
    },
    bank_name: {
      type: "VARCHAR(250)",
      comment: "The bank name of a user",
    },
    bank_account_number: {
      type: "VARCHAR(250)",
      comment: "The bank account number of a user",
    },
    bank_username: {
      type: "VARCHAR(250)",
      comment: "The bank username of a user",
    },
    portfolio_value: {
      type: "INT",
      comment: "The porfolio value of a user",
    },
    date_of_birth: {
      type: "DATE",
      notNull: true,
      comment: "The date of birth of a user",
    },
    verified: {
      type: "BOOL",
      notNull: true,
      default: false,
      comment: "whether user is verified or not",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      comment: "When the user created the account",
    },
    updated_at: {
      type: "timestamp",
      default: null,
      comment: "When the user updated an info on the account",
    },
    logged_at: {
      type: "timestamp",
      default: null,
      comment: "When the user logged in latest",
    },
    deleted_at: {
      type: "timestamp",
      default: null,
      comment: "When the user deleted their account",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users", {
    ifExists: true,
  });
};
