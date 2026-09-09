import mongoose, { Schema, Document } from "mongoose";

export type Role = "ADMIN" | "USER";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    verified: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", schema);
