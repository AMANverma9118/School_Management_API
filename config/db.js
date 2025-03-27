const { Pool } = require('pg');
require('dotenv').config();

// Validate environment variables
if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in environment variables');
    process.exit(1);
}

// Create connection pool with proper configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 10000, // Increased timeout to 10 seconds
});

// Function to test connection with retries
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

// Test the connection
testConnection().then(success => {
    if (!success) {
        console.error('Failed to connect to database after multiple attempts');
        process.exit(1);
    }
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // Don't exit the process on pool errors, just log them
    console.error('Pool error details:', {
        message: err.message,
        stack: err.stack
    });
});

module.exports = pool;
