// src/api/LocationApi.js
export async function request(endpoint) {
  const base = import.meta.env.VITE_LOCATION_API_BASE;
  const key = import.meta.env.VITE_LOCATION_API_KEY;

  if (!base || !key) throw new Error("API base or key not set in .env");

  const url = `${base.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const res = await fetch(url, { headers: { "x-api-key": key } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.results || data;
}

export async function validateApiKey() {
  try {
    await request("countries/");
    return { valid: true };
  } catch (e) {
    return { valid: false, reason: e.message };
  }
}

export const LocationAPI = {
  getCountries: () => request("countries/"),
  getStates: (countryId) => request(`states/${countryId}/`),
  getDistricts: (stateId) => request(`districts/${stateId}/`),
  getCities: (districtId) => request(`cities/${districtId}/`),
  getLocalities: (cityId) => request(`localities/${cityId}/`),
};
