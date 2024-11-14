import pg from 'pg';

const pool = new pg.Pool({
    user: "enter your username",
    host: "localhost",
    database: "ecommerce",
    password: "enter your password",
    port: 5432
});

export default pool;

