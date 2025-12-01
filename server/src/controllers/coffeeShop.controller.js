import CoffeeShopService from "../services/coffeeShop.service.js";

export const getCoffeeShops = async (req, res) => {
  const coffeeShops = await CoffeeShopService.getAll();
  res.status(200).json({ coffeeShops });
};
