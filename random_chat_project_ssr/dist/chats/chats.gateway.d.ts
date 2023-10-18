import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Chatting } from './models/chattings.model';
import { Sockets as SocketModel } from './models/sockets.model';
export declare class ChatsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly chattingModel;
    private readonly socketsModel;
    private logger;
    constructor(chattingModel: Model<Chatting>, socketsModel: Model<SocketModel>);
    afterInit(server: any): void;
    handleConnection(socket: Socket): void;
    handleDisconnect(socket: Socket): Promise<void>;
    handleNewUser(username: string, socket: Socket): Promise<string>;
    handleSubmitChat(msg: string, socket: Socket): Promise<void>;
}
