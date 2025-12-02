import api from "./axios";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const signupUser = async (username, fullName, email, password) => {
  const response = await api.post("/auth/register", { fullName, email, password, username });
  return response.data;
};
