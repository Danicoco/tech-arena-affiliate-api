/** @format */

import { Schema } from "mongoose"
import { db } from "../connection"
import { ISubscriber } from "../../types"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

const SubscriberSchema: Schema = new Schema<ISubscriber>(
    {
        fullName: { type: "String" },
        email: { type: "String", required: true },
        cycle: { type: "Number", required: true },
        isActive: { type: "Boolean", default: true },
        type: { type: "String" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "subscribers",
    }
)

SubscriberSchema.set("timestamps", true)
SubscriberSchema.plugin(mongoosePagination)
SubscriberSchema.index({ email: 1 }, { unique: true })

export default db.model<ISubscriber, Pagination<ISubscriber>>(
    "Subscriber",
    // @ts-ignore
    SubscriberSchema
)
