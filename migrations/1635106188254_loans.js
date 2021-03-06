/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("loans", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func("uuid_generate_v4()"),
      comment: "The Unique id of a loan",
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: 'users("id")',
      comment: "The Unique id of the user",
    },
    loan_amount: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The amount of a loan",
    },
    amount_repaid: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The amount of a loan that has been repaid",
    },
    amount_left: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The amount of a loan that is left to be paid",
    },
    payment_per_month: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The amount of a loan that will be paid per month",
    },
    duration: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The loan payment duration",
    },
    duration_spent: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The loan payment duration spent",
    },
    duration_left: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The loan payment duration left",
    },
    active: {
      type: "BOOL",
      notNull: true,
      default: false,
      comment: "The loan payment duration left",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      comment: "When the user took the loan",
    },
    updated_at: {
      type: "timestamp",
      default: null,
      comment: "When the user made a payment",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("loans", {
    ifExists: true,
  });
};
