const Obra = require("../domain/entities/obra");

module.exports = async (obraData, obraRepository) => {

     const { success, message: error } = Obra.validarCamposObligatorios(obraData, modo="crear");
  if (!success)
    return {
      codigo: 400,
      respuesta: {
        mensaje: error,
        estado: false,
      },
    };


    const obra = await obraRepository.crear(obraData); 
      
    return {
        codigo: 201,
        respuesta: {
            mensaje: "Obra registrada exitosamente",
            estado: true,
            obra: obra,
        },
    };
} 