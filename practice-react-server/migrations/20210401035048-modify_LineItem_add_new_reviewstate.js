"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "LineItems", // table name
        "reviewState", // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        }
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn("LineItems", "reviewState"),
    ]);
  },
};
