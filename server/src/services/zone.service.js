import Zone from "../models/zone.model.js";
import AppError from "../utils/AppError.js";

class ZoneService {
  static async getAll() {
    return await Zone.find();
  }

  static async create(data) {
    return await Zone.create(data);
  }

  static async delete(id) {
    const zone = await Zone.findByIdAndDelete(id);
    if (!zone) {
      throw new AppError("Zone not found.", 404);
    }
    return zone;
  }
}

export default ZoneService;