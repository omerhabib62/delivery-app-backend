import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost/ride-food-delivery',
    ),
  ],
  exports: [MongooseModule],
})
export class MongodbModule {}
