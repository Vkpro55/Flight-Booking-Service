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
    try {
        return await db.sequelize.transaction(async (t) => {
            const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
            const flightData = flight.data.data;

            if (data.noOfSeats > flightData.totalSeats) {
                throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
            }

            return true;
        });
    } catch (error) {
        console.error("Error is:", error);
        throw error;
    }
}




module.exports = {
    createBooking,
}