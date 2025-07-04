// create-sock.js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Socks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      color: {
        type: Sequelize.ENUM('none', 'red', 'blue', 'pink'),
        allowNull: false,
        defaultValue: 'none'
      },
      pattern: {
        type: Sequelize.ENUM('none', 'stripes', 'dots', 'waves'),
        allowNull: false,
        defaultValue: 'none'
      },
      image: {
        type: Sequelize.ENUM('none', 'cat', 'cucumber', 'flower'),
        allowNull: false,
        defaultValue: 'none'
      },
      genImage: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Socks');
  }
};