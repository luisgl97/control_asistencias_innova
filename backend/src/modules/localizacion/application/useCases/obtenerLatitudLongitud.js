const geocodingClient = require('../../service/apigoogle');

module.exports = async (direccion) => {
    try {
        // ?? si la direccion no existes
        if (!direccion) {
            return { codigo: 400, respuesta: { mensaje: 'direccion requerida', lat: null, lng: null } };
        }

        // ?? hacemos la peticion pasando la direccion
        const response = await geocodingClient.get('json', {
            params: { address: direccion },
        });

        const { status, results, error_message } = response.data;

        // ?? si la peticion es correcta
        if (status === 'OK' && results?.length) {
            const { lat, lng } = results[0].geometry.location;
            return { codigo: 200, respuesta: { mensaje: 'ok', lat, lng } };
        }
        // ?? si la peticion es incorrecta
        if (status === 'ZERO_RESULTS') {
            return { codigo: 404, respuesta: { mensaje: 'sin resultados', lat: null, lng: null } };
        }
        // ?? si la peticion es incorrecta
        return { codigo: 400, respuesta: { mensaje: `error (${status}) ${error_message || ''}`, lat: null, lng: null } };
    } catch (err) {
        console.error('useCase error:', err?.message);
        return { codigo: 500, respuesta: { mensaje: 'error interno', detalle: err?.message } };
    }
};
