import express from "express"
import { config } from "dotenv"
import logger from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"
config()
import { mongooseConnect } from "./config/config.database"
import UserRouter from "./routers/user.router"
const app = express()
const PORT = process.env.PORT || 3000
import RabbitMQClient from './rabbitmq/client'

const corsOptions = {
    origin: "http://localhost:5173", 
    credentials: true,
  };

//Middlewares 
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(logger("dev"))
app.use(express.json())
//database connectiona
mongooseConnect()

//Router Middleware
app.use("/api/user", UserRouter)

//PORT listening
app.listen(PORT, () => {
    console.log(`User Server is running on port ${PORT}`)
    RabbitMQClient.initialize()
})