import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { V1Module } from './modules/v1/v1.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { mongooseConfig } from './config/mongodb.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongooseConfig,
      inject: [ConfigService],
    }),
    V1Module,
    KafkaModule,
  ],
})
export class AppModule {}
