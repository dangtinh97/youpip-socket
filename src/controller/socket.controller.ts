import socket, {Server,Socket} from 'socket.io'
import SocketService from "../services/socket.service";
import jwtConfig from '../config/jwt'
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
        let roomId = "dangtinhroom001"
        socket.join(roomId)
        let service = new SocketService(socket,this.userOid)
        service.connect()
        socket.on("disconnect",()=>service.disconnect())
        socket.on("PUSH_ROOM",function (data:any){
            console.log(data)

            console.log(socket.rooms)
            socket.emit("PING","PING")
            socket.in(roomId).to(roomId).emit("PUSH_ROOM",{
                "name":"dangtinh"
            })
        })
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
