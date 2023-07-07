/** @format */

import { SubscriberMail } from "../../../databases"
import { IPaginator, ISubscriberMail } from "../../../types"
import { ClientSession } from "mongoose"

class SubscriberMailService {
    private model = SubscriberMail

    private id: string
    private subject: string
    private subscriptionType: string;

    constructor(id = "", subject = "", subscriptionType = "") {
        this.id = id
        this.subject = subject;
        this.subscriptionType = subscriptionType;
    }

    private finder(params: Partial<ISubscriberMail & { cycles: number[] }>) {
        const { mailId, date } = params;
        return {
            ...(this.id && { _id: this.id }),
            ...(mailId && { mailId: mailId }),
            ...(date && { date: { $lte: date } }),
            ...(this.subject && { subject: this.subject }),
            ...(this.subscriptionType && { subscriptionType: this.subscriptionType }),
        }
    }

    public async create(params: ISubscriberMail, session?: ClientSession) {
        const sub = await new this.model(params).save({
            ...(session && { session }),
        })
        return sub
    }

    public async bulkCreate(params: ISubscriberMail[], session?: ClientSession) {
        const sub = await this.model.insertMany(params, {
            ...(session && { session }),
            ordered: true
        });
        return sub
    }

    public async update(param: Partial<ISubscriberMail>, session?: ClientSession) {
        const sub = await this.model.findOneAndUpdate(this.finder({}), param, {
            new: true,
            ...(session && { session }),
        })
        return sub
    }

    public async findOne(isActive: boolean) {
        const sub = await this.model
            .findOne({ ...this.finder({}), isActive })
            .lean();

        return sub
    }

    public async deleteOne(session?: ClientSession) {
        const sub = await this.model.findOneAndUpdate(
            this.finder({}),
            { deletedAt: new Date().toISOString() },
            {
                ...(session && { session }),
            }
        );
        return sub;
    }

    public async getAll (params: Partial<ISubscriberMail & { cycles: number[] }>) {
        return this.model.find(this.finder(params));
    }

    public async count () {
        return this.model.countDocuments(this.finder({}));
    }

    public async findAll(page = 1, limit = 10, query: ISubscriberMail) {
        return this.paginate({ limit, page, query })
    }

    private async paginate(params: IPaginator<Partial<ISubscriberMail>>) {
        const query = { ...params, sort: { createdAt: -1 }, key: "_id" }
        return this.model.paginate(query);
    }
}

export default SubscriberMailService;
