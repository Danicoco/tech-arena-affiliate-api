/** @format */

import { Mail } from "../../../databases"
import { IPaginator, IMail } from "../../../types"
import { ClientSession } from "mongoose"

class MailService {
    private model = Mail

    private id: string
    private subject: string
    private subscriptionType: string;

    constructor(id = "", subject = "", subscriptionType = "") {
        this.id = id
        this.subject = subject;
        this.subscriptionType = subscriptionType;
    }

    private finder(params: Partial<IMail & { cycles: number[] }>) {
        const { date, sent, cycles } = params;
        return {
            ...(this.id && { _id: this.id }),
            ...(sent !== undefined && { sent }),
            ...(cycles && { cycle: { $in: cycles } }),
            ...(this.subject && { email: this.subject }),
            ...(date && { date: { $gte: new Date(date) } }),
            ...(this.subscriptionType && { subscriptionType: this.subscriptionType }),
        }
    }

    public async create(params: IMail, session?: ClientSession) {
        const user = await new this.model(params).save({
            ...(session && { session }),
        })
        return user
    }

    public async update(param: Partial<IMail>, session?: ClientSession) {
        const user = await this.model.findOneAndUpdate(this.finder({}), param, {
            new: true,
            ...(session && { session }),
        })
        return user
    }

    public async findOne(isActive: boolean) {
        const user = await this.model
            .findOne({ ...this.finder({}), isActive })
            .lean();

        return user
    }

    public async deleteOne(session?: ClientSession) {
        const user = await this.model.findOneAndUpdate(
            this.finder({}),
            { deletedAt: new Date().toISOString() },
            {
                ...(session && { session }),
            }
        );
        return user;
    }

    public async getAll (params: Partial<IMail & { cycles: number[] }>) {
        return this.model.find(this.finder(params));
    }

    public async count () {
        return this.model.countDocuments(this.finder({}));
    }

    public async findAll(page = 1, limit = 10, query: IMail) {
        return this.paginate({ limit, page, query })
    }

    private async paginate(params: IPaginator<Partial<IMail>>) {
        const query = { ...params, sort: { createdAt: -1 }, key: "_id" }
        return this.model.paginate(query);
    }
}

export default MailService;
