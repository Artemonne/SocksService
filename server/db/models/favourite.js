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
    userId: DataTypes.INTEGER,
    sockId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Favourite',
  });
  return Favourite;
};