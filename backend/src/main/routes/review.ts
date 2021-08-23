import { isFuture } from "date-fns";
import express from "express";
import {
  createReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../services/review";

const ROUTES_PREFIX = "/restaurant/:restaurantId/review";
const router = express.Router();

router.get(ROUTES_PREFIX, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const docs = await getReviews(restaurantId);
    return res.status(200).json({ data: { reviews: docs } });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

router.post(ROUTES_PREFIX, async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { visitDate, rating, comment } = req.body;
    if (!restaurantId || !visitDate || !rating || !comment) {
      return res.status(400).send({ message: "Missing fields" });
    }

    if (isFuture(new Date(visitDate))) {
      return res.status(400).send({ message: "Date cannot be in the future" });
    }

    const id = await createReview({
      restaurantId,
      visitDate,
      rating,
      comment,
    });
    return res.status(201).json({ id });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

router.get(ROUTES_PREFIX + "/:reviewId", async (req, res) => {
  try {
    const { restaurantId, reviewId } = req.params;

    const review = await getReview(restaurantId, reviewId);
    return res.status(200).json({ data: { reviews: [review] } });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

router.delete(ROUTES_PREFIX + "/:reviewId", async (req, res) => {
  try {
    const { restaurantId, reviewId } = req.params;

    await deleteReview(restaurantId, reviewId);
    return res.status(200).json({ message: "deleted" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

router.patch(ROUTES_PREFIX + "/:reviewId", async (req, res) => {
  try {
    const { restaurantId, reviewId } = req.params;
    const { visitDate, rating, comment } = req.body;
    await updateReview(restaurantId, reviewId, { visitDate, rating, comment });
    return res.status(200).json({ message: "updated" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

export default router;
