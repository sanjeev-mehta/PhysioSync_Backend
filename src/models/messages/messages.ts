import mongoose, { Document, Schema, model } from 'mongoose';

//IMessage interface that extends mongoose.Document
interface IMessage extends Document {
  sender_id: string;
  receiver_id: string;
  message_text: string;
  createdAt: Date;
  updatedAt: Date;

}

// {

//   "timestamp": ISODate("2023-05-27T15:45:00Z"),
//   "status": "sent"
// }

// message schema
const messageSchema = new Schema<IMessage>({
  sender_id: { type: String, ref: 'User', required: true },
  receiver_id: { type: String, ref: 'User', required: true },
  message_text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

}, {
  timestamps: true

});

const MessageModel = model<IMessage>('Message-test', messageSchema);

export default MessageModel;
