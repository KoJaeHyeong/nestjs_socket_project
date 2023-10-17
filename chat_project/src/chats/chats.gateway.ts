import { Logger } from '@nestjs/common';
import {} from '@nestjs/platform-socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' }) // interface를 사용한 socket lifecycle주기
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor() {
    this.logger.log('contructor');
  }

  afterInit(server: any) {
    this.logger.log('Init');
  }
  handleConnection(socket: Socket) {
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name} `);
  }

  @SubscribeMessage('join') // socket_event를 받는 decoration
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    // username db에 저장
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('send_msg')
  handleSubmitChat(
    @MessageBody() msg: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('new_chat', {
      msg,
      username: socket.id,
    });
    console.log(msg);
  }
}
