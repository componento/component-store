// Connection component
const pgCon = require('pg')

const pgConfig = {
    user: 'zawar',
    host: 'localhost',
    database: 'Componento',
    password: 'zawar123',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
};
const pool = new pgCon.Pool(pgConfig);

module.exports = pool;