'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spots extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Spots.init({
    ownerId:{
     type: DataTypes.INTEGER,
    },
    address:{
      type: DataTypes.STRING,
     },
     city:{
      type: DataTypes.STRING,
     },
     state:{
      type: DataTypes.STRING,
     },
     country:{
      type: DataTypes.STRING,
     },
     latitude:{
      type: DataTypes.DECIMAL,
     },
     longitude:{
      type: DataTypes.DECIMAL,
     },
     name:{
      type: DataTypes.STRING,
     },
     description:{
      type: DataTypes.STRING,
     },
  }, {
    sequelize,
    modelName: 'Spots',
  });
  return Spots;
};
