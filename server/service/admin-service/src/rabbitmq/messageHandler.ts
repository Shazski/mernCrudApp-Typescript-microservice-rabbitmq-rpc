import rabbitMQClient from './client'
export default class MessageHandler {
  static async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    let response: any = {};
    switch (operation) {
      case "empty":
        response = 23;
        break;
      default:
        response = "request-key not found";
        break;
    }
    await rabbitMQClient.produceReply(response, correlationId, replyTo)
  }
}
