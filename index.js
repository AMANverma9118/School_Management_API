const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const schoolRoutes = require("./Routes/SchoolRoutes");


const PORT = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());


app.use("/", schoolRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});


app.get('/',(req,res)=>{
    res.send('Hello everyone');
})

app.listen(PORT, () => {
    console.log(`Server running at http:${PORT}`);  
});
