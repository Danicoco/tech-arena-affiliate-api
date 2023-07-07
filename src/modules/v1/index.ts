import { Router } from "express";

import subscriberRouter from "./subscribers/route";
import adminRoutes from "./admins/route";
import mailRoutes from "./mails/route";

const router = Router();

router.use("/subscribers", subscriberRouter);
router.use("/admins", adminRoutes);
router.use("/mails", mailRoutes);

export default router;
