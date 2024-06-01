// Importa moment.js para manipular las fechas
const moment = require('moment-timezone'); // Asegúrate de utilizar moment-timezone
const { where } = require('sequelize');
const models = require('../models');
const { Op } = require('sequelize');

// Configura Moment.js para la zona horaria de Hawaii
moment.tz.setDefault('Pacific/Honolulu'); 

// Función para calcular la nómina del empleado
function calcularNomina(idUsuario) {
    // Obtiene el primer día del mes actual en la zona horaria configurada
    const primerDiaMes = moment().startOf('month');
    
    // Calcula las fechas de inicio y fin de la primera quincena
    const quincena1Inicio = primerDiaMes;
    const quincena1Fin = primerDiaMes.clone().add(14, 'days').endOf('day'); // 15 días después del primer día del mes
    
    // Calcula las fechas de inicio y fin de la segunda quincena
    const quincena2Inicio = primerDiaMes.clone().add(15, 'days');
    const quincena2Fin = primerDiaMes.clone().endOf('month'); // Último día del mes actual

    // Obtén las reservas del usuario para la primera quincena
    const primeraQuincena = models.Reservas.findAll({
        attributes: ['MontoAbonado'],
        where: {
            IdUsuario: idUsuario,
            Fecha: {
                [Op.between]: [quincena1Inicio.format('YYYY-MM-DD'), quincena1Fin.format('YYYY-MM-DD')]
            }
        }
    });

    // Obtén las reservas del usuario para la segunda quincena
    const segundaQuincena = models.Reservas.findAll({
        attributes: ['MontoAbonado'],
        where: {
            IdUsuario: idUsuario,
            Fecha: {
                [Op.between]: [quincena2Inicio.format('YYYY-MM-DD'), quincena2Fin.format('YYYY-MM-DD')]
            }
        }
    });

    // Realiza las consultas de manera paralela
    return Promise.all([primeraQuincena, segundaQuincena]).then(([reservasPrimeraQuincena, reservasSegundaQuincena]) => {
        // Suma los MontoAbonado de las reservas de cada quincena
        const totalPrimeraQuincena = reservasPrimeraQuincena.reduce((total, reserva) => total + reserva.MontoAbonado, 0);
        const totalSegundaQuincena = reservasSegundaQuincena.reduce((total, reserva) => total + reserva.MontoAbonado, 0);

        // Calcula la mitad del total de cada quincena (la empresa se queda con el 50%)
        const montoPrimeraQuincena = totalPrimeraQuincena * 0.5;
        const montoSegundaQuincena = totalSegundaQuincena * 0.5;

        // Devuelve el resultado
        return {
            quincena1: {
                inicio: quincena1Inicio.format('YYYY-MM-DD'),
                fin: quincena1Fin.format('YYYY-MM-DD'),
                montoEmpleado: montoPrimeraQuincena
            },
            quincena2: {
                inicio: quincena2Inicio.format('YYYY-MM-DD'),
                fin: quincena2Fin.format('YYYY-MM-DD'),
                montoEmpleado: montoSegundaQuincena
            }
        };
    }).catch(error => {
        // Manejo de errores
        console.error("Error al calcular la nómina:", error);
        throw error;
    });
}

// Endpoint para calcular la nómina
function calcularNominaEmpleado(req, res) {
    const idUsuario = req.params.idUsuario;

    // Calcula la nómina llamando a la función
    calcularNomina(idUsuario).then(result => {
        res.status(200).json({
            message: "Cálculo de nómina exitoso!",
            quincena1: result.quincena1,
            quincena2: result.quincena2
        });
    }).catch(error => {
        res.status(500).json({
            message: "Error al calcular la nómina",
            error: error
        });
    });
}

const calcularMontoAbonado = async (req, res) => {
  try {
    // Utiliza la zona horaria de Hawaii
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
        CostoServicio: req.body.CostoServicio
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
        CostoServicio: req.body.CostoServicio
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

// Agrega la nueva ruta al servidor
module.exports = {
    calcularNominaEmpleado: calcularNominaEmpleado,
    guardarservicio: guardarservicio,
    editarServicio: editarServicio,
    eliminarServicio: eliminarServicio,
    calcularMontoAbonado: calcularMontoAbonado
};
