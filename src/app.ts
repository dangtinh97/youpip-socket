import express, {Express} from 'express'
import * as http from "http";
import {Server} from "net";
import SocketController from './controller/socket.controller'
import databaseConfig from './config/database'
let mongoose = require('mongoose')
class App{
    public server:Server
    public readonly app:Express

    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
        new SocketController(this.server)
        App.connectMongo()

    }

    private static connectMongo(){
        try{
            mongoose.connect(databaseConfig.mongo_uri).then(function (response:any){
                console.log('Connected mongodb success!')
            }).catch(function (e:any){
                console.log("Error connect mongodb!")
            });
        }catch (e) {
            console.log(e)
        }
    }
}
export default App
