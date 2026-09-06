import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  read: boolean;
}

const schema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: String,
  message: String,
  read: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model<INotification>("Notification", schema);
