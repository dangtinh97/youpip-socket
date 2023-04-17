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
            let url = req.query['url'] ?? ''
            if(url.length==''){
                return res.json({})
            }
            try{
                let detail = await Youtube.getInfo({url: url});
                return res.json(detail)
            }catch (e:any){
                return res.json({})
            }

        })

        this.app.get('/vtv',(req:Request,res:Response)=>{
            var fetchUrl = require("fetch").fetchUrl;
            let pattern = /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\//;
            fetchUrl(req.query['url'],function (error:any,meta:any,body:any){
                if(error!==null){

                    return res.json({})
                }
                let response = body.toString()
                let result = response.match(pattern);
                return res.json({
                    data:result[0].toString()
                })
            })
        })
    }

}
export default App
