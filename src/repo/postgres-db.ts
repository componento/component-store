// Connection component
const pgCon = require('pg')

const pgConfig = {
    user: (process.env.DB_USER || 'zawar'),
    host: (process.env.DB_HOST || 'localhost'),
    database: (process.env.DB_NAME || 'Componento'),
    password: (process.env.DB_PASS || 'zawar123'),
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
};
const pool = new pgCon.Pool(pgConfig);

module.exports = pool;