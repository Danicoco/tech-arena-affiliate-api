/** @format */

import { Router } from "express"

import {
    createSchema,
    fetchSchema
} from "./validation"
import {
    update,
    create,
    fetch,
} from "./controller"
import { Authenticate, validator } from "../../common/utils"

const subscriberRouter = Router({
    caseSensitive: true,
    strict: true,
})

subscriberRouter.post("/create", validator.body(createSchema), create)

subscriberRouter.post("/update", validator.body(createSchema), update);

subscriberRouter.get("/fetch", Authenticate, validator.query(fetchSchema), fetch)


export default subscriberRouter
