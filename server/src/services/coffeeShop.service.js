import CoffeeShopModel from "../models/coffeeShop.model.js";

class CoffeeShopService {
  static async getAll() {
    return await CoffeeShopModel.find();
  }
}

export default CoffeeShopService;
