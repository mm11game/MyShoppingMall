"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        name: "이기운",
        password: "a123456",
        email: "example@example.com",
        address1: "11234",
        address2: "12341243",
        phone: "01086694948",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "kiun2",
        password: "1212",
        email: "a@a.com",
        address1: "1234",
        address2: "ehlalksdlf",
        phone: "288381283",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
