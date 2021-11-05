/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(
    `INSERT INTO stocks(name, symbol, price_per_share) VALUES('Apple', 'AAPL' , '125.0'), ('Tesla','TSLA','600.0'), ('Amazon', 'AMZN', '150.0')`
  );
};

exports.down = (pgm) => {
  pgm.sql(`DELETE FROM stocks`);
};
