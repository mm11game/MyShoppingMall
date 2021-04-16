"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "Options", // table name
        "sale", // new field name
        {
          type: Sequelize.FLOAT,
          defaultValue: 1,
        }
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([queryInterface.removeColumn("Options", "sale")]);
  },
};
