const { Presensi, User } = require("../models");
const { format } = require("date-fns-tz");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const timeZone = "Asia/Jakarta";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
  }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

const formatDate = (date) => {
  return format(new Date(date), "yyyy-MM-dd HH:mm:ssXXX", { timeZone });
};


exports.CheckIn = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Token tidak valid atau tidak ditemukan." });
    }

    const userId = req.user.id;
    const waktuSekarang = new Date();

    const { latitude, longitude } = req.body;

    const buktiFoto = req.file ? req.file.path : null;

    const lat = latitude !== undefined ? parseFloat(latitude) : null;
    const lng = longitude !== undefined ? parseFloat(longitude) : null;

    if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        message: "Latitude dan longitude harus berupa angka.",
      });
    }


    const recordAktif = await Presensi.findOne({
      where: {
        userId,
        checkOut: null,
      },
    });

    if (recordAktif) {
      return res.status(400).json({
        message: "Anda sudah check-in dan belum check-out.",
      });
    }

    const newRecord = await Presensi.create({
      userId,
      checkIn: waktuSekarang,
      latitude: lat,
      longitude: lng,
      buktiFoto, 
    });

    const user = await User.findByPk(userId, { attributes: ["nama"] });

    res.status(201).json({
      message: `Halo ${user.nama}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: {
        userId: newRecord.userId,
        nama: user.nama,
        checkIn: formatDate(newRecord.checkIn),
        checkOut: null,
        latitude: newRecord.latitude,
        longitude: newRecord.longitude,
        buktiFoto: newRecord.buktifoto, 
      },
    });
  } catch (error) {
    console.error("CheckIn error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};


exports.CheckOut = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Token tidak valid atau tidak ditemukan." });
    }

    const userId = req.user.id;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: {
        userId,
        checkOut: null,
      },
      order: [["checkIn", "DESC"]],
    });

    if (!recordToUpdate) {
      return res.status(400).json({
        message: "Tidak ada sesi check-in aktif untuk Anda.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const user = await User.findByPk(userId, { attributes: ["nama"] });

    res.json({
      message: `Selamat jalan ${user.nama}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: {
        userId: recordToUpdate.userId,
        nama: user.nama,
        checkIn: formatDate(recordToUpdate.checkIn),
        checkOut: formatDate(recordToUpdate.checkOut),
        latitude: recordToUpdate.latitude,
        longitude: recordToUpdate.longitude,
        buktiFoto: recordToUpdate.buktifoto,
      },
    });
  } catch (error) {
    console.error("CheckOut error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};


exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByTk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }
    if (recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }
    await recordToDelete.destroy();
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

exports.updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    if (checkIn === undefined && checkOut === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn atau checkOut).",
      });
    }
    const recordToUpdate = await Presensi.findByPk(presensiId);

    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;

    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};