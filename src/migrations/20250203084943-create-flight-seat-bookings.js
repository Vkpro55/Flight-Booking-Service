'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FlightSeatBookings',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        seatId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        flightId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        bookingId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Bookings",
            key: "id"
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {
        uniqueKeys: {
          unique_seat_flight_booking: {
            fields: ['seatId', 'flightId']
          }
        }
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FlightSeatBookings');
  }
};
