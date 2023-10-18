import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';
import { Sockets as SocketModel } from './sockets.model';

const options: SchemaOptions = {
  timestamps: true,
  collection: 'chattings',
};

@Schema(options)
export class Chatting extends Document {
  @Prop({
    // 참조 시 그 data_form을 세팅해줄 수 있음.
    type: {
      _id: { type: Types.ObjectId, required: true, ref: 'sockets' },
      id: { type: String },
      username: { type: String, required: true },
    },
  })
  @IsNotEmpty()
  user: SocketModel;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  chat: string;
}

export const ChattingSchema = SchemaFactory.createForClass(Chatting);
