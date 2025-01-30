const axios = require("axios");

const db = require("../models");
const { BookingRepository } = require("../repositories");
const { ServerConfig } = require("../config");
const AppError = require("../utils/errors/app-errors");
const { StatusCodes } = require("http-status-codes");

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




module.exports = {
    createBooking,
}