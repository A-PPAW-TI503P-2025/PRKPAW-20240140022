const { Presensi } = require("../models");
const { Op } = require('sequelize'); 

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    let options = { 
        where: {},
    };

    if (nama) {
        options.where.nama = {
            [Op.like]: `%${nama}%`,
        };
    }

      // Filter Berdasarkan Rentang Tanggal (Op.between)
    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
          [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)],
      };
      } else if (tanggalMulai) {
      options.where.checkIn = {
          [Op.gte]: new Date(tanggalMulai),
      };
      } else if (tanggalSelesai) {
      options.where.checkIn = {
          [Op.lte]: new Date(tanggalSelesai),}
      };

      // Ambil data dari database
      const records = await Presensi.findAll(options);

      // Kirim respon sukses
      res.json({
          reportDate: new Date().toLocaleDateString(),
          filterUsed: { nama, tanggalMulai, tanggalSelesai }, // Tunjukkan filter yang digunakan
          data: records,
      });

  } catch (error) {
    // Penanganan error server
    res
        .status(500)
        .json({ 
            message: "Gagal mengambil laporan presensi.", 
            error: error.message 
        });
  }
};