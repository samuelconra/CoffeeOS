import CoffeeShop from "../models/coffeeShop.model.js";
import AppError from "../utils/AppError.js";

class CoffeeShopService {
  static async getAll() {
    return await CoffeeShop.find();
  }

  static async getById(id) {
    const shop = await CoffeeShop.findById(id);
    if (!shop) {
      throw new AppError("Coffee Shop not found.", 404);
    }
    return shop;
  }

  static async create(data) {
    return await CoffeeShop.create(data);
  }

  static async update(id, data) {
    const shop = await CoffeeShop.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!shop) {
      throw new AppError("Coffee Shop not found.", 404);
    }
    return shop;
  }

  static async delete(id) {
    const shop = await CoffeeShop.findByIdAndDelete(id);
    if (!shop) {
      throw new AppError("Coffee Shop not found.", 404);
    }
    return shop;
  }
}

export default CoffeeShopService;
