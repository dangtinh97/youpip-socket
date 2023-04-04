import express, {Express, Request, Response} from 'express'
import * as http from "http";
import {Server} from "net";
import SocketController from './controller/socket.controller'
import databaseConfig from './config/database'
let mongoose = require('mongoose')
const Youtube = require('youtube-stream-url');
class App{
    public server:Server
    public readonly app:Express

    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
        new SocketController(this.server)
        App.connectMongo()
        this.route()
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

    route()
    {
        this.app.get('/',async function (req:Request,res:Response){
            let videoId = req.query['video-id']
            console.log(videoId)
            try{
                let detail = await Youtube.getInfo({url: 'https://www.youtube.com/watch?v='+videoId});
                return res.json(detail)
            }catch (e:any){
                return res.json({})
            }

        })
    }

}
export default App
