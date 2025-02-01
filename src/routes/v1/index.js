const express = require("express");

const infoRouter = require("./info-route");
const bookingRoutes = require("./booking-routes");

const router = express.Router();

router.use("/info", infoRouter);
router.use("/bookings", bookingRoutes);

module.exports = router;