import mongoose, { Document, Schema, model } from 'mongoose';

//IMessage interface that extends mongoose.Document
interface IMessage extends Document {
  sender_id: string;
  receiver_id: string;
  message_text: string;
  createdAt: Date;
  updatedAt: Date;
  is_read: Boolean;
  is_media: Boolean;
  image_url: string;
  video_url: string;
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
  is_read: {type: Boolean, required: false},
  is_media: {type: Boolean, required: false},
  image_url: { type: String, required: false },
  video_url: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

}, {
  timestamps: true

});

const MessageModel = model<IMessage>('message-physio', messageSchema);

export default MessageModel;
