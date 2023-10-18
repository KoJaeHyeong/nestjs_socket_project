import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsGateway } from './chats.gateway';
import { Chatting, ChattingSchema } from './models/chattings.model';
import { Sockets as SocetsModel, SocketsSchema } from './models/sockets.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chatting.name, schema: ChattingSchema },
      { name: SocetsModel.name, schema: SocketsSchema },
    ]),
  ],
  providers: [ChatsGateway],
})
export class ChatsModule {}
