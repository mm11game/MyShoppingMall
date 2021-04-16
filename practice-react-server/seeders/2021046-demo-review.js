"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Reviews", [
      {
        title: "ddkkdkd1",
        content: "1aslkdfklasdfklasdfklasdklfaksldfaksdflkasdf",
        user_id: 1,
        item_id: 1,
        star: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "asdfadsf2",
        content: "2a2sdflkasdklfaskdlfaklsdfklasdfklasdflkasdklfaksldfalksdf",
        user_id: 1,
        item_id: 2,
        star: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "ddkkdkd3",
        content: "3aslkdfklasdfklasdfklasdklfaksldfaksdflkasdf",
        user_id: 1,
        item_id: 3,
        star: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Reviews", null, {});
  },
};
