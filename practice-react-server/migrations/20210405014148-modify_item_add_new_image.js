"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "Items", // table name
        "image", // new field name
        {
          type: Sequelize.STRING,
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Items", "image");
  },
};
