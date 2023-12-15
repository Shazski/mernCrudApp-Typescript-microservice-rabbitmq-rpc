import { Channel, Connection, connect } from "amqplib";

import config from "../config/config.rabbitmq";
import Producer from "./producer";
import ReceivingConsumer from "./receivingConsumer";
import EmittingConsumer from "./emittingConsumer";
import { EventEmitter } from "events";

class RabbitMQClient {
  private constructor() {}
  private producer: Producer;
  private recievingConsumer: ReceivingConsumer;
  private emittingConsumer: EmittingConsumer;
  private eventEmitter: EventEmitter;
  private connection: Connection;
  private producerChannel: Channel;
  private consumerChannel: Channel;
  private static instance: RabbitMQClient;
  private isInitialized: boolean = false;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQClient();
    }
    return this.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      if (config.rabbitMq.url)
        this.connection = await connect(config.rabbitMq.url);
      this.eventEmitter = new EventEmitter();
      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();
      const { queue: userQueue } = await this.consumerChannel.assertQueue(
        config.rabbitMq.Queues.user_queue,
        { exclusive: true }
      );
      const { queue: replyQueue } = await this.consumerChannel.assertQueue("", {
        exclusive: true,
      });

      this.producer = new Producer(
        this.producerChannel,
        replyQueue,
        this.eventEmitter
      );
      this.recievingConsumer = new ReceivingConsumer(
        this.consumerChannel,
        userQueue
      );
      this.emittingConsumer = new EmittingConsumer(
        this.consumerChannel,
        replyQueue,
        this.eventEmitter
      );

      this.emittingConsumer.consumeProducedMessages();
      this.recievingConsumer.consumeReceivingMessages();
      this.isInitialized = true;
    } catch (error) {
      console.log(error);
    }
  }

  async produceAndWaitForReply(
    data: any,
    targetQueue: string,
    operation: string
  ) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.producer.waitingProducer(data, targetQueue, operation);
  }

  async produceReply(data: any, correlationId: string, replyToQueue: string) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.producer.produceToReply(
      data,
      correlationId,
      replyToQueue
    );
  }
}

export default RabbitMQClient.getInstance();
