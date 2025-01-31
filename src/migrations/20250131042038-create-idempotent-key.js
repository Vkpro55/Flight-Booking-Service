'use strict';
/** @type {import('sequelize-cli').Migration} */

const { Enum } = require("../utils/common");
const { BOOKED, CANCELLED, PENDING } = Enum.BOOKING_STATUS;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IdempotentKeys', {
      key: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(BOOKED, CANCELLED, PENDING),
        allowNull: false
      },
      responseData: {
        type: Sequelize.JSON,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('IdempotentKeys');
  }
};