const { Op } = require("sequelize");
const axios = require("axios");

const CrudRepository = require("./crud-repository");
const { Booking, sequelize, FlightSeatBookings } = require("../models");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-errors");

const { Enum } = require("../utils/common");
const { INITIATED } = Enum.BOOKING_STATUS;
const { BOOKED } = Enum.SEAT_STATUS;

const { ServerConfig } = require("../config");

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }

    async createBooking(data, transaction) {
        return await Booking.create(data, { transaction: transaction });
    }

    /** 
     * @param {*} transaction -> It will ensure that get or update method is part or makePayment current transaction: why beacuse we need to update the booking data once payment is successfull.
     */
    async get(data, transaction) {
        const response = await this.model.findByPk(data, { transaction: transaction });
        if (!response) {
            throw new AppError('Not able to fund the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }


    async update(id, data, transaction) {
        const response = await this.model.update(data, {
            where: {
                id: id
            }
        }, { transaction: transaction });
        return response;
    }

    async cancelOldBookings(timestamp) {
        const bookings = await Booking.findAll({
            where: {
                createdAt: { [Op.lt]: timestamp },
                status: { [Op.eq]: INITIATED }
            }
        });

        return bookings;
    }

    async seatBooking({ seatId, flightId, userId, bookingId }) {
        const transaction = await sequelize.transaction();
        try {
            const seatUpdateResponse = await axios.patch(
                `${ServerConfig.FLIGHT_SERVICE}/api/v1/seatdata/${seatId}`,
                {
                    status: BOOKED
                },
                { validateStatus: () => true }
            );
            const seatData = seatUpdateResponse.data;

            if (seatData.success === false) {
                throw new AppError(seatData.error.explanation, seatData.error.statusCode);
            }

            const booking = await Booking.findOne({
                where: {
                    id: bookingId
                },
                transaction
            })
            booking.status = BOOKED;
            await booking.save({ transaction: transaction });

            const newBooking = await FlightSeatBookings.create({
                seatId, flightId, userId, bookingId
            });

            await transaction.commit();
            return newBooking;
        } catch (error) {
            console.error("Error in seat booking:", error);
            await transaction.rollback();
            if (error instanceof AppError) {
                throw error;
            }
            else {
                throw new AppError("Unexpected error in booking service", StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }
    }

}

module.exports = BookingRepository;
