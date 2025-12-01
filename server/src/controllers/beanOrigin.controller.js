import BeanOriginService from "../services/beanOrigin.service.js";

export const getBeanOrigins = async (req, res) => {
  const beans = await BeanOriginService.getAll();
  res.status(200).json({ beans });
};

export const getBeanOriginById = async (req, res) => {
  const { id } = req.params;
  const bean = await BeanOriginService.getById(id);
  res.status(200).json({ bean });
};

export const createBeanOrigin = async (req, res) => {
  const bean = await BeanOriginService.create(req.body);
  res.status(201).json({ message: "Successfully created.", bean });
};

export const updateBeanOrigin = async (req, res) => {
  const { id } = req.params;
  const bean = await BeanOriginService.update(id, req.body);
  res.status(200).json({ message: "Successfully updated.", bean });
};

export const deleteBeanOrigin = async (req, res) => {
  const { id } = req.params;
  await BeanOriginService.delete(id);
  res.status(204).send();
};
