"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Options", [
      {
        item_id: 1,
        itemoption: "빨간색",
        price: 1000000,
        sale: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_id: 1,
        itemoption: "파란색",
        price: 1100000,
        sale: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_id: 2,
        itemoption: "흰색",
        price: 50000,
        sale: 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_id: 2,
        itemoption: "검정색",
        price: 100000,
        sale: 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_id: 3,
        itemoption: "일본산",
        price: 200000,
        sale: 0.8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_id: 3,
        itemoption: "미국산",
        price: 250000,
        sale: 0.8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_id: 4,
        itemoption: "단일",
        price: 120000,
        sale: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_id: 4,
        itemoption: "이중",
        price: 160000,
        sale: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_id: 5,
        itemoption: "볼",
        price: 50000,
        sale: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_id: 5,
        itemoption: "레이저",
        price: 60000,
        sale: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_id: 6,
        itemoption: "중고",
        price: 200000,
        sale: 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_id: 6,
        itemoption: "신품",
        price: 240000,
        sale: 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Options", null, {});
  },
};
