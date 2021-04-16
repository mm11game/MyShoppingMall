"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Items", [
      {
        name: "airpods",
        image: "/images/airpods.jpg",
        description:
          "Bluetooth technology lets you connect it with compatible devices wirelessly High-quality AAC audio offers immersive listening experience Built-in microphone allows you to take calls while working",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "iphone",
        image: "/images/phone.jpg",
        description:
          "Introducing the iPhone 11 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "camera",
        image: "/images/camera.jpg",
        description:
          "Characterized by versatile imaging specs, the Canon EOS 80D further clarifies itself using a pair of robust focusing systems and an intuitive design",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "alexa",
        image: "/images/camera.jpg",
        description:
          "Meet Echo Dot - Our most popular smart speaker with a fabric design. It is our most compact smart speaker that fits perfectly into small space",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "mouse",
        image: "/images/camera.jpg",
        description:
          "Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse. The six programmable buttons allow customization for a smooth playing experience",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "playstation",
        image: "/images/camera.jpg",
        description:
          "The ultimate home entertainment center starts with PlayStation. Whether you are into gaming, HD movies, television, music",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Items", null, {});
  },
};
