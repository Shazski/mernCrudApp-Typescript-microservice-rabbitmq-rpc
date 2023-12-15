import { Channel } from "amqplib";
import { randomUUID } from "crypto";
import EventEmitter from "events";

export default class Producer {
  constructor(private channel: Channel, private replyQueue: string, private eventEmitter:EventEmitter) {}

  async waitingProducer(data: any, targetQueue: string, operation: string) {
    try {
      const uuid = randomUUID();
      this.channel.sendToQueue(targetQueue, Buffer.from(JSON.stringify(data)), {
        replyTo: this.replyQueue,
        correlationId: uuid,
        headers: {
          function: operation,
        },
      });
      return new Promise((resolve, reject) => {
        this.eventEmitter.once(uuid, (data:any) => {
            const reply: any = JSON.parse(data.content.toString())
            resolve(reply)
        })
      })
    } catch (error) {
      console.log(error);
    }
  }

  async produceToReply(data: any, correlationId: string, replyToQueue: string) {
    if (!correlationId) throw new Error("Correlation Id is required");
    this.channel.sendToQueue(replyToQueue, Buffer.from(JSON.stringify(data)), {
      correlationId: correlationId,
    });
  }
}
