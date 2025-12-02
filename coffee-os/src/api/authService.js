import api from "./axios";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const signupUser = async (fullName, email, password, username) => {
  const response = await api.post("/auth/register", { fullName, email, password, username });
  return response.data;
};
