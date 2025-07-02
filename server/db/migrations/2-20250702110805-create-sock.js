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
        type: Sequelize.ENUM('red', 'blue', 'green'),
        allowNull: false,
        defaultValue: 'red'
      },
      pattern: {
        type: Sequelize.ENUM('stripes', 'dots', 'waves'),
        allowNull: false,
        defaultValue: 'stripes'
      },
      image: {
        type: Sequelize.ENUM('cat', 'dog', 'flower'),
        allowNull: false,
        defaultValue: 'cat'
      },
      genImage: {
        type: Sequelize.TEXT,
        allowNull: false
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