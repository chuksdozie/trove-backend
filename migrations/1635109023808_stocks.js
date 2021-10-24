/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("stocks", {
    name: {
      type: "VARCHAR(250)",
      notNull: true,
      comment: "The name of a stock",
    },
    symbol: {
      type: "VARCHAR(250)",
      notNull: true,
      primaryKey: true,
      unique: true,
      comment: "The Unique symbol of a stock",
    },
    price_per_share: {
      type: "INT",
      notNull: true,
      comment: "The amount of a loan",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
      comment: "When the stock was added to the app",
    },
    updated_at: {
      type: "timestamp",
      default: null,
      comment: "When the stock was updated",
    },
    deleted_at: {
      type: "timestamp",
      default: null,
      comment: "When the stock was deleted",
    },
  });
};
// uuid_generate_v5
exports.down = (pgm) => {
  pgm.dropTable("stocks", {
    ifExists: true,
  });
};
