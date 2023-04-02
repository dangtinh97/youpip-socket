import socket, {Socket} from "socket.io";
import UserRepository from "../repositories/user.repository";
import StrHelper from "../helper/str.helper";
import ESocket from '../enum/ESocket'
import databaseConfig from '../config/database'
import {createClient, RedisClientType} from 'redis';
import RoomRepository from "../repositories/room.repository";
class SocketService {

    private readonly userRepository:UserRepository
    protected readonly roomRepository:RoomRepository


    public constructor(public socket:Socket,public userOid:string) {
        this.userRepository = new UserRepository()
        this.roomRepository = new RoomRepository()
    }

    public connect(){
        this.userRepository.update({
            _id:StrHelper.toObjectId(this.userOid)
        },{
            'socket_id':this.socket.id
        }).then(()=>{
            this.socket.emit(ESocket.PING,"dangtinh")
        })
    }

    public disconnect()
    {
        this.userRepository.update({
            _id:StrHelper.toObjectId(this.userOid)
        },{
            'socket_id':''
        }).then( (response:any)=>{

        })
    }

    public async joinRoom(roomOid:string)
    {
        this.socket.join(roomOid)
        let users =await this.roomRepository.getUser(roomOid)
        let user = users['users'].filter((user:any)=>{
            return user._id.toString()!=this.userOid
        })


        this.socket.to(roomOid).emit(ESocket.JOIN_ROOM,{
            user_oid:this.userOid,
            room_oid:roomOid,
            otherOnline: (user[0].socket_id ?? '').length > 0
        })
        this.socket.emit(ESocket.JOIN_ROOM,{
            user_oid:this.userOid,
            room_oid:roomOid,
            otherOnline: (user[0].socket_id ?? '').length > 0
        })
    }

    private getUserInRoom(roomOid:string)
    {

    }

    public leaveRoom(room:string)
    {

    }

    public async message(roomOid:string,content:string){
        this.socket.to(roomOid).emit(ESocket.MESSAGE,{
            content:content,
            from_user_oid:this.userOid
        })

        let users =await this.roomRepository.getUser(roomOid)
        let user = users['users'].filter((user:any)=>{
            return user._id.toString()!=this.userOid && (user.socket_id ?? '').toString().length > 0
        })
        // if(user.length>0){
        //     this.socket.to(user[0].socket_id).emit(ESocket.MESSAGE,{
        //         content:content,
        //         from_user_oid:this.userOid
        //     })
        // }


    }
}

export default SocketService
