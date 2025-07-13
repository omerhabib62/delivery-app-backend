import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('ride.created');
    this.kafkaClient.subscribeToResponseOf('ride.updated');
    this.kafkaClient.subscribeToResponseOf('order.created');
    this.kafkaClient.subscribeToResponseOf('order.updated');
    await this.kafkaClient.connect();
  }

  async produce({ topic, messages }: { topic: string; messages: any[] }) {
    return this.kafkaClient.emit(topic, messages);
  }
}
