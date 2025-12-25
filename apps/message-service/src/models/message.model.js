const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    text: { type: String },
    type: { type: String, enum: ['text', 'image', 'file', 'audio', 'video'], default: 'text' },
    url: { type: String },
     status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent', 
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
