'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clientes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Clientes.init({
    nombres: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    instagram: DataTypes.STRING,
    IdUsuario: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Clientes',
  });
  return Clientes;
};