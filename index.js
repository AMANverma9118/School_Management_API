const express = require("express");
const cors = require("cors");
require("dotenv").config();
const schoolRoutes = require("./Routes/SchoolRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", schoolRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server running at http:${PORT}`);  
});
