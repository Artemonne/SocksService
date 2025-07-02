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
    src: DataTypes.TEXT,
    code: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Sock',
  });
  return Sock;
};