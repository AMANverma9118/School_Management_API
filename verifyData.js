const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to database successfully!');

    const query = 'SELECT * FROM schools ORDER BY id DESC LIMIT 1';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return;
        }

        console.log('\nLast Inserted School Data:');
        console.log('=========================');
        if (results.length === 0) {
            console.log('No schools found in the database.');
        } else {
            const school = results[0];
            console.log(`
ID: ${school.id}
Name: ${school.name}
Address: ${school.address}
Latitude: ${school.latitude}
Longitude: ${school.longitude}
Created At: ${school.created_at}
-------------------`);
        }

    
        connection.end();
        console.log('\nDatabase connection closed.');
    });
}); 