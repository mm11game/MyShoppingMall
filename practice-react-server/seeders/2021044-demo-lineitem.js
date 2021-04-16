"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("LineItems", [
      {
        order_id: 1,
        option_id: 1,
        total: 1000000,
        quantity: 1,
        unitprice: 1000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        order_id: 1,
        option_id: 2,
        total: 1100000,
        quantity: 1,
        unitprice: 1100000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("LineItems", null, {});
  },
};
