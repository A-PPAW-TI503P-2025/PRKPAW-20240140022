const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { addUserData, isAdmin } = require("../middleware/permissionMiddleware");
router.get("/daily", [addUserData, isAdmin], reportController.getDailyReport);
module.exports = router;

const mockAdmin = (req, res, next) => {
  req.user = { id: 1, nama: "Admin Dev", role: "admin" };
  next();
};

router.get("/daily", [mockAdmin, isAdmin], reportController.getDailyReport);

module.exports = router;