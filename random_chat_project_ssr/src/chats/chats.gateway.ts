import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Chatting } from './models/chattings.model';
import { Sockets as SocketModel } from './models/sockets.model';

@WebSocketGateway({ namespace: 'chat' }) // interface를 사용한 socket lifecycle주기
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    @InjectModel(Chatting.name) private readonly chattingModel: Model<Chatting>,
    @InjectModel(SocketModel.name)
    private readonly socketsModel: Model<SocketModel>,
  ) {
    this.logger.log('contructor');
  }

  afterInit(server: any) {
    this.logger.log('Init');
  }
  handleConnection(socket: Socket) {
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }

  async handleDisconnect(socket: Socket) {
    const user = await this.socketsModel.findOne({ id: socket.id });
    console.log(user);

    if (user) {
      socket.broadcast.emit('disconnected_user', user.username);
      await user.deleteOne();
    }
    this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name} `);
  }

  @SubscribeMessage('join') // socket_event를 받는 decoration
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const exist = await this.socketsModel.exists({ username });
    if (exist) {
      username = `${username}_${Math.floor(Math.random() * 100)}`;
      await this.socketsModel.create({
        id: socket.id,
        username: username,
      });
    } else {
      await this.socketsModel.create({
        id: socket.id,
        username,
      });
    }

    // username db에 저장
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('send_msg')
  async handleSubmitChat(
    @MessageBody() msg: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.socketsModel.findOne({ id: socket.id }); // msg보낸 사람의 id

    await this.chattingModel.create({
      user: socketObj,
      chat: msg,
    });

    socket.broadcast.emit('new_chat', {
      msg,
      username: socketObj.username,
    });
    console.log(msg);
  }
}
