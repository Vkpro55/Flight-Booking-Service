'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FlightSeatBookings extends Model {
    static associate(models) {
      this.belongsTo(models.Booking, {
        foreignKey: 'bookingId',
        as: "booking_detail"
      })
    }
  }

  FlightSeatBookings.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      seatId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      flightId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'FlightSeatBookings',
      indexes: [
        {
          unique: true,
          fields: ['seatId', 'flightId'],
          name: 'unique_seat_flight_booking'
        }
      ]
    }
  );

  return FlightSeatBookings;
};
