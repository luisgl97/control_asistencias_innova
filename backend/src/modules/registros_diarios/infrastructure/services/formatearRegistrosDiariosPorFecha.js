const moment = require("moment");
require("moment/locale/es");
moment.locale("es");

function formatearRegistros(registros) {
    
  const porObraDia = new Map(); // obraId|YYYY-MM-DD -> { tareas:Set, items:[] }

  registros.forEach((r) => {
    // Si r.fecha ya es YYYY-MM-DD no habrá problemas
    const diaKey = moment(r.fecha, "YYYY-MM-DD").format("YYYY-MM-DD");
    const key = `${r.obra.id}|${diaKey}`;

    if (!porObraDia.has(key)) {
      porObraDia.set(key, { tareas: new Set(), items: [] });
    }
    const bucket = porObraDia.get(key);
    bucket.tareas.add(r.descripcion_tarea || "");
    bucket.items.push(r);
  });

  const salida = [];

  porObraDia.forEach((bucket, key) => {
    const [, diaKey] = key.split("|");
   
    // Agrupar por descripción_tarea
    const porDescripcion = new Map();
    bucket.items.forEach((r) => {
      const d = r.descripcion_tarea || "";
      if (!porDescripcion.has(d)) porDescripcion.set(d, []);
      porDescripcion.get(d).push(r);
    });

    porDescripcion.forEach((itemsDeTarea, descripcion) => {
      const trabajadores = itemsDeTarea.map((reg) => ({
        id: reg.usuario.id,
        dni: reg.usuario.dni,
        tipo_documento: reg.usuario.tipo_documento,
        nombres: reg.usuario.nombres,
        apellidos: reg.usuario.apellidos,
        rol: reg.usuario.rol,
        cargo: reg.usuario.cargo
      }));

      salida.push({
        obra: {
          id: itemsDeTarea[0].obra.id,
          nombre: itemsDeTarea[0].obra.nombre,
        },
        dia: moment(diaKey, "YYYY-MM-DD").format("YYYY-MM-DD"),
        nro_trabajadores_asignados: trabajadores.length,
        tarea_descripcion: descripcion,
        trabajadores,
      });
    });
  });

  return salida;
}

module.exports = { formatearRegistros };
