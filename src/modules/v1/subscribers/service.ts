/** @format */

import { Subscriber } from "../../../databases"
import { IPaginator, ISubscriber } from "../../../types"
import { ClientSession } from "mongoose"

class SubscriberService {
    private model = Subscriber

    private id: string
    private email: string
    private type: string

    constructor(id = "", email = "", type = "") {
        this.id = id
        this.email = email
        this.type = type
    }

    private finder(types?: string[]) {
        return {
            ...(this.id && { _id: this.id }),
            ...(this.type && { type: this.type }),
            ...(this.email && { email: this.email }),
            ...(types && { types: { $in: types } }),
        }
    }

    public async create(params: ISubscriber, session?: ClientSession) {
        const user = await new this.model(params).save({
            ...(session && { session }),
        })
        return user
    }

    public async update(param: Partial<ISubscriber>, session?: ClientSession) {
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

    public async getAll(types?: string[]) {
        return this.model.find(this.finder(types));
    }

    public async findPerCycle(cycle: number) {
        const subs = await this.model.find({
            cycle: {
                $lt: cycle
             }
        }, {}, {
            sort: { email: 1, cycle: 1 },
        });

        const filteredResults = subs.reduce((acc: any, current) => {
            if (!acc[current.email] && current.cycle !== 1) {
              acc[current.email] = current;
            }
            return acc;
          }, {});

        const filteredData = Object.values(filteredResults) as unknown as ISubscriber[];
        return filteredData;
    }

    public async findAll(page = 1, limit = 10, query: ISubscriber) {
        return this.paginate({ limit, page, query })
    }

    private async paginate(params: IPaginator<Partial<ISubscriber>>) {
        const query = { ...params, sort: { createdAt: -1 }, key: "_id" }
        return this.model.paginate(query);
    }
}

export default SubscriberService;
