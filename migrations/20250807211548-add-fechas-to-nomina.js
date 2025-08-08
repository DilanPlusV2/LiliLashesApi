'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Nominas', 'fechaInicio', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Nominas', 'fechaFin', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Nominas', 'fechaInicio');
    await queryInterface.removeColumn('Nominas', 'fechaFin');
  }
};
