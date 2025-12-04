const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { authenticateToken } = require("../middleware/permissionMiddleware");

router.use(authenticateToken);

router.post('/', (req, res) => {
    console.log("Request body:", req.body);
    res.status(201).json({ message: "Presensi berhasil dicatat!" });
});

router.get('/', (req, res) => {
    res.status(200).json({ message: "Ini adalah endpoint untuk GET semua data presensi" });
});

router.get("/check-in", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Endpoint untuk presensi check-in berhasil diakses!",
  });
});

router.post("/check-in", presensiController.CheckIn);
router.post("/check-out", presensiController.CheckOut);

router.put("/:id", presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);

module.exports = router;