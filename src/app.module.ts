import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Cec2014Module } from './cec2014/ cec2014.module';

@Module({
  imports: [Cec2014Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
