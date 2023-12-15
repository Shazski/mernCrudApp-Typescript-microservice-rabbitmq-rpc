import { Channel, Connection, connect } from "amqplib";
import configRabbitmq from "../config/config.rabbitmq";
import Producer from "./producer";
import ReceivingConsumer from "./receivingConsumer";
import EmittingConsumer from "./emittingConsumer";
import { EventEmitter } from "events";
class RabbitMQClient {
  private constructor() {}
  private static instance: RabbitMQClient;
  private isInitialized: boolean = false;
  private producer: Producer;
  private receivingCosumer: ReceivingConsumer;
  private emittingConsumer: EmittingConsumer;
  private connection: Connection;
  private consumerChannel: Channel;
  private producerChannel: Channel;
  private eventEmitter: EventEmitter;
  public static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQClient();
    }
    return this.instance;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }
    try {
      if (configRabbitmq.rabbitMq.url)
        this.connection = await connect(configRabbitmq.rabbitMq.url);
      this.eventEmitter = new EventEmitter();
      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      const { queue: adminQueue } = await this.consumerChannel.assertQueue(
        configRabbitmq.rabbitMq.queue.admin_queue,
        { exclusive: true }
      );
      const { queue: replyQueue } = await this.consumerChannel.assertQueue("", {
        exclusive: true,
      });

      this.producer = new Producer(this.producerChannel, replyQueue, this.eventEmitter);
      this.emittingConsumer = new EmittingConsumer(
        this.consumerChannel,
        replyQueue,
        this.eventEmitter
      );
      this.receivingCosumer = new ReceivingConsumer(
        this.consumerChannel,
        adminQueue
      );

      this.emittingConsumer.consumeProducedMessages();
      this.receivingCosumer.consumeReceivingMessages();
      this.isInitialized = true;
    } catch (error) {
      console.log(error);
    }
  }

  async produceAndWaitForReplay(
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
