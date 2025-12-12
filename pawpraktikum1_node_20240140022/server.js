const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const PORT = 3001;

const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");

const authRoutes = require('./routes/auth');

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


app.get("/", (req, res) => {
  res.send("Home Page for API");
});


app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
