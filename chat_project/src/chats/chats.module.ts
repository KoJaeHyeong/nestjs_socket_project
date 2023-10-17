import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';

@Module({
  imports: [ChatsGateway],
})
export class ChatsModule {}
