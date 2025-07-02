'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'hashedpassword1',
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        password: 'hashedpassword2',
      },
     ])
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
