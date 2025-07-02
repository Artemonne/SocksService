'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Socks', [
      {
        color: 'red',
        pattern: 'stripes',
        image: 'cat',
        genImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // пример Base64
        price: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        color: 'blue',
        pattern: 'dots',
        image: 'dog',
        genImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // пример Base64
        price: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        color: 'green',
        pattern: 'waves',
        image: 'flower',
        genImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // пример Base64
        price: 120,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Socks', null, {});
  }
};
