import ZoneService from "../services/zone.service.js";

export const getZones = async (req, res) => {
  const zones = await ZoneService.getAll();
  res.status(200).json({ zones });
};

export const createZone = async (req, res) => {
  const zone = await ZoneService.create(req.body);
  res.status(201).json({ message: "Zone created successfully", zone });
};

export const deleteZone = async (req, res) => {
  const { id } = req.params;
  await ZoneService.delete(id);
  res.status(204).send();
};