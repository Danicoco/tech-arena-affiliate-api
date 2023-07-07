import { Router, Request, Response, NextFunction } from "express";
import v1 from "./modules/v1";
import { bodyHandler } from "./modules/common/utils";

const router = Router();

// Controllers
router.use("/v1", bodyHandler, v1);

router.use("/", (_req: Request, res: Response, _next: NextFunction) =>
  res.send("Welcome to WEBADGE API")
);

router.use("*", (_req: Request, res: Response, _next: NextFunction) =>
  res.send(`Unable to find the resources you're looking for.`)
);

export default router;
