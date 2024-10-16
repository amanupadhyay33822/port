const express = require("express");
const app = express();
const userRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const appointmentRoutes = require("./routes/appointment");
const cookieParser = require("cookie-parser");
const tattooRoutes = require('./routes/tatto');
const portfolioRoutes = require('./routes/portfolio');
const cors = require("cors");
const dotenv = require("dotenv");
const { connect } = require("./db/dbconfig");
dotenv.config();
const PORT = process.env.PORT || 4000;


//middlewares
app.use(express.json());
app.use(cookieParser());
// connect();

app.use(cors());
connect();
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/portfolio", portfolioRoutes);
app.use("/api/v1/tatto", tattooRoutes);
app.get("/",(req,res)=>{
	res.send("hello")
})



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
