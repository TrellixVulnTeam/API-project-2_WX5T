"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.Spots, { foreignKey: "spotID" });
      Booking.belongsTo(models.User, { foreignKey: "userID" });
    }
  }
  Booking.init(
    {
      startDate: {
        type: DataTypes.DATE,
      },
      endDate: {
        type: DataTypes.DATE,
      },
      spotID: {
        type: DataTypes.INTEGER,
      },
      userID: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
