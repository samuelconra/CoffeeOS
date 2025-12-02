import api from "./axios";

// --- Coffee Shops ---
export const getCoffeeShops = async () => {
  const response = await api.get("/coffee-shops");
  return response.data.coffeeShops;
};

export const createCoffeeShop = async (data) => {
  const response = await api.post("/coffee-shops", data);
  return response.data.coffeeShop;
};

export const updateCoffeeShop = async ({ id, data }) => {
  const response = await api.patch(`/coffee-shops/${id}`, data);
  return response.data.coffeeShop;
};

export const deleteCoffeeShop = async (id) => {
  await api.delete(`/coffee-shops/${id}`);
  return id;
};

// --- Bean Origins ---
export const getBeanOrigins = async () => {
  const response = await api.get("/beans");
  return response.data.beans;
};

export const createBeanOrigin = async (data) => {
  const response = await api.post("/beans", data);
  return response.data.bean;
};

export const updateBeanOrigin = async ({ id, data }) => {
  const response = await api.patch(`/beans/${id}`, data);
  return response.data.bean;
};

export const deleteBeanOrigin = async (id) => {
  await api.delete(`/beans/${id}`);
  return id;
};

// --- Zones ---
export const getZones = async () => {
  const response = await api.get("/zones");
  return response.data.zones;
};

export const createZone = async (data) => {
  const response = await api.post("/zones", data);
  return response.data.zone;
};

export const deleteZone = async (id) => {
  await api.delete(`/zones/${id}`);
  return id;
};
