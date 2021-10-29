const postgres = require("postgres");
var env = require("dotenv");

const IN_PROD = process.env.NODE_ENV === "production";

const sql = postgres(process.env.DATABASE_URL, {
  debug: (_, query, params) => {
    if (!IN_PROD) {
      const queryString = query.split("\n").join("");
      console.log({ query: queryString, params });
    }
  },
});

const testDBConnection = async () => {
  sql`SELECT 1+1 AS result`
    .then(() => {
      console.log("Connected to postgres");
    })
    .catch((err) => {
      if (!IN_PROD) throw Error(err);
      console.log(err);
    });
};

const closeDBConnection = () => {
  sql.end().then(() => console.log("Connection to Postgres closed"));
};

module.exports = {
  sql,
  testDBConnection,
  closeDBConnection,
};
