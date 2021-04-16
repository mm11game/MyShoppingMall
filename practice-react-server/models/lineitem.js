"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LineItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LineItem.belongsTo(models.Order, { foreignKey: "order_id" });
      LineItem.belongsTo(models.Option, { foreignKey: "option_id" });
    }
  }
  LineItem.init(
    {
      order_id: DataTypes.INTEGER,
      option_id: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      unitprice: DataTypes.INTEGER,
      reviewState: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "LineItem",
    }
  );
  return LineItem;
};
