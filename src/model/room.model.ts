import {model, Model, Schema, Types} from "mongoose";

const RoomSchema = new Schema({
    _id:Types.ObjectId,
    join:Array
})

const Room:Model<any> = model("Room",RoomSchema,'rooms')
export default Room
