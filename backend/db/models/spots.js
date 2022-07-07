"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spots.belongsTo(models.User, { foreignKey: "ownerId", as: "Owner"});
      Spots.hasMany(models.Booking, { foreignKey: "spotID" });
      Spots.hasMany(models.Image, { foreignKey: "spotID", as: "images" });
      Spots.hasMany(models.Review, { foreignKey: "spotID" });
    }
  }
  Spots.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: "Users" },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        isDecimal: true,
      },
      longitude: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        isDecimal: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      previewImage: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Spots",
    }
  );
  return Spots;
};
