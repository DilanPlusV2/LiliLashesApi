'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [
      {
        Actor:'Empleado'
      },
      {
        Actor:'Agendador'
      },
      {
        Actor:'Administrador'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Roles', {}, null);
  }
};
