'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Servicios', 'PorcentajeEmpleado', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 50.0 // Valor por defecto para mantener compatibilidad
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Servicios', 'PorcentajeEmpleado');
  }
};
