import {Controller, Get , Inject , OnModuleInit} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    // Subscribe to the 'user_created' topic
    await this.kafkaClient.connect();
  }

  @Get('create-user')
  async createUser() {
    const userData = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
    this.kafkaClient.emit('user_created', userData);

    return { message: 'User creation event emitted successfully', user: userData };
  }
}

