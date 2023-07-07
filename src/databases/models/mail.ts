/** @format */

import { Schema } from "mongoose"
import { db } from "../connection"
import { IMail } from "../../types"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

const MailSchema: Schema = new Schema<IMail>(
    {
        subject: { type: "String" },
        content: { type: "String" },
        subscriptionType: { type: "String" },
        cycle: { type: "Number" },
        date: { type: "Date", required: true },
        sent: { type: "Boolean", default: true },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "Mails",
    }
)

MailSchema.set("timestamps", true)
MailSchema.plugin(mongoosePagination)
MailSchema.index({ email: 1 }, { unique: true })

export default db.model<IMail, Pagination<IMail>>(
    "Mail",
    // @ts-ignore
    MailSchema
)
