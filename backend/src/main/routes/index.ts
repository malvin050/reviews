import express from "express";

import healthRouter from "./health";
import user from "./user";
import restaurant from "./restaurant";
import review from "./review";
import adminUserManagement from "./adminUserManagement";
import { isAuthenticated } from "../middlewares/authenticated";
import { isAuthorized } from "../middlewares/authorized";

const ROUTES_PREFIX = "/api";

const router = express.Router();

router.use(ROUTES_PREFIX, healthRouter);
router.use(ROUTES_PREFIX, user);
router.use(ROUTES_PREFIX, isAuthenticated, restaurant);
router.use(ROUTES_PREFIX, isAuthenticated, review);
router.use(
  ROUTES_PREFIX,
  isAuthenticated,
  isAuthorized({ hasRole: ["admin"] }),
  adminUserManagement
);

export default router;
