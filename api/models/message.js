const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // For private chats
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // For group chats
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports = Message;
