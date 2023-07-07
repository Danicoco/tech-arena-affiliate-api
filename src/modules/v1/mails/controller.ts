import { Request, Response, NextFunction } from "express"
import SubscriberService from "../subscribers/service";
import { groupBy, success } from "../../common/utils";
import MailService from "./service";
import { sendTemplateMail } from "../../common/notification/email";
import SubscriberMailService from "../subscriberMails/service";
import { ISubscriberMail } from "../../../types";

export const sendMail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { subject, content, subscriptionType } = req.body;
    try {
        const subs = await new SubscriberService('', '', subscriptionType).getAll();
        const emails = subs.map(sub => sub.email);
        const params = {
            to: emails,
            subject,
            content,
        }
        await sendTemplateMail(params);

        const mails = await new MailService().create({
            date: new Date(),
            content,
            subject,
            subscriptionType,
            sent: true
        });
        return res.status(200).json(
            success('Mail sent successfully', mails),
        )
    } catch (error) {
        next(error);
    }
}

// export const scheduleMail = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { subject, content, subscriptionType, date } = req.body;
//     try {
//         const [mail, subscribers] = await Promise.all([
//             new MailService().create({
//                 date,
//                 content,
//                 subject,
//                 sent: false,
//                 subscriptionType,
//             }),
//             new SubscriberService('', '', subscriptionType).getAll(),
//         ]);

//         if (subscribers.length) {
//             const emails = subscribers.map(sub => sub.email);
//             const params = {
//                 to: emails,
//                 subject,
//                 content,
//                 delieveryTime: new Date(date)
//             }
//             await sendTemplateMail(params);

//             await new MailService(mail._id).update({ sent: true });
//         }

//         return res.status(200).json(
//             success('Mail sent successfully', mail),
//         )
//     } catch (error) {
//         next(error);
//     }
// }

export const addMailToCycle = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { subject, content, subscriptionType, cycle } = req.body;
    try {
        const mail = await new MailService().create({
            cycle,
            content,
            subject,
            subscriptionType,
        });

        return res.status(200).json(success('Mail added to cycle', mail));
    } catch (error) {
        next(error);
    }
}

export const composeCycledMails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const mailsCycle = await new MailService('', '', "tech-beginner").count();
        const subscribers = await new SubscriberService().findPerCycle(mailsCycle);
        let cycles;
        let result;

        if (subscribers.length) {
            cycles = subscribers.map(sub => sub.cycle);
            const mails = await new MailService().getAll({ cycles });
            const obj: ISubscriberMail[] = [];
            mails.forEach(mail => {
                const perCycle = subscribers.find(subscriber => subscriber.cycle === mail.cycle);
                if (perCycle) {
                    obj.push({
                        email: perCycle.email,
                        subject: mail.subject,
                        content: mail.content,
                        date: mail.date ? new Date(mail.date): new Date(),
                        mailId: String(mail._id)
                    });
                }
            });

            if (obj.length) {
                result = await new SubscriberMailService().bulkCreate(obj);
            }
        }

        return res.status(200).json(
            success(
                "Cycle mail hit",
                { cycles, result }
            )
        );
    } catch (error) {
        next(error);
    }
}

export const sendCycledMails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // find all subscriber mails that match current time and in past
        const subMails = await new SubscriberMailService().getAll({ date: new Date() });
        // group mails by mailId
        const groupedMails = groupBy<ISubscriberMail>(subMails, 'mailId');
        // send mail in a loop
        const mailsToSend = Object.values(groupedMails) as ISubscriberMail[][];
        for (let i = 0; i < mailsToSend.length; i++) {
            await sendTemplateMail({
                to: mailsToSend[i].map(item => item.email).flat(),
                subject: mailsToSend[i][0].subject,
                content: mailsToSend[i][0].subject,
            });
        }

        return res.status(200).json(
            success("Mail sent", {})
        )
    } catch (error) {
        next(error);
    }
}

