const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool with proper configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        console.error('Database configuration:', {
            host: client?.connectionParameters?.host,
            database: client?.connectionParameters?.database,
            environment: process.env.NODE_ENV
        });
        return;
    }
    console.log('Successfully connected to Neon PostgreSQL database');
    release();
});

module.exports = pool;
