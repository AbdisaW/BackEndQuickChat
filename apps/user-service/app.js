const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./src/routes/auth.routes");
const sequelize = require("../../libs/database/mysql"); // MySQL connection
const redisClient = require("../../libs/database/redis"); // Redis connection

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(bodyParser.json());


app.use("/api/auth", authRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(" MySQL connected");

    await redisClient.connect();
    console.log(" Redis connected");

    // await sequelize.sync({ alter: true });
    // console.log("Database synced");

    app.listen(PORT, () => {
      console.log(`User Service running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(" Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
