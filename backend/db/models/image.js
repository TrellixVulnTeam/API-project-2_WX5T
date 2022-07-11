"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Spots, { foreignKey: "spotID",  });
      Image.belongsTo(models.Review, { foreignKey: "reviewID", });
    }
  }
  Image.init(
    {
      // imageableType: {
      //   type: DataTypes.STRING,
      // },
      url: {
        type: DataTypes.STRING,
      },
      spotID: {
        type: DataTypes.INTEGER,
      },
      reviewID: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Image;
};
