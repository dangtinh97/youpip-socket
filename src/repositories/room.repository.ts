import BaseRepository from "./base.repository";
import Room from "../model/room.model";
import StrHelper from "../helper/str.helper";

class RoomRepository extends BaseRepository{
    constructor() {
        super(Room);
    }

    async getUser(roomOid:String):Promise<any>
    {
        let pipeline:any = [
            {
                '$match':{
                    '_id':StrHelper.toObjectId(roomOid)
                }
            },
            {
                '$lookup':{
                    from:'users',
                    let:{'join':'$join'},
                    pipeline:[
                        {
                            '$match':{
                                '$expr':{
                                    $and:[
                                        {
                                            $in:['$id','$$join']
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as:"users"
                }
            },
            {
                $project:{
                    users:1
                }
            }
        ];

        return new Promise<any>(resolve => {
            return this.model.aggregate(pipeline).then(function (res){
                return resolve(res[0])
            })
        })
    }
}

export default RoomRepository
