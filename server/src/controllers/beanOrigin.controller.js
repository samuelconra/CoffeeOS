import BeanOriginService from "../services/beanOrigin.service.js";

export const getBeanOrigins = async (req, res) => {
  const beans = await BeanOriginService.getAll();
  res.status(200).json({ beans });
};
