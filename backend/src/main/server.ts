import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";

import "./config";
import routes from "./routes";

const app = express();

// middlewares
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

// apply routes
app.use(routes);

// error handling
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send("Unexpected error");
});

export default app;
