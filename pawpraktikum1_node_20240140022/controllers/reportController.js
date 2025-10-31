const { Presensi } = require("../models");
exports.getDailyReport = async(req, res) => {
  console.log("Controller: Mengambil data laporan harian dari array...");

  res.json({
    reportDate: new Date().toLocaleDateString(),
    data: await Presensi.findAll(),
  });
};