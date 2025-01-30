const CrudRepository = require("./crud-repository");
const { Booking } = require("../models");

class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }

    async createBooking(data, transaction) {
        return await Booking.create(data, { transaction: transaction });
    }
}

module.exports = BookingRepository;
