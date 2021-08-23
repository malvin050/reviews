import express from "express";
import { createUser } from "../services/user";

const ROUTES_PREFIX = "/auth";
const router = express.Router();

router.post(ROUTES_PREFIX + "/signUp", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).send({ message: "Missing fields" });
    }
    const id = await createUser({ email, password, role: "user" });
    return res.status(201).send({ id });
  } catch (err) {
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

export default router;
