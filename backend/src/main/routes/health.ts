import express from "express";

const router = express.Router();

router.use("/health", (req, res) => {
  res.send({ status: "UP" });
});

export default router;
