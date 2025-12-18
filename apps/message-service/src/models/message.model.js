const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true }, 
    from: { type: String, required: true },           
    to: { type: String, required: true },             
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
