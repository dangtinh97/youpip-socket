import socket, {Server,Socket} from 'socket.io'
import SocketService from "../services/socket.service";
import jwtConfig from '../config/jwt'
import ESocket from "../enum/ESocket";
const jwt = require('jsonwebtoken');
class SocketController {
    public io:Server
    public userOid:string = ''

    constructor(server:any) {
        this.io = new Server(server,{
            cors: {
                origin: "*"
            }
        })
        this.middleware()
        this.io.on("connection",(socket:Socket)=>this.socketListener(socket))
    }

    private  socketListener(socket:Socket): void
    {
        let service = new SocketService(socket,this.userOid)
        service.connect()
        socket.on("disconnect",()=>service.disconnect())
        socket.on(ESocket.JOIN_ROOM,(data:any)=>service.joinRoom(data.room_oid ?? ''))
        socket.on(ESocket.MESSAGE,(data)=>service.message(data.room_oid,data.content))
    }

    private middleware(){
        this.io.use((socket:Socket,next:any)=>{
            try{
                let decode = jwt.verify(socket.handshake.auth.token ?? '',jwtConfig.jwt)
                this.userOid = decode.sub
                console.log(decode)
                next();
            }catch (e) {
                console.log("JWT error!",e)
                next(new Error("JWT error!"))
            }
        })
    }

}

export default SocketController
