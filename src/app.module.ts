import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongodbModule } from './shared/mongodb/mongodb.module';
import { KafkaModule } from './shared/kafka/kafka.module';

@Module({
  imports: [UserModule, MongodbModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
