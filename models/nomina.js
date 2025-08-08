'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nomina extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Nomina.init({
    IdUsuario: DataTypes.INTEGER,
    NombreUsuario: DataTypes.STRING,
    Pago: DataTypes.INTEGER,
    fechaInicio: DataTypes.DATE,
    fechaFin: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Nomina',
  });
  return Nomina;
};