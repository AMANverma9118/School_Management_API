CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- Drop the table if it exists to ensure clean creation
DROP TABLE IF EXISTS schools;

-- Create the schools table
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);

-- Create index for faster queries
CREATE INDEX idx_schools_name_deleted ON schools(name, deleted); 
