import express, { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "../services/user";

const ROUTES_PREFIX = "/user";
const router = express.Router();

router.post(ROUTES_PREFIX, async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!password || !email) {
      return res.status(400).send({ message: "Missing fields" });
    }
    const uid = await createUser({ email, password, role: role || "user" });
    return res.status(201).send({ uid });
  } catch (err) {
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

router.get(ROUTES_PREFIX, async (req: Request, res: Response) => {
  try {
    const { nextPageToken } = req.body;
    const users = await listUsers(nextPageToken);
    return res.status(200).send({ data: { users } });
  } catch (err) {
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

router.patch(ROUTES_PREFIX + "/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password, role } = req.body;
    if (!password && !email && !role) {
      return res.status(400).send({ message: "Missing fields" });
    }
    await updateUser(id, { email, password, role });
    return res.status(200).send({ message: "updated" });
  } catch (err) {
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

router.delete(ROUTES_PREFIX + "/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    return res.status(200).send({ message: "deleted" });
  } catch (err) {
    return res.status(400).json({ error: `${err.code} - ${err.message}` });
  }
});

export default router;
