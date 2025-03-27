const express = require("express");
const cors = require("cors");
require("dotenv").config();
const schoolRoutes = require("./Routes/SchoolRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/", schoolRoutes);


app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});


app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.get('/',(req,res)=>{
    res.send('Hello everyone');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
