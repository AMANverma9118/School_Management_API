const { body, validationResult } = require('express-validator');
const db = require('../config/db');

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Validation middleware for add school
const validateAddSchool = [
    body('name').notEmpty().trim().withMessage('School name is required'),
    body('address').notEmpty().trim().withMessage('Address is required'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
];

// Controller functions
const schoolController = {
    // Add School Controller
    addSchool: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, address, latitude, longitude } = req.body;
            
            // Check for duplicate school name
            const existingSchools = await db.query(
                'SELECT id FROM schools WHERE name = $1 AND deleted = false',
                [name]
            );

            if (existingSchools.rows.length > 0) {
                return res.status(400).json({
                    message: 'A school with this name already exists',
                    error: 'DUPLICATE_SCHOOL_NAME'
                });
            }
            
            // If no duplicate found, insert the new school
            const result = await db.query(
                'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING id',
                [name, address, latitude, longitude]
            );

            res.status(201).json({
                message: 'School added successfully',
                schoolId: result.rows[0].id
            });
        } catch (error) {
            console.error('Error adding school:', error);
            console.error('Error details:', {
                code: error.code,
                detail: error.detail,
                hint: error.hint,
                where: error.where
            });
            
            res.status(500).json({
                message: 'Error adding school',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
                details: process.env.NODE_ENV === 'development' ? {
                    code: error.code,
                    detail: error.detail,
                    hint: error.hint,
                    where: error.where
                } : undefined
            });
        }
    },

    // List Short School Controller
    listShortSchool: async (req, res) => {
        try {
            const { latitude, longitude } = req.query;

            // Validate coordinates
            if (!latitude || !longitude) {
                return res.status(400).json({ message: 'Latitude and longitude are required' });
            }

            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                return res.status(400).json({ message: 'Invalid coordinates' });
            }

            // Fetch all schools
            const result = await db.query('SELECT * FROM schools WHERE deleted = false');
            const schools = result.rows;

            // Calculate distances and sort schools
            const schoolsWithDistance = schools.map(school => ({
                ...school,
                distance: calculateDistance(lat, lon, school.latitude, school.longitude)
            }));

            // Sort by distance
            schoolsWithDistance.sort((a, b) => a.distance - b.distance);

            res.json(schoolsWithDistance);
        } catch (error) {
            console.error('Error fetching schools:', error);
            console.error('Error details:', {
                code: error.code,
                detail: error.detail,
                hint: error.hint,
                where: error.where
            });
            
            res.status(500).json({
                message: 'Error fetching schools',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
                details: process.env.NODE_ENV === 'development' ? {
                    code: error.code,
                    detail: error.detail,
                    hint: error.hint,
                    where: error.where
                } : undefined
            });
        }
    }
};

module.exports = {
    schoolController,
    validateAddSchool
};