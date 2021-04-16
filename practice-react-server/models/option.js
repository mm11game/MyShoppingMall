"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Option.hasMany(models.LineItem, {
        foreignKey: "option_id",
      });
      Option.belongsTo(models.Item, { foreignKey: "item_id" });
    }
  }
  Option.init(
    {
      item_id: DataTypes.INTEGER,
      itemoption: DataTypes.STRING,
      price: DataTypes.INTEGER,
      sale: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Option",
    }
  );
  return Option;
};
