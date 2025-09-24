const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    image: { type: String, required: true },
    skill: { type: String },
    eventCount: { type: Number, default: 0 }, // was noOfGames
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // was playpals
    interests: [String], // was sports
    provider: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
