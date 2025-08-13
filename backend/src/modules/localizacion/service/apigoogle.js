const axios = require('axios');

if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.warn('[WARN] Falta GOOGLE_MAPS_API_KEY en variables de entorno');
}

const geocodingClient = axios.create({
    baseURL: 'https://maps.googleapis.com/maps/api/geocode/',
    params: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        // language: 'es',
        // region: 'pe',
    },
    timeout: 10000,
});

module.exports = geocodingClient;
