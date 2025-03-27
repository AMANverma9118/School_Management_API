const { body, validationResult } = require('express-validator');
const db = require('../config/db');

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

const validateAddSchool = [
    body('name').notEmpty().trim().withMessage('School name is required'),
    body('address').notEmpty().trim().withMessage('Address is required'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
];

const schoolController = {
    //Controller for addSchool API
    addSchool: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, address, latitude, longitude } = req.body;
            
            
            const [existingSchools] = await db.execute(
                'SELECT id FROM schools WHERE name = ?',
                [name]
            );

            if (existingSchools.length > 0) {
                return res.status(400).json({
                    message: 'A school with this name already exists',
                    error: 'DUPLICATE_SCHOOL_NAME'
                });
            }
            
            
            const [result] = await db.execute(
                'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
                [name, address, latitude, longitude]
            );

            res.status(201).json({
                message: 'School added successfully',
                schoolId: result.insertId
            });
        } catch (error) {
            console.error('Error adding school:', error);
            res.status(500).json({ message: 'Error adding school' });
        }
    },

    // Controller for list of Short School
    listShortSchools: async (req, res) => {
        try {
            const { latitude, longitude } = req.query;

            
            if (!latitude || !longitude) {
                return res.status(400).json({ message: 'Latitude and longitude are required' });
            }

            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                return res.status(400).json({ message: 'Invalid coordinates' });
            }

            
            const [schools] = await db.execute('SELECT * FROM schools');

            
            const schoolsWithDistance = schools.map(school => ({
                ...school,
                distance: calculateDistance(lat, lon, school.latitude, school.longitude)
            }));

            
            schoolsWithDistance.sort((a, b) => a.distance - b.distance);

            res.json(schoolsWithDistance);
        } catch (error) {
            console.error('Error fetching schools:', error);
            res.status(500).json({ message: 'Error fetching schools' });
        }
    }
};

module.exports = {
    schoolController,
    validateAddSchool
};