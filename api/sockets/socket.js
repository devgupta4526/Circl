const User = require('../models/user');
const Event = require('../models/Event');
const Message = require('../models/message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', async ({ userId, eventId }) => {
      if (eventId) {
        const event = await Event.findById(eventId);
        const user = await User.findOne({ clerkId: userId });
        if (event && user && (event.organizer.equals(user._id) || event.participants.includes(user._id))) {
          socket.join(eventId);
          console.log(`User ${userId} joined event chat ${eventId}`);
        }
      } else if (userId) {
        socket.join(`private_${userId}`);
        console.log(`User ${userId} joined private chat room`);
      }
    });

    socket.on('sendMessage', async ({ senderId, recipientId, eventId, content }) => {
      const sender = await User.findOne({ clerkId: senderId });
      if (!sender) return;

      const newMessage = new Message({
        sender: sender._id,
        recipient: recipientId ? (await User.findOne({ clerkId: recipientId }))?._id : undefined,
        event: eventId ? (await Event.findById(eventId))?._id : undefined,
        content,
        isGroup: !!eventId,
      });
      await newMessage.save();

      const messageData = await Message.findById(newMessage._id).populate('sender', 'firstName lastName image');
      if (eventId) io.to(eventId).emit('message', messageData);
      else if (recipientId) {
        io.to(`private_${senderId}`).emit('message', messageData);
        io.to(`private_${recipientId}`).emit('message', messageData);
      }
    });

    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
  });
};
