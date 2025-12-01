import BeanOrigin from "../models/beanOrigin.model.js";
import CoffeeShop from "../models/coffeeShop.model.js";
import AppError from "../utils/AppError.js";

class BeanOriginService {
  static async getAll() {
    return await BeanOrigin.find().populate("coffeeShopId", "name slug");
  }

  static async getById(id) {
    const bean = await BeanOrigin.findById(id).populate(
      "coffeeShopId",
      "name slug",
    );
    if (!bean) {
      throw new AppError("Bean not found.", 404);
    }
    return bean;
  }

  static async create(data) {
    const shopExists = await CoffeeShop.findById(data.coffeeShopId);
    if (!shopExists) {
      throw new AppError("Coffee Shop not found.", 404);
    }

    return await BeanOrigin.create(data);
  }

  static async update(id, data) {
    if (data.coffeeShopId) {
      const shopExists = await CoffeeShop.findById(data.coffeeShopId);
      if (!shopExists) {
        throw new AppError("Coffee Shop not found.", 404);
      }
    }

    const bean = await BeanOrigin.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!bean) {
      throw new AppError("Bean not found.", 404);
    }
    return bean;
  }

  static async delete(id) {
    const bean = await BeanOrigin.findByIdAndDelete(id);
    if (!bean) {
      throw new AppError("Bean not found.", 404);
    }
    return bean;
  }
}

export default BeanOriginService;
