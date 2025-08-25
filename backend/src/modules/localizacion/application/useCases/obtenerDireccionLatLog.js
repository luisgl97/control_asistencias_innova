const geocodingClient = require('../../service/apigoogle');

module.exports = async (lat, lng) => {
    try {
        // ?? hacemos la peticion pasando la latitud y longitud
        const response = await geocodingClient.get('json', {
            params: { latlng: `${lat},${lng}` },
        });

        const { status, results, error_message } = response.data;

        // ?? si la peticion es correcta
        if (status === 'OK' && results?.length) {
            const { formatted_address: direccion } = results[0];
            return { codigo: 200, respuesta: { mensaje: 'ok', direccion, lat, lng } };
        }
        // ?? si la peticion es incorrecta
        if (status === 'ZERO_RESULTS') {
            return { codigo: 404, respuesta: { mensaje: 'sin resultados', direccion: null, lat: null, lng: null } };
        }
        // ?? si la peticion es incorrecta
        return { codigo: 400, respuesta: { mensaje: `error (${status}) ${error_message || ''}`, direccion: null, lat: null, lng: null } };
    } catch (err) {
        console.error('useCase error:', err?.message);
        return { codigo: 500, respuesta: { mensaje: 'error interno', detalle: err?.message } };
    }
};
