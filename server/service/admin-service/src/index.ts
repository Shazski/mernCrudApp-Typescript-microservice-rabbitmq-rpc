import express from "express"
import { config } from "dotenv"
import rabbitMqClient from './rabbitmq/client';
import cors from "cors"
import logger from "morgan"
import cookieParser from "cookie-parser"
config()
const app = express()
import adminRouter from "./routers/admin.router"
const PORT:number = Number(process.env.PORT) || 3001
const corsOptions = {
    origin:"http://localhost:5173",
    credentials:true
}
//middleware
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(logger("dev"))
app.use(express.json())

//router middleware
app.use("/api/admin", adminRouter)

app.listen(PORT, () => {
    console.log(`Admin Server is running on port ${PORT}`)
    rabbitMqClient.initialize()
})
