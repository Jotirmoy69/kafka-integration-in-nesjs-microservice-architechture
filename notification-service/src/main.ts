
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {Transport , MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options:{
      client:{
        clientId:'notification-consumer',
        brokers:['localhost:9092']
      },
      consumer:{
        groupId:'notification-group'
      }
    }
  })
  await app.listen();
  console.log('Notification service is listening... ( client id: notification-consumer, group id: notification-group , port :9092 )');
}

bootstrap();  