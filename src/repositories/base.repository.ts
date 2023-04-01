import {Model} from "mongoose";

class BaseRepository {
    constructor(public model:Model<any>) {

    }

    public async update(cond:object,data:object):Promise<object>
    {
       return await this.model.updateOne(cond, data).exec();
    }

    public async findOne(cond:object)
    {
        console.log(cond)
        return this.model.findOne(cond).exec()
    }
}

export default BaseRepository
