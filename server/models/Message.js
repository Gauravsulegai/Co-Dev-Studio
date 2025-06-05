// src/models/Message.js

import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isAiResponse: {
      type: Boolean,
      default: false,
    },
    aiKeywordTitle: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index: auto-delete after 30 days (2592000 seconds)
MessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
