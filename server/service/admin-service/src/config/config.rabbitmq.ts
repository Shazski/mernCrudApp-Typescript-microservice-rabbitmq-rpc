import { config } from "dotenv"
config()
const URL = process.env.RABBITMQ_URL
export default {
    rabbitMq : {
        url:URL,
        queue: {
            admin_queue: "admin_queue",
            user_queue:"user_queue"
        }
    }
}