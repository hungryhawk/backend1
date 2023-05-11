// const { text } = require('express');
const { Pool } = require('pg');

require('dotenv').config();

// const connectionString = process.env.PSQL_CONNECTION;
const connectionString =
  'postgres://wqguxaug:0HmzLkadXA2zueEx1CtVNSORpbGWywqi@horton.db.elephantsql.com/wqguxaug';

const pool = new Pool({ connectionString });

module.exports = {
  query: (text, params) => pool.query(text, params),
};
