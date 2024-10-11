// server/placesService.js
import axios from 'axios';

/**
 * Fetches nearby bars from Geoapify Places API
 * @param {float} longitude Longitude of the center of the circle
 * @param {float} latitude Latitude of the center of the circle
 * @param {int} radius Radius of the circle in meters
 * @param {int} limit Number of bars to return
 * @returns List of bars
 */
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

/**
 * Fetches bars by address from Geoapify Places API
 * @param {String} address City name
 * @param {int} limit Number of bars to return
 * @returns List of bars
 */
export const fetchBarsByAddress = async (address, limit) => {
    const config = useRuntimeConfig();
    const API_KEY = config.public.geoapifyPlacesApiKey;

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${address}&format=json&apiKey=${API_KEY}`;

    try {
        const response = await axios.get(url);
        console.log('response:', response);

        const longitude = response.data.results[0].lon;
        const latitude = response.data.results[0].lat;

        return fetchNearbyBars(longitude, latitude, 3000, limit);
    } catch (error) {
        console.error('Error fetching bars by address:', error);
        throw error;
    }
};