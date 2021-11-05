/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("loanhistory", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func("uuid_generate_v4()"),
      comment: "The Unique id of a loan history",
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: 'users("id")',
      comment: "The Unique id of the user",
    },
    loan_id: {
      type: "uuid",
      notNull: true,
      references: 'loans("id")',
      comment: "The Unique id of the loan",
    },
    payment_amount: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The amount just paid",
    },
    amount_repaid: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The amount repaid in total",
    },
    amount_left: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The amount left in total",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      comment: "When a history was created",
    },
    updated_at: {
      type: "timestamp",
      default: null,
      comment: "When the user made a payment",
    },
    deleted_at: {
      type: "timestamp",
      default: null,
      comment: "When the history was deleted",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("loanhistory", {
    ifExists: true,
  });
};
