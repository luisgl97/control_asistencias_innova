const validarTarea = (tarea,obraSeleccionada ) => {
    if(!obraSeleccionada ){
        return { valido: false, mensaje: "Debe seleccionar una obra." };
    }
    if (!tarea.descripcion || tarea.descripcion.trim() === "") {
        return { valido: false, mensaje: "La descripción de la tarea no puede estar vacía." };
    }

    if (!Array.isArray(tarea.trabajadores) || tarea.trabajadores.length === 0) {
        return { valido: false, mensaje: "Debe asignar al menos un trabajador a la tarea." };
    }

    return { valido: true, mensaje: "La tarea es válida." };
}

export default validarTarea;
