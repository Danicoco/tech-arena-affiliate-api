import { Router } from "express";
import { addMailToCycle, composeCycledMails, sendCycledMails, sendMail } from "./controller";
import { validator } from "../../common/utils";
import { sendMailSchema } from "./validation";

const mailRoutes = Router();

mailRoutes.post('/send', validator.body(sendMailSchema), sendMail);
mailRoutes.post('/schedule-cycle', validator.body(sendMailSchema), addMailToCycle);
mailRoutes.post('/compose-cycle', composeCycledMails);
mailRoutes.post('/send-cycle', sendCycledMails);

export default mailRoutes;
