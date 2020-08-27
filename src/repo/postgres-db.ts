// Connection component
const pgCon = require('pg')

const pgConfig = {
    user: (process.env.DB_USER || 'componento'),
    host: (process.env.DB_HOST || 'localhost'),
    database: (process.env.DB_NAME || 'componento'),
    password: (process.env.DB_PASS || 'secret'),
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
};
const pool = new pgCon.Pool(pgConfig);

module.exports = pool;