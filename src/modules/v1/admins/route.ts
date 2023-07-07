import { Router } from "express";
import { create, login } from "./controller";
import { createSchema, loginSchema } from "./validation";
import { validator } from "../../common/utils";

const adminRoutes = Router();

adminRoutes.post('/', validator.body(createSchema), create);
adminRoutes.post('/login', validator.body(loginSchema), login);

export default adminRoutes;
