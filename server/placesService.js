import axios from "axios";

/**
 * Fetches nearby bars from Overpass API
 * @param {float} longitude Longitude of the center of the circle
 * @param {float} latitude Latitude of the center of the circle
 * @param {int} radius Radius of the circle in meters
 * @param {int} limit Number of bars to return
 * @returns List of bars
 */
export const fetchNearbyBars = async (longitude, latitude, radius, limit) => {
  const overpassUrl = `https://overpass-api.de/api/interpreter`;
  const query = `
        [out:json][timeout:25];
        (
          node["amenity"="bar"](around:${radius},${latitude},${longitude});
          node["amenity"="pub"](around:${radius},${latitude},${longitude});
        );
        out body;
        >;
        out skel qt;
    `;

  try {
    const response = await axios.post(
      overpassUrl,
      `data=${encodeURIComponent(query)}`,
    );
    const bars = response.data.elements.slice(0, limit);
    return bars;
  } catch (error) {
    console.error("Error fetching nearby bars:", error);
    throw error;
  }
};

/**
 * Fetches bars by address using Nominatim and Overpass API
 * @param {String} address City name
 * @param {int} limit Number of bars to return
 * @returns List of bars
 */
export const fetchBarsByAddress = async (address, limit) => {
  const nominatimUrl = `https://nominatim.openstreetmap.org/search`;
  const params = {
    q: address,
    format: "json",
    addressdetails: 1,
    limit: 1,
  };

  try {
    const response = await axios.get(nominatimUrl, { params });
    if (response.data.length === 0) {
      throw new Error("No results found for the given address");
    }

    const longitude = response.data[0].lon;
    const latitude = response.data[0].lat;

    return fetchNearbyBars(longitude, latitude, 1000, limit);
  } catch (error) {
    console.error("Error fetching bars by address:", error);
    throw error;
  }
};
