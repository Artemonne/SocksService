'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favourite extends Model {
    static associate(models) {
      Favourite.belongsTo(models.User, { foreignKey: 'userId' });
      Favourite.belongsTo(models.Sock, { foreignKey: 'sockId' });
    }
  }
  Favourite.init({
    userId: DataTypes.BIGINT,
    sockId: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Favourite',
  });
  return Favourite;
};