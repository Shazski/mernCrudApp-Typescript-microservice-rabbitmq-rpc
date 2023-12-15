import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from './messageHandler'
export default class ReceivingConsumer {
    constructor(private channel:Channel, private userQueue:string) {}

    async consumeReceivingMessages () {
        console.log("<<** ..ready to consumeReceivingMessages.. **>>")
        this.channel.consume(this.userQueue, async(message: ConsumeMessage | any) => {
            const { correlationId, replyTo } = message.properties
            const operation = message.properties.headers.function
            if(!correlationId || !replyTo) {
                console.log("**..Some properties are missing..**");
            } else {
                const data = JSON.parse(message?.content.toString())
                await MessageHandler.handle(operation, data, correlationId, replyTo )
            }
        }, {
            noAck:true
        })
    }

}