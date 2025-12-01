import UserService from "../services/user.service.js";

export const getUsers = async (req, res) => {
  const users = await UserService.getAll();
  res.status(200).json({ users });
};
