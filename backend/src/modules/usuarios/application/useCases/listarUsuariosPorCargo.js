// Listar usuarios por cargo
module.exports = async (cargo, usuarioRepository) => {
  // Llamar al repositorio para obtener los usuarios por cargo
  const usuariosPorCargo = await usuarioRepository.listarUsuariosPorCargo(
    cargo
  );

  return {
    codigo: 200,
    respuesta: {
      mensaje:
        usuariosPorCargo.length === 0
          ? "No se encontraron usuarios para el cargo especificado"
          : "Usuarios encontrados por cargo",
      estado: true,
      datos: usuariosPorCargo,
    },
  };
};
