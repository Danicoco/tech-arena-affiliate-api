/** @format */

import { NextFunction, Request, Response } from "express"

import { success } from "../../common/utils"
import SubscriberService from "./service"
import { ISubscriber } from "../../../types"
import MailService from "../mails/service"
import { sendTemplateMail } from "../../common/notification/email"
import freelancerWelcome from "../../common/emails/welcome"

const { BUSINESS_NAME, OWNERS_NAME } = process.env;

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const mails = await new MailService("", "", req.body.type).count()
        const subscriber = await new SubscriberService().create({
            ...req.body,
            cycle: 1,
            totalCycle: mails,
        })
        sendTemplateMail({
            to: [subscriber.email],
            subject: `Welcome ${
                subscriber.fullName.split(" ")[0]
            }! Let's start your journey  🎉`,
            content: freelancerWelcome({
                businessName: String(BUSINESS_NAME),
                ownersName: String(OWNERS_NAME),
                fullName: subscriber.fullName
            })
        })
        return res
            .status(201)
            .json(success("Subscriber created succesfully", subscriber))
    } catch (error) {
        next(error)
    }
}

// update account
export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await new SubscriberService(req.params._id).update(
            req.body
        )
        return res.status(200).json(success("Subscription updated", result))
    } catch (error) {
        next(error)
    }
}

export const fetch = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { page = 1, limit = 10 } = req.query
    try {
        const subscribers = await new SubscriberService().findAll(
            page as number,
            limit as number,
            req.query as unknown as ISubscriber
        )
        return res.status(200).json(success("Records retrieved", subscribers))
    } catch (error) {
        next(error)
    }
}
