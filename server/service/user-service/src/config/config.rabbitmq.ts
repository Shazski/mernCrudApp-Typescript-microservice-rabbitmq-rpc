import { config } from "dotenv";
config();

const URL = process.env.RABBITMQ_URL;

export default {
  rabbitMq: {
    url: URL,
    Queues: {
      user_queue: "user_queue",
    },
  },
};
