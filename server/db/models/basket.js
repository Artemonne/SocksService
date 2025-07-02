'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Basket extends Model {
    static associate(models) {
      Basket.belongsTo(models.User, { foreignKey: 'userId' });
      Basket.belongsTo(models.Sock, { foreignKey: 'sockId' });
    }
  }
  Basket.init(
    {
      userId: DataTypes.BIGINT,
      sockId: DataTypes.BIGINT,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Basket',
    }
  );
  return Basket;
};
