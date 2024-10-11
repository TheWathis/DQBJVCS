// server/placesService.js
import axios from 'axios';

export const fetchNearbyBars = async (longitude, latitude, radius, limit) => {

    const config = useRuntimeConfig();
    const API_KEY = config.public.geoapifyPlacesApiKey;

    const url = `https://api.geoapify.com/v2/places?categories=catering.bar,catering.pub&filter=circle:${longitude},${latitude},${radius}&limit=${limit}&apiKey=${API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching nearby bars:', error);
        throw error;
    }
};