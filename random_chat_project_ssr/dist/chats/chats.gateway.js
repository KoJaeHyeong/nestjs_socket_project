"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsGateway = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const websockets_1 = require("@nestjs/websockets");
const mongoose_2 = require("mongoose");
const socket_io_1 = require("socket.io");
const chattings_model_1 = require("./models/chattings.model");
const sockets_model_1 = require("./models/sockets.model");
let ChatsGateway = class ChatsGateway {
    constructor(chattingModel, socketsModel) {
        this.chattingModel = chattingModel;
        this.socketsModel = socketsModel;
        this.logger = new common_1.Logger('chat');
        this.logger.log('contructor');
    }
    afterInit(server) {
        this.logger.log('Init');
    }
    handleConnection(socket) {
        this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
    }
    async handleDisconnect(socket) {
        const user = await this.socketsModel.findOne({ id: socket.id });
        console.log(user);
        if (user) {
            socket.broadcast.emit('disconnected_user', user.username);
            await user.deleteOne();
        }
        this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name} `);
    }
    async handleNewUser(username, socket) {
        const exist = await this.socketsModel.exists({ username });
        if (exist) {
            username = `${username}_${Math.floor(Math.random() * 100)}`;
            await this.socketsModel.create({
                id: socket.id,
                username: username,
            });
        }
        else {
            await this.socketsModel.create({
                id: socket.id,
                username,
            });
        }
        socket.broadcast.emit('user_connected', username);
        return username;
    }
    async handleSubmitChat(msg, socket) {
        const socketObj = await this.socketsModel.findOne({ id: socket.id });
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
};
exports.ChatsGateway = ChatsGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleNewUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_msg'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleSubmitChat", null);
exports.ChatsGateway = ChatsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'chat' }),
    __param(0, (0, mongoose_1.InjectModel)(chattings_model_1.Chatting.name)),
    __param(1, (0, mongoose_1.InjectModel)(sockets_model_1.Sockets.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChatsGateway);
//# sourceMappingURL=chats.gateway.js.map