import BeanOriginModel from "../models/beanOrigin.model.js";

class BeanOriginService {
  static async getAll() {
    return await BeanOriginModel.find().populate("coffeeShopId", "name slug");
  }
}

export default BeanOriginService;
