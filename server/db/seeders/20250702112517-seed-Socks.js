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
        image: 'cucumber',
        genImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // пример Base64
        price: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        color: 'pink',
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
