'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reservas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Fecha: {
        type: Sequelize.DATE
      },
      FechaRetoque:{
        type: Sequelize.DATE
      },
      Hora: {
        type: Sequelize.TIME
      },
      MontoAbonado: {
        type: Sequelize.INTEGER
      },
      MedioDePago:{
        type: Sequelize.STRING
      },
      Tamanio:{
        type: Sequelize.STRING
      },
      Nota:{
        type:Sequelize.STRING
      },
      IdUsuario: {
        type: Sequelize.INTEGER
      },
      IdServicio:{
        type:Sequelize.INTEGER
      },
      IdCliente:{
        type:Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reservas');
  }
};