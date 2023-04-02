import socket, {Socket} from "socket.io";
import UserRepository from "../repositories/user.repository";
import StrHelper from "../helper/str.helper";
import ESocket from '../enum/ESocket'
import databaseConfig from '../config/database'
import {createClient, RedisClientType} from 'redis';
class SocketService {

    private readonly userRepository:UserRepository

    // private redisClient:RedisClientType

    public constructor(public socket:Socket,public userOid:string) {
        this.userRepository = new UserRepository()
        // this.redisClient = createClient({
        //     url: databaseConfig.redis_url
        // })
        // this.redisClient.connect().then(()=>{
        //     console.log("Redis Connected!")
        // })
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

    public joinRoom(roomOid:string)
    {
        this.socket.join(roomOid)
        console.log('room_oid'+roomOid)
        this.socket.to(roomOid).emit(ESocket.JOIN_ROOM,{
            user_oid:this.userOid,
            room_oid:roomOid
        })
    }

    public leaveRoom(room:string)
    {

    }

    public message(room:string,content:string){
        this.socket.to(room).emit(ESocket.MESSAGE,{
            content:content
        })
    }
}

export default SocketService
