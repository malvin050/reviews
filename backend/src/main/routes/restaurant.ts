import express from "express";
import { isAuthorized } from "../middlewares/authorized";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurant,
  getRestaurants,
  updateRestaurant,
} from "../services/restaurant";

const ROUTES_PREFIX = "/restaurant";
const router = express.Router();

router.get(ROUTES_PREFIX, async (req, res) => {
  try {
    const docs = await getRestaurants();
    return res.status(200).json({ data: { restaurants: docs } });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

router.get(ROUTES_PREFIX + "/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await getRestaurant(id);
    return res.status(200).json({ data: { restaurants: [doc] } });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

router.post(
  ROUTES_PREFIX,
  isAuthorized({ hasRole: ["admin"] }),
  async (req, res) => {
    try {
      const { name, address, city, state, zipCode, image } = req.body;
      if (!name || !address || !city || !state || !zipCode || !image) {
        return res.status(400).send({ message: "Missing fields" });
      }
      const id = await createRestaurant({
        name,
        address,
        city,
        state,
        zipCode,
        image,
      });
      return res.status(201).json({ id });
    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ error: `${err.code} - ${err.message}` });
    }
  }
);

router.delete(ROUTES_PREFIX + "/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteRestaurant(id);
    return res.status(200).json({ message: "deleted" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

router.patch(
  ROUTES_PREFIX + "/:id",
  isAuthorized({ hasRole: ["admin"] }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address, city, state, zipCode, image } = req.body;
      if (!name && !address && !city && !state && !zipCode && !image) {
        return res.status(400).send({ message: "Missing fields" });
      }
      await updateRestaurant(id, {
        name,
        address,
        city,
        state,
        zipCode,
        image,
      });
      return res.status(200).json({ message: "updated" });
    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ error: `${err.code} - ${err.message}` });
    }
  }
);

export default router;
