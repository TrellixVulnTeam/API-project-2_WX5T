"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Spots, { foreignKey: "spotID" });
      Review.belongsTo(models.User, { foreignKey: "userID" });
      Review.hasMany(models.Image, { foreignKey: "reviewID" });
    }
  }
  Review.init(
    {
      review: {
        type: DataTypes.TEXT,
      },
      stars: {
        type: DataTypes.DECIMAL,
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
      modelName: "Review",
    }
  );
  return Review;
};
