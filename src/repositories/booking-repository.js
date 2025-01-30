const { Op } = require("sequelize");

const CrudRepository = require("./crud-repository");
const { Booking } = require("../models");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-errors");

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
        const response = await Booking.update(
            { status: CANCELLED },
            {
                where: {
                    createdAt: { [Op.lt]: timestamp },
                    status: { [Op.notIn]: [BOOKED, CANCELLED] }
                }
            }
        );
        return response;
    }


}

module.exports = BookingRepository;
