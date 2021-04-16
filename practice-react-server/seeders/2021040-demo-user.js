"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        name: "kiun",
        password: "a123456",
        email: "example@example.com",
        address: "서울 안양시 범계동 샛별 608동 801호",
        phone: "01086694948",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "kiun2",
        password: "1212",
        email: "a@a.com",
        address: "서울 안양시 범계동 샛별 608동 801호",
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
