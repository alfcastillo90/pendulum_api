import { Module } from '@nestjs/common';
import { Cec2014Module } from './cec2014/ cec2014.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultModule } from './result/result.module';
import { AlgorithmModule } from './algorithm/algorithm.module';

@Module({
  imports: [
    Cec2014Module,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        uri: process.env.MONGODB_URL,
      }),
      inject: [ConfigService],
    }),
    ResultModule,
    AlgorithmModule,
  ],
})
export class AppModule {}
