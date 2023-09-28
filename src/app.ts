import express, {Express, Request, Response} from 'express'
import * as http from "http";
import {Server} from "net";
import SocketController from './controller/socket.controller'
import databaseConfig from './config/database'
import {HttpsProxyAgent} from "https-proxy-agent";

let mongoose = require('mongoose')
const Youtube = require('youtube-stream-url');
const axios = require('axios')

class App {
    public server: Server
    public readonly app: Express

    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
        new SocketController(this.server)
        App.connectMongo()
        this.route()
    }

    private static connectMongo() {
        try {
            mongoose.connect(databaseConfig.mongo_uri).then(function (response: any) {
                console.log('Connected mongodb success!')
            }).catch(function (e: any) {
                console.log("Error connect mongodb!")
            });
        } catch (e) {
            console.log(e)
        }
    }

    route() {
        this.app.get('/', async function (req: Request, res: Response) {
            let url = req.query['url'] ?? ''
            if (url.length == '') {
                return res.json({})
            }
            try {
                let detail = await Youtube.getInfo({url: url});
                return res.json(detail)
            } catch (e: any) {
                return res.json({})
            }

        })

        this.app.get('/vtv', (req: Request, res: Response) => {
            const proxies = [
                'http://113.161.131.43:80',
                'http://123.24.163.145:8080',
                'http://27.76.161.91:4007',
                'http://113.178.36.98:8080',
            ]
            var fetchUrl = require("fetch").fetchUrl;
            let pattern = /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\//;
            // const httpsAgent = new HttpsProxyAgent('http://113.161.131.43:80');
            let proxy = req.query['proxy'] as string ?? proxies[1];
            const httpsAgent = new HttpsProxyAgent(proxy);
            console.log(req.query['url'],proxy)

            axios.create(httpsAgent).get(req.query['url'] as string, {
                proxy: false,
                httpsAgent: httpsAgent
            })
                .then((response: any) => {
                    // console.log(ressponse.data)
                    let result = response.data.match(pattern);
                    return res.json({
                        data: result[0].toString()
                    })
                }).catch((err: any) => {
                console.log(err.toString())
                return res.json({})
            })
        })
    }

}

export default App
