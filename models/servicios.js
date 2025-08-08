'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Servicios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Servicios.init({
    NombreServicio: DataTypes.STRING,
    CostoServicio: DataTypes.INTEGER,
    PorcentajeEmpleado: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 50.0
  }
  }, {
    sequelize,
    modelName: 'Servicios',
  });
  return Servicios;
};