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
    // 인스턴스 생성
    this.logger.log('Init');
  }
  handleConnection(socket: Socket) {
    // connection시
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }

  handleDisconnect(socket: Socket) {
    // disconnection시
    this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name} `);
  }

  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(socket['id']);
    socket.emit('hello', 'hello' + ' ' + username);

    return 'return_data'; // return 으로도 결과 값을 보내줄수 있음.
  }
}
