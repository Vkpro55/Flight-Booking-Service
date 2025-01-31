'use strict';
const {
  Model
} = require('sequelize');

const { Enum } = require("../utils/common");
const { BOOKED, CANCELLED, PENDING } = Enum.BOOKING_STATUS;

module.exports = (sequelize, DataTypes) => {
  class IdempotentKey extends Model {

    static associate(models) {

    }
  }
  IdempotentKey.init({
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(BOOKED, CANCELLED, PENDING),
      allowNull: false
    },
    responseData: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'IdempotentKey',
  });
  return IdempotentKey;
};