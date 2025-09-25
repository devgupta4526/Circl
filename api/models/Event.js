const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  activity: { type: String, required: true },
  location: { type: String, required: true }, // was area
  date: { type: String, required: true },
  time: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // was admin
  totalParticipants: { type: Number, required: true }, // was totalPlayers
  activityAccess: { type: String, default: 'public' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // was players
  queries: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      query: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  requests: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String },
      status: { type: String, default: 'pending' },
    },
  ],
  isBooked: { type: Boolean, default: false },
  courtNumber: { type: String, default: null },
  matchFull: { type: Boolean, default: false },
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = Event;
