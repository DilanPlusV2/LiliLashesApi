'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relación con Clientes (muchas reservas pertenecen a un cliente)
      Reservas.belongsTo(models.Clientes, { foreignKey: 'IdCliente' });

      // Relación con Usuarios (muchas reservas son gestionadas por un Lashista o empleado)
      Reservas.belongsTo(models.Usuarios, { foreignKey: 'IdUsuario' });
    }
  }
  Reservas.init({
    Fecha: DataTypes.DATE,
    FechaRetoque: DataTypes.DATE,
    Hora: DataTypes.TIME,
    MontoAbonado: DataTypes.INTEGER,
    Nota: DataTypes.STRING,
    MedioDePago: DataTypes.STRING,
    Tamanio: DataTypes.STRING,
    IdServicio: DataTypes.INTEGER,
    IdUsuario: DataTypes.INTEGER,
    IdCliente: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reservas',
  });
  return Reservas;
};