"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "Users", // table name
        "mileage", // new field name
        {
          type: Sequelize.INTEGER,
          defaultValue: 1000,
        }
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([queryInterface.removeColumn("Users", "mileage")]);
  },
};
