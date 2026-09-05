// import { Controller } from '@nestjs/common'; 
// import { EventPattern, Payload } from '@nestjs/microservices';

// @Controller()
// export class AppController {
 
//  @EventPattern('user_created')
//  handleUserCreationNotification(@Payload() data:any){
//   console.log('User created event received:', data);
//  }
// }

import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, Payload, EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }
  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: any) {
    try {
      console.log('Main Event Received', data);

      throw new Error('Payment Service Failed !!');
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);

      console.log('Sending to DLQ : ', errMsg);

      this.kafkaClient.emit('user_created_dlq', {
        error: errMsg,
        failedData: data,
        failedAt: new Date().toISOString(),
      });
    }
  }

  @EventPattern('user_created_dlq')
  async handleUserCreatedDLQ(@Payload() data: any) {
    console.log('DLQ Event Received (from my own btw)', data);
  }
}
