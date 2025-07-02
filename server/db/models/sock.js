'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sock extends Model {
    static associate(models) {
      Sock.hasMany(models.Basket, { foreignKey: 'sockId' });
      Sock.hasMany(models.Favourite, { foreignKey: 'sockId' });
    }
  }
  Sock.init({
    // Параметры с ENUM-ограничениями
    color: {
      type: DataTypes.ENUM('red', 'blue', 'green'), // 3 варианта цвета
      allowNull: false,
      defaultValue: 'red'
    },
    pattern: {
      type: DataTypes.ENUM('stripes', 'dots', 'waves'), // 3 варианта узора
      allowNull: false,
      defaultValue: 'stripes'
    },
    image: {
      type: DataTypes.ENUM('cat', 'dog', 'flower'), // 3 варианта картинок
      allowNull: false,
      defaultValue: 'cat'
    },
    // Готовое изображение
    genImage: {
      type: DataTypes.TEXT, // Base64 превью
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Sock',
  });
  return Sock;
};