const { StatusCodes } = require("http-status-codes");

const { BookingService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

const { Enum } = require("../utils/common");
const { SUCCESS, PENDING } = Enum.PAYMENT_STATUS;

const { IdempotentKey } = require("../models");
const db = require("../models");

/*==
POST: /bookings
req-body: {flightId: }
==*/
async function createBooking(req, res) {
    try {
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats
        });

        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse);
    }
}

async function makePayment(req, res) {
    try {

        const idempotencyKey = req.headers["x-idempotency-key"];
        if (!idempotencyKey) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Idempotency key missing" });
        }

        const existingKey = await IdempotencyKey.findByPk(idempotencyKey);
        if (existingKey) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'Cannot retry on a successful payment' });
        } else {
            await IdempotencyKey.create({
                key: idempotencyKey,
                status: PENDING
            });
        }

        const response = await BookingService.makePayment({
            totalCost: req.body.totalCost,
            userId: req.body.userId,
            bookingId: req.body.bookingId
        });

        await IdempotencyKey.update(
            {
                status: SUCCESS,
                responseData: response
            },
            { where: { key: idempotencyKey } }
        );

        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    createBooking,
    makePayment
}