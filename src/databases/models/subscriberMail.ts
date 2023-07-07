/** @format */

import { Schema } from "mongoose"
import { db } from "../connection"
import { ISubscriberMail } from "../../types"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

const SubscriberMailSchema: Schema = new Schema<ISubscriberMail>(
    {
        subject: { type: "String" },
        content: { type: "String" },
        email: { type: "String" },
        mailId: { type: "String" },
        date: { type: "Date" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "SubscriberMails",
    }
)

SubscriberMailSchema.set("timestamps", true)
SubscriberMailSchema.plugin(mongoosePagination)
SubscriberMailSchema.index({ eSubscriberMail: 1 }, { unique: true })

export default db.model<ISubscriberMail, Pagination<ISubscriberMail>>(
    "SubscriberMail",
    // @ts-ignore
    SubscriberMailSchema
)
