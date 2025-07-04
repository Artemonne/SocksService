'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Baskets', [
      {
        userId: 1,
        sockId: 1,
        quantity: 2,
        price: 500,
        cartId: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        sockId: 2,
        quantity: 2,
        price: 500,
        cartId: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        sockId: 3,
        quantity: 2,
        price: 500,
        cartId: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Baskets', null, {});
  }
};