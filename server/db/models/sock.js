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
    color: {
      type: DataTypes.ENUM('none', 'red', 'blue', 'pink', 'yellow', 'orange'),
      allowNull: false,
      defaultValue: 'none'
    },
    pattern: {
      type: DataTypes.ENUM('none', 'stripes', 'dots', 'waves'), 
      allowNull: false,
      defaultValue: 'none'
    },
    image: {
      type: DataTypes.ENUM('none', 'cat', 'cucumber', 'flower'), 
      allowNull: false,
      defaultValue: 'none'
    },
    

    genImage: {
      type: DataTypes.TEXT,
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