'use strict';
const {
  Model
} = require('sequelize');


const { Enum } = require("../utils/common");

const { BOOKED, CANCELLED, INITIATED, PENDING } = Enum.BOOKING_STATUS;

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {

    static associate(models) {
      this.hasMany(models.FlightSeatBookings, {
        foreignKey: "bookingId"
      })
    }

  }
  Booking.init({
    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: [BOOKED, CANCELLED, INITIATED, PENDING],
      defaultValue: INITIATED,
      allowNull: false
    },
    noOfSeats: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    totalCost: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};