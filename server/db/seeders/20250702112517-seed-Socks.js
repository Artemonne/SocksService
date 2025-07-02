'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Socks', [
      {
        src: '/images/socks1.jpg',
        code: 1001,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        src: '/images/socks2.jpg',
        code: 1002,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        src: '/images/socks3.jpg',
        code: 1003,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Socks', null, {});
  }
};