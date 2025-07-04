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
      type: DataTypes.ENUM('none', 'red', 'blue', 'pink'), // 3 варианта цвета
      allowNull: false,
      defaultValue: 'none'
    },
    pattern: {
      type: DataTypes.ENUM('none', 'stripes', 'dots', 'waves'), // 3 варианта узора
      allowNull: false,
      defaultValue: 'none'
    },
    image: {
      type: DataTypes.ENUM('none', 'cat', 'cucumber', 'flower'), // 3 варианта картинок
      allowNull: false,
      defaultValue: 'none'
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