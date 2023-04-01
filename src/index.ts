require('dotenv').config()
import appConfig from "./config/app";
import App from './app'

let app = new App()
app.server.listen(appConfig.port,function (){
    console.log(`RUN IN PORT:${appConfig.port}`)
})
