import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from "./messageHandler";

export default class ReceivingConsumer {
  constructor(private channel: Channel, private adminQueue: string) {}

  async consumeReceivingMessages() {
    console.log("**>> ..ready to consumeReceivingMessages.. <<**")
    this.channel.consume(this.adminQueue, async (message: ConsumeMessage | any) => {
      const { correlationId, replyTo } = message.properties;
      const operation = message.properties.headers.function;
      if (!replyTo || !operation) {
        console.log("Missing fields in the received message");
      } else {
        const data = JSON.parse(message.content.toString())
        await MessageHandler.handle(operation, data, correlationId, replyTo)
      }
    }, {
        noAck:true
    })
  }
}
