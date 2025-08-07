// geocodingClient.js
import axios from 'axios';

const geocodingClient = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode/',
  params: {
    key:  import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }
});

export default geocodingClient;
