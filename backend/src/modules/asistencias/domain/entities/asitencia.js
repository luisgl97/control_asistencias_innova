class Asistecia {
    constructor({
        usuario_id,
        fecha,
        hora_ingreso,
        hora_salida,
        ubicacion_ingreso,
        ubicacion_salida,
        horas_extras,
        observaciones_ingreso,
        observaciones_salida,
    }) {
        this.usuario_id = usuario_id;
        this.fecha = fecha;
        this.hora_ingreso = hora_ingreso;
        this.hora_salida = hora_salida;
        this.ubicacion_ingreso = ubicacion_ingreso;
        this.ubicacion_salida = ubicacion_salida;
        this.horas_extras = horas_extras;
        this.observaciones_ingreso = observaciones_ingreso;
        this.observaciones_salida = observaciones_salida;
    }

    static crearAsistencia({
        usuario_id,
        fecha,
        hora_ingreso,
        hora_salida,
        ubicacion_ingreso,
        ubicacion_salida,
        horas_extras,
        observaciones_ingreso,
        observaciones_salida,
    }) {
        return new Asistecia({
            usuario_id,
            fecha,
            hora_ingreso,
            hora_salida,
            ubicacion_ingreso,
            ubicacion_salida,
            horas_extras,
            observaciones_ingreso,
            observaciones_salida,
        });
    }
    static validarCamposObligatorios(modo = "crear") {
        if (modo == "crear") {
            if (
                !this.usuario_id ||
                !this.fecha ||
                !this.hora_ingreso ||
                !this.hora_salida ||
                !this.ubicacion_ingreso ||
                !this.ubicacion_salida ||
                !this.horas_extras
            ) {
                throw new Error(
                    "Los campos usuario_id, fecha, hora_ingreso, hora_salida, ubicacion_ingreso, ubicacion_salida y horas_extras son obligatorios"
                );
            }
            if (!this.observaciones_ingreso || !this.observaciones_salida) {
                throw new Error(
                    "Los campos observaciones_ingreso y observaciones_salida son obligatorios"
                );
            }
        }
    }
}

module.exports = Asistecia;
