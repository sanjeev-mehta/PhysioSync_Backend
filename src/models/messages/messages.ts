import { Document, Schema, Model, model } from 'mongoose';

export interface IMessage extends Document {
  sender_id: string;
  receiver_id: string;
  chat_id: Schema.Types.ObjectId;
  message_text: string;
  is_read: boolean;
  is_media: boolean;
  image_url?: string;
  video_url?: string;
}

export interface IMessageModel extends Model<IMessage> {
  getUnreadMessageCount(receiverId: string): Promise<number>;
}

const messageSchema = new Schema<IMessage>({
  sender_id: { type: String, ref: 'User', required: true },
  receiver_id: { type: String, ref: 'User', required: true },
  // chat_id: { type: Schema.Types.ObjectId, ref: 'Chat', required: true }, 
  message_text: { type: String, required: true },
  is_read: { type: Boolean, required: true, default: false },
  is_media: { type: Boolean, required: true },
  image_url: { type: String, required: false },
  video_url: { type: String, required: false },
}, {
  timestamps: true
});

messageSchema.statics.getUnreadMessageCount = async function(receiverId: string): Promise<number> {
  try {
    const count = await this.countDocuments({ receiver_id: receiverId, is_read: false });
    return count;
  } catch (error) {
    console.error('Error fetching unread message count:', error);
    throw error;
  }
};

export const MessageModel = model<IMessage, IMessageModel>('message-physio', messageSchema);


export interface IChat extends Document {
  members: string[];
}

export interface IChatModel extends Model<IChat> {
  getChatByMembers(members: string[]): Promise<IChat | null>;
}

const chatSchema = new Schema<IChat>({
  members: [{ type: String, ref: 'User', required: true }],
}, {
  timestamps: true
});

chatSchema.statics.getChatByMembers = async function(members: string[]): Promise<IChat | null> {
  try {
    const chat = await this.findOne({ members: { $all: members, $size: members.length } });
    return chat;
  } catch (error) {
    console.error('Error fetching chat by members:', error);
    throw error;
  }
};

export const ChatModel = model<IChat, IChatModel>('Chat', chatSchema);


