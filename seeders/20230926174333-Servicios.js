'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Servicios', [
      {
        NombreServicio:'Efecto natural',
        CostoServicio: 60000
      },
      {
        NombreServicio:'Efecto pestañina',
        CostoServicio: 65000
      },
      {
        NombreServicio:'Volumen hawaiano',
        CostoServicio: 90000
      },
      {
        NombreServicio:'Híbrido hawaiano',
        CostoServicio: 75000
      },
      {
        NombreServicio:'Volumen ruso',
        CostoServicio: 100000
      },
      {
        NombreServicio:'Volumen híbrido',
        CostoServicio: 100000
      },
      {
        NombreServicio:'Volumen whispy',
        CostoServicio: 120000
      },
      {
        NombreServicio:'Retoque NATURAL 15 días',
        CostoServicio: 25000
      },
      {
        NombreServicio:'Retoque natural día 16 - 20',
        CostoServicio: 30000
      },
      {
        NombreServicio:'Retoque natural + 20 días',
        CostoServicio: 40000
      },
      {
        NombreServicio:'Retoque natural otro lugar',
        CostoServicio: 40000
      },
      {
        NombreServicio:'Retoque PESTAÑINA 15 días',
        CostoServicio: 30000
      },
      {
        NombreServicio:'Retoque pestañina día 16 - 20',
        CostoServicio: 35000
      },
      {
        NombreServicio:'Retoque pestañina + 20 días',
        CostoServicio: 45000
      },
      {
        NombreServicio:'Retoque HAWAIANO',
        CostoServicio: 50000
      },
      {
        NombreServicio:'Retoque Híbrido hawaiano',
        CostoServicio: 35000
      },
      {
        NombreServicio:'Retoque WHISPY',
        CostoServicio: 60000
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
