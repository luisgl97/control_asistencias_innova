function formatearRegistros(registros) {
  // Agrupar por (obra_id + fecha)
  const grupos = new Map();

  for (const r of registros) {
    const key = `${r.obra_id}__${r.fecha}`;
    if (!grupos.has(key)) {
      grupos.set(key, {
        obra: { id: r.obra.id, nombre: r.obra.nombre },
        dia: r.fecha.split("-").reverse().join("-"), // "YYYY-MM-DD" -> "DD-MM-YYYY"
        tareasMap: new Map(), // descripcion -> { descripcion, trabajadores: [] }
        trabajadoresSet: new Set(), // para contar únicos
      });
    }

    const g = grupos.get(key);

    // Acumular tarea por descripción
    const desc = r.descripcion_tarea || "Sin descripción";
    if (!g.tareasMap.has(desc)) {
      g.tareasMap.set(desc, { descripcion: desc, trabajadores: [] });
    }

    // Armar trabajador
    const trabajador = {
      nombre: `${r.usuario.nombres} ${r.usuario.apellidos}`.trim(),
      dni: r.usuario.dni,
    };

    // Agregar a la tarea
    g.tareasMap.get(desc).trabajadores.push(trabajador);

    // Llevar conteo de trabajadores únicos (por DNI + nombre para seguridad)
    g.trabajadoresSet.add(`${trabajador.dni}::${trabajador.nombre}`);
  }

  // Construir salida
  const salida = [];
  for (const [, g] of grupos) {
    const tareas = Array.from(g.tareasMap.values());
    salida.push({
      obra: g.obra,
      dia: g.dia,
      nro_tareas: tareas.length,
      nro_trabajadores_asignados: g.trabajadoresSet.size,
      tareas,
    });
  }

  return salida;
}

module.exports = {
    formatearRegistros
}