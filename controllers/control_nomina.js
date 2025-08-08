// Importa moment.js para manipular las fechas
const moment = require('moment-timezone'); // Asegúrate de utilizar moment-timezone
const { where } = require('sequelize');
const models = require('../models');
const { Op } = require('sequelize');
const { Nomina, Usuario } = require('../models');

// Configura Moment.js para la zona horaria de Colombia
moment.tz.setDefault('America/Bogota');

// Función para calcular la nómina del empleado
async function calcularNominaPersonalizada(idUsuario, fechaInicio, fechaFin) {
  try {
    // Busca todas las reservas dentro del rango
    const reservas = await models.Reservas.findAll({
      where: {
        IdUsuario: idUsuario,
        Fecha: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      }
    });

    let totalEmpleado = 0;

    // Procesa cada reserva y busca el servicio correspondiente para obtener el porcentaje
    for (const reserva of reservas) {
      const servicio = await models.Servicios.findOne({ where: { id: reserva.IdServicio } });

      if (servicio) {
        const porcentaje = servicio.PorcentajeEmpleado ?? 50;
        totalEmpleado += (reserva.MontoAbonado * porcentaje) / 100;
      } else {
        console.warn(`Servicio con ID ${reserva.IdServicio} no encontrado.`);
      }
    }

    return {
      inicio: moment(fechaInicio).format('YYYY-MM-DD'),
      fin: moment(fechaFin).format('YYYY-MM-DD'),
      montoEmpleado: totalEmpleado
    };

  } catch (error) {
    console.error("Error al calcular la nómina personalizada:", error);
    throw error;
  }
}

// Endpoint para calcular la nómina
async function calcularNominaEmpleado(req, res) {
  const idUsuario = req.params.idUsuario;
  const { fechaInicio, fechaFin } = req.body;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({
      message: "Faltan parámetros: fechaInicio o fechaFin"
    });
  }

  try {
    const resultado = await calcularNominaPersonalizada(idUsuario, fechaInicio, fechaFin);
    res.status(200).json({
      message: "Cálculo de nómina exitoso",
      data: resultado
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al calcular la nómina",
      error: error.message
    });
  }
}

const calcularMontoAbonado = async (req, res) => {
  try {
    const mañana = moment().add(1, 'day').startOf('day'); // Obtén la fecha de mañana al principio del día

    const reservas = await models.Reservas.findAll({
      where: {
        Fecha: {
          [Op.gte]: mañana.toDate(),
        },
      },
    });

    // Inicializa un objeto para almacenar los totales por medio de pago
    const totalesPorMedioDePago = {
      Nequi: 0,
      Daviplata: 0,
      Bancolombia: 0,
      Efectivo: 0,
    };

    // Itera sobre las reservas y suma los MontoAbonado por medio de pago
    reservas.forEach(reserva => {
      const medioDePago = reserva.MedioDePago;
      totalesPorMedioDePago[medioDePago] += reserva.MontoAbonado;
    });

    // Calcula el total general sumando los totales de cada medio de pago
    const totalMontoAbonado = Object.values(totalesPorMedioDePago).reduce((total, monto) => total + monto, 0);

    // Prepara la respuesta incluyendo la fecha de mañana
    const respuesta = {
      fechaConsulta: mañana.format('YYYY-MM-DD'),
      totalesPorMedioDePago,
      totalMontoAbonado,
    };

    res.status(200).json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al calcular el MontoAbonado.' });
  }
};

function guardarservicio(req, res) {

    const post = {
        NombreServicio: req.body.NombreServicio, // Utiliza la fecha de entrada sin cambios
        CostoServicio: req.body.CostoServicio,
        PorcentajeEmpleado: req.body.PorcentajeEmpleado
    };
    models.Servicios.create(post).then(result => {
        res.status(201).json({
            message: "Creación del servicio exitosa",
            result: result
        });
    }).catch(error => {
        res.status(403).json({
            message: "Error al crear el servicio",
            error: error
        });
    });
}

function editarServicio(req, res) {
    const idServicio = req.params.id;
    const updatedData = {
        NombreServicio: req.body.NombreServicio,
        CostoServicio: req.body.CostoServicio,
        PorcentajeEmpleado: req.body.PorcentajeEmpleado
        // Agrega aquí otros campos que puedas actualizar según tus necesidades
    };

    models.Servicios.update(updatedData, {
        where: {
            id: idServicio
        }
    }).then(result => {
        if (result[0] === 1) {
            res.status(200).json({
                message: "Actualización del servicio exitosa",
                result: result
            });
        } else {
            res.status(404).json({
                message: "Servicio no encontrado",
                result: result
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Error al actualizar el servicio",
            error: error
        });
    });
}

function eliminarServicio(req, res) {
    const idServicio = req.params.id;

    models.Servicios.destroy({
        where: {
            id: idServicio
        }
    }).then(result => {
        if (result === 1) {
            res.status(200).json({
                message: "Eliminación del servicio exitosa",
                result: result
            });
        } else {
            res.status(404).json({
                message: "Servicio no encontrado",
                result: result
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Error al eliminar el servicio",
            error: error
        });
    });
}

// POST /nomina/guardar
const guardarNomina = async (req, res) => {
  try {
    const { IdUsuario, NombreUsuario, Pago, fechaInicio, fechaFin } = req.body;

    if (!IdUsuario || !NombreUsuario || !Pago || !fechaInicio || !fechaFin) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const nuevaNomina = await Nomina.create({
      IdUsuario,
      NombreUsuario,
      Pago,
      fechaInicio,
      fechaFin
    });

    return res.status(201).json({ message: 'Nómina guardada', data: nuevaNomina });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al guardar la nómina' });
  }
};

// DELETE /nomina/eliminar/:id
const eliminarNomina = async (req, res) => {
  try {
    const { id } = req.params;

    const nomina = await Nomina.findByPk(id);
    if (!nomina) return res.status(404).json({ message: 'Nómina no encontrada' });

    await nomina.destroy();
    return res.status(200).json({ message: 'Nómina eliminada' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar la nómina' });
  }
};

// GET /nomina/consultar?nombre=kelly&fechaInicio=2025-07-01&fechaFin=2025-07-15
const consultarNominas = async (req, res) => {
  try {
    const { nombre, fechaInicio, fechaFin } = req.query;
    const filtro = {};
    const { Op } = require('sequelize');

    if (nombre) {
      filtro.NombreUsuario = { [Op.like]: `%${nombre}%` };
    }

    if (fechaInicio && fechaFin) {
      filtro.fechaInicio = { [Op.gte]: new Date(fechaInicio) };
      filtro.fechaFin = { [Op.lte]: new Date(fechaFin) };
    }

    const resultados = await Nomina.findAll({ where: filtro });

    return res.status(200).json({ data: resultados });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al consultar las nóminas' });
  }
};

const detallesNomina = async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    const { fechaInicio, fechaFin } = req.body;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: 'fechaInicio y fechaFin son requeridos' });
    }

    // Normalizamos fechas para Bogotá
    const inicioDate = moment.tz(fechaInicio, 'YYYY-MM-DD', 'America/Bogota').startOf('day').toDate();
    const finDate = moment.tz(fechaFin, 'YYYY-MM-DD', 'America/Bogota').endOf('day').toDate();

    // Buscamos usuario
    const usuario = await models.Usuarios.findByPk(idUsuario);
    const nombreUsuario = usuario ? `${usuario.nombres} ${usuario.apellidos || ''}`.trim() : '';

    // Traer reservas del rango
    const reservas = await models.Reservas.findAll({
      where: {
        IdUsuario: idUsuario,
        Fecha: { [Op.between]: [inicioDate, finDate] }
      },
      order: [['Fecha', 'ASC'], ['Hora', 'ASC']]
    });

    if (!reservas || reservas.length === 0) {
      return res.status(200).json({
        nombreUsuario,
        fechaInicio,
        fechaFin,
        filas: [],
        totales: { montoDia: 0, montoEmpleado: 0, montoEmpresa: 0 }
      });
    }

    // Obtenemos servicios de una sola vez para evitar N+1
    const servicioIds = [...new Set(reservas.map(r => r.IdServicio).filter(Boolean))];
    const servicios = await models.Servicios.findAll({ where: { id: servicioIds } });
    const serviciosMap = servicios.reduce((map, s) => {
      map[s.id] = s;
      return map;
    }, {});

    // Agrupamos por día exacto (UTC → Bogotá)
    const agrupado = {};
    for (const reserva of reservas) {
      const servicio = serviciosMap[reserva.IdServicio];
      const precio = servicio ? (Number(servicio.CostoServicio) || 0) : 0;
      const porcentajeEmpleado = servicio ? (Number(servicio.PorcentajeEmpleado ?? 50) || 50) : 50;

      const montoEmpleado = (precio * porcentajeEmpleado) / 100;
      const montoEmpresa = precio - montoEmpleado;

      // Fecha corregida a zona Bogotá
      const dia = moment.utc(reserva.Fecha).tz('America/Bogota').format('YYYY-MM-DD');

      if (!agrupado[dia]) {
        agrupado[dia] = {
          fecha: dia,
          montoDia: 0,
          montoEmpleado: 0,
          montoEmpresa: 0,
          detalles: []
        };
      }

      agrupado[dia].montoDia += precio;
      agrupado[dia].montoEmpleado += montoEmpleado;
      agrupado[dia].montoEmpresa += montoEmpresa;
      agrupado[dia].detalles.push({
        reservaId: reserva.id,
        idServicio: reserva.IdServicio,
        precio,
        porcentajeEmpleado,
        montoEmpleado,
        montoEmpresa
      });
    }

    // Ordenamos las filas
    const filas = Object.values(agrupado).sort((a, b) => a.fecha.localeCompare(b.fecha));

    // Totales
    const totalEmpleado = filas.reduce((sum, f) => sum + f.montoEmpleado, 0);
    const totalEmpresa = filas.reduce((sum, f) => sum + f.montoEmpresa, 0);
    const totalDia = filas.reduce((sum, f) => sum + f.montoDia, 0);

    return res.status(200).json({
      nombreUsuario,
      fechaInicio,
      fechaFin,
      filas,
      totales: {
        montoDia: totalDia,
        montoEmpleado: totalEmpleado,
        montoEmpresa: totalEmpresa
      }
    });

  } catch (error) {
    console.error('Error en detallesNomina:', error);
    return res.status(500).json({ message: 'Error al generar detalles de nómina' });
  }
};



// Agrega la nueva ruta al servidor
module.exports = {
    calcularNominaEmpleado: calcularNominaEmpleado,
    guardarservicio: guardarservicio,
    editarServicio: editarServicio,
    eliminarServicio: eliminarServicio,
    calcularMontoAbonado: calcularMontoAbonado,
    consultarNominas: consultarNominas,
    eliminarNomina: eliminarNomina,
    guardarNomina: guardarNomina,
    detallesNomina: detallesNomina
};
