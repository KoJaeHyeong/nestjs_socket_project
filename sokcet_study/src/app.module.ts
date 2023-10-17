import { Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 다른 모듈에서도 환경변수 사용 가능
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;
  configure() {
    const DEBUG = process.env.MODE === 'dev' ? true : false;
    mongoose.set('debug', DEBUG); // mongoose에서의 쿼리 console 가능하게 해줌.
  }
}
