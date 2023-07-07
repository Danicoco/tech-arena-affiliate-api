/** @format */

import { Admin } from "../../../databases"
import { IPaginator, IAdmin } from "../../../types"
import { ClientSession } from "mongoose"

class AdminService {
    private model = Admin

    private id: string
    private email: string

    constructor(id = "", email = "") {
        this.id = id
        this.email = email
    }

    private finder() {
        return {
            ...(this.id && { _id: this.id }),
            ...(this.email && { email: this.email }),
        }
    }

    public async create(params: IAdmin, session?: ClientSession) {
        const user = await new this.model(params).save({
            ...(session && { session }),
        })
        return user
    }

    public async update(param: Partial<IAdmin>, session?: ClientSession) {
        const user = await this.model.findOneAndUpdate(this.finder(), param, {
            new: true,
            ...(session && { session }),
        })
        return user
    }

    public async findOne(isActive: boolean) {
        const user = await this.model
            .findOne({ ...this.finder(), isActive })
            .lean();

        return user
    }

    public async deleteOne(session?: ClientSession) {
        const user = await this.model.findOneAndUpdate(
            this.finder(),
            { deletedAt: new Date().toISOString() },
            {
                ...(session && { session }),
            }
        );
        return user;
    }

    public async findAll(page = 1, limit = 10, query: IAdmin) {
        return this.paginate({ limit, page, query })
    }

    private async paginate(params: IPaginator<Partial<IAdmin>>) {
        const query = { ...params, sort: { createdAt: -1 }, key: "_id" }
        return this.model.paginate(query);
    }
}

export default AdminService;
