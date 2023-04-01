import {Model, model, Schema, Types} from "mongoose";
import definedModel from './defined.model';

const userSchema:Schema = new Schema({
    _id:Types.ObjectId,
    socket_id:String
},definedModel)

const User:Model<any> = model('User',userSchema,'users')

export default User
