import UserModel from "../models/user.model.js";

class UserService {
  static async getAll() {
    return await UserModel.find();
  }
}

export default UserService;
