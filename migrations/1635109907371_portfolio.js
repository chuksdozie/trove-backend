/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("portfolio", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func("uuid_generate_v4()"),
      comment: "The Unique id of a portfolio",
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: 'users("id")',
      comment: "The Unique id of the user",
    },
    symbol: {
      type: "VARCHAR(250)",
      notNull: true,
      references: 'stocks("symbol")',
      comment: "The stock from stocks",
    },
    total_quantity: {
      type: "INT",
      notNull: true,
      comment: "number of stocks",
    },
    equity_value: {
      type: "INT",
      notNull: true,
      comment: "value of that stock( total quantity x price per share)",
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
    deleted_at: {
      type: "timestamp",
      default: null,
      comment: "When the portfolio was deleted",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("portfolio", {
    ifExists: true,
  });
};
