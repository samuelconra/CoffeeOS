import AuthService from "../services/auth.service.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  const data = await AuthService.login(email, password);
  res.status(200).json({ message: "Successfully logged in", ...data });
};

export const register = async (req, res) => {
  const user = await AuthService.register(req.body);
  res.status(201).json({ message: "User registered successfully", user });
};
