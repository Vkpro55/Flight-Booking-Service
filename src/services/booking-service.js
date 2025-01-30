const axios = require("axios");

const db = require("../models");
const { BookingRepository } = require("../repositories");
const { ServerConfig } = require("../config");
const AppError = require("../utils/errors/app-errors");
const { StatusCodes } = require("http-status-codes");

const { Enum } = require("../utils/common");
const { BOOKED, CANCELLED } = Enum.BOOKING_STATUS;

const bookingRepository = new BookingRepository();

/**
 * @Expect -> One booking is create one full transaction 
 */
async function createBooking(data) {

    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;

        if (data.noOfSeats > flightData.totalSeats) {
            throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
        }

        const totalBillingAmount = flightData.totalSeats * flightData.price;
        const payLoad = { ...data, totalCost: totalBillingAmount };

        const booking = await bookingRepository.createBooking(payLoad, transaction);
        /**
         * Update the Available seats in Flight
         */
        console.log("url : ", `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`);
        console.log("data.noOfSeats: ", data.noOfSeats);

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noOfSeats,
            dec: true
        });


        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        console.log("From Service", error);
        throw error;
    }
}


async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);

        if (bookingDetails.status == CANCELLED) {
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }

        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        /**
         * @timeCounter -> 5 minutes from start of booking
         */

        if (currentTime.valueOf() - bookingTime.valueOf() > 300000) {
            await cancelBooking(data.bookingId);
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }

        if (bookingDetails.totalCost !== data.totalCost) {
            throw new AppError('The amount of the payment doesnt match', StatusCodes.BAD_REQUEST);
        }
        if (bookingDetails.userId != data.userId) {
            throw new AppError('The user corresponding to the booking doesnt match', StatusCodes.BAD_REQUEST);
        }

        await bookingRepository.update(data.bookingId, { status: BOOKED }, transaction);
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function cancelBooking(bookingId) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId, transaction);

        if (bookingDetails.status == CANCELLED) {
            await transaction.commit();
            return true;
        }

        /**
         * Before roll-back neglect all the operations on DB
         */
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
            seats: bookingDetails.noOfSeats,
            dec: false
        });

        await bookingRepository.update(bookingId, { status: CANCELLED }, transaction);
        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


module.exports = {
    createBooking,
    makePayment
}