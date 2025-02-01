const express = require("express");
const { InfoController } = require("../../controllers");

const router = express.Router();

/*== route: POST: /api/v1/bookings ==*/
router.get("/", InfoController.Info);

module.exports = router;