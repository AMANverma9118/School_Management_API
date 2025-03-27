# School Management System

A RESTful API for managing school information with PostgreSQL database.

## Features

- Add new schools with location details
- List all active schools with distance calculation
- Soft delete functionality
- Input validation
- Error handling
- PostgreSQL database integration

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd school-management-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
NODE_ENV=development
DATABASE_URL=postgres://neondb_owner:YOUR_PASSWORD@ep-gentle-shadow-a5neicku-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
PORT=3000
```

4. Set up the database:
```bash
node scripts/setup-db.js
```

5. Start the server:
```bash
npm start
```

## API Endpoints

### 1. Add School
```
POST /api/schools/addSchool
Content-Type: application/json

{
    "name": "School Name",
    "address": "School Address",
    "latitude": 39.783730,
    "longitude": -89.650630
}
```

### 2. List Schools
```
GET /api/schools/listShortSchool?latitude=38.9716&longitude=77.5946
```

#### Description
Retrieves a list of all active (non-deleted) schools in the system, sorted by distance from the provided coordinates.

#### Query Parameters
- `latitude`: Required. The latitude coordinate of the reference point (e.g., 38.9716)
- `longitude`: Required. The longitude coordinate of the reference point (e.g., 77.5946)

#### Response Format
```json
[
    {
        "id": 1,
        "name": "St. Mar High School",
        "address": "999 New Street",
        "latitude": 12.9876,
        "longitude": 77.6543,
        "created_at": "2025-03-27T16:41:40.117Z",
        "deleted": false,
        "distance": 2889.2949540505915
    }
]
```

#### Response Fields
- `id`: Unique identifier of the school
- `name`: Name of the school
- `address`: Physical address of the school
- `latitude`: Geographical latitude coordinate
- `longitude`: Geographical longitude coordinate
- `created_at`: Timestamp of when the school was added
- `deleted`: Boolean indicating if the school is deleted
- `distance`: Distance in kilometers from the provided coordinates

#### Status Codes
- 200: Success
- 400: Bad Request (missing or invalid coordinates)
- 500: Server Error

#### Notes
- Only returns active schools (deleted = false)
- Results are ordered by distance from the provided coordinates
- Distance is calculated in kilometers
- Both latitude and longitude parameters are required

## Testing

### Using Postman

1. Import the Postman collection
2. Set up environment variables:
   - `base_url`: https://school-management-api-lmvw.onrender.com

### Example Requests

Add School:
```bash
curl -X POST https://school-management-api-lmvw.onrender.com/addSchool \
-H "Content-Type: application/json" \
-d '{
    "name": "Springfield Elementary",
    "address": "123 School Street, Springfield, IL 62701",
    "latitude": 39.783730,
    "longitude": -89.650630
}'
```

List Schools:
```bash
curl "https://school-management-api-lmvw.onrender.com/listShortSchool?latitude=38.9716&longitude=77.5946"
```

## Project Structure

```
school-management-backend/
├── config/
│   └── db.js           # Database configuration
├── controllers/
│   └── schoolController.js  # Business logic
├── database/
│   └── schema.sql      # Database schema
├── Routes/
│   └── schoolRoutes.js # API routes
├── scripts/
│   └── setup-db.js     # Database setup script
├── .env                # Environment variables
├── package.json        # Project dependencies
└── README.md          # Project documentation
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (validation errors)
- 500: Server Error

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 