/** @format */

import { Schema } from "mongoose"
import { db } from "../connection"
import { IAdmin } from "../../types"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

const AdminSchema: Schema = new Schema<IAdmin>(
    {
        fullName: { type: "String", required: true },
        email: { type: "String", required: true },
        isActive: { type: "Boolean", default: true },
        password: { type: "String" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "admins",
    }
)

AdminSchema.set("timestamps", true)
AdminSchema.plugin(mongoosePagination)
AdminSchema.index({ email: 1 }, { unique: true })

export default db.model<IAdmin, Pagination<IAdmin>>(
    "Admin",
    // @ts-ignore
    AdminSchema
)
