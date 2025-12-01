import CoffeeShopService from "../services/coffeeShop.service.js";

export const getCoffeeShops = async (req, res) => {
  const coffeeShops = await CoffeeShopService.getAll();
  res.status(200).json({ coffeeShops });
};

export const getCoffeeShopById = async (req, res) => {
  const { id } = req.params;
  const coffeeShop = await CoffeeShopService.getById(id);
  res.status(200).json({ coffeeShop });
};

export const createCoffeeShop = async (req, res) => {
  const coffeeShop = await CoffeeShopService.create(req.body);
  res.status(201).json({ message: "Successfully created", coffeeShop });
};

export const updateCoffeeShop = async (req, res) => {
  const { id } = req.params;
  const coffeeShop = await CoffeeShopService.update(id, req.body);
  res.status(200).json({ message: "Successfully updated", coffeeShop });
};

export const deleteCoffeeShop = async (req, res) => {
  const { id } = req.params;
  await CoffeeShopService.delete(id);
  res.status(204).send();
};
