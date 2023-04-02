import socket, {Socket} from "socket.io";
import UserRepository from "../repositories/user.repository";
import StrHelper from "../helper/str.helper";
import {response} from "express";
import ESocket from '../enum/ESocket'
class SocketService {

    private readonly userRepository:UserRepository

    public constructor(public socket:Socket,public userOid:string) {
        this.userRepository = new UserRepository()
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

    public joinRoom(room:String)
    {

    }

    public leaveRoom(room:String)
    {

    }
}

export default SocketService
