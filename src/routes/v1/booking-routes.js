const express = require("express");
const { BookingController } = require("../../controllers");

const router = express.Router();

/*== route: POST: /api/v1/bookings ==*/
router.post(
    "/",
    BookingController.createBooking);

/*== route: POST: /api/v1/bookings/seatbooking:id ==*/
router.post(
    "/seatbooking/:id",
    BookingController.seatBooking);


/*== route: POST: /api/v1/bookings/payments ==*/
router.post(
    "/payments",
    BookingController.makePayment);



module.exports = router;