import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

class AuthService {
  static async login(email, password) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError("Invalid Credentials.", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid Credentials.", 401);
    }

    return this.generateToken(user);
  }

  static async register(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError("Email already in use.", 409);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return userResponse;
  }

  static generateToken(user) {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" },
    );

    return {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
      },
      token,
    };
  }
}

export default AuthService;
