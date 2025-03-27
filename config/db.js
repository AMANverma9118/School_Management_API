const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in environment variables');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, 
});

const testConnection = async (retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const client = await pool.connect();
            console.log('Successfully connected to Neon PostgreSQL database');
            console.log('Connection details:', {
                host: client.connectionParameters.host,
                database: client.connectionParameters.database,
                user: client.connectionParameters.user
            });
            client.release();
            return true;
        } catch (err) {
            console.error(`Connection attempt ${i + 1} failed:`, err.message);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    return false;
};

testConnection().then(success => {
    if (!success) {
        console.error('Failed to connect to database after multiple attempts');
        process.exit(1);
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    console.error('Pool error details:', {
        message: err.message,
        stack: err.stack
    });
});

module.exports = pool;
