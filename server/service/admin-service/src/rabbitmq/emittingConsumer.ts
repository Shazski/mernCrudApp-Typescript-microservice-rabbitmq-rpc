import { Channel, ConsumeMessage } from "amqplib";
import { EventEmitter } from "events";

export default class EmittingConsumer {
    constructor(private channel:Channel,private replyToQueue:string, private eventEmitter:EventEmitter) {}

    async consumeProducedMessages() {
        console.log("**>> ..ready to receive consumeProducedMessages.. <<**")
        this.channel.consume(this.replyToQueue, (message:ConsumeMessage | any) => {
            this.eventEmitter.emit(message.properties.correlationId.toString(), message)
        },
         {
            noAck:true
         })
    }
}