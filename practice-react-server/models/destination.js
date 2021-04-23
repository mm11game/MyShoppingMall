"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Destination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Destination.belongsTo(models.Order, { foreignKey: "order_id" });
    }
  }
  Destination.init(
    {
      name: DataTypes.STRING,
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      phone: DataTypes.STRING,
      order_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Destination",
    }
  );
  return Destination;
};
