const express = require('express');
const router = express.Router();
const User = require('../models/user');

// CREATE OR UPDATE USER (Called after onboarding)
router.post('/create-or-update', async (req, res) => {
  console.log('Request body:', req.body);
  const { clerkId, email, firstName, lastName, image, interests, provider } = req.body;

  if (!clerkId || !email || !firstName || !image) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user
      user.firstName = firstName;
      user.lastName = lastName;
      user.image = image;
      user.interests = interests || [];
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        clerkId,
        email,
        firstName,
        lastName,
        image,
        interests: interests || [],
        provider,
      });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Error creating/updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET USER BY CLERK ID
router.get('/:clerkId', async (req, res) => {
  const { clerkId } = req.params;

  try {
    const user = await User.findOne({ clerkId }).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE EVENT STATS FOR PARTICIPANTS
router.post('/update-event-stats', async (req, res) => {
  const { participantClerkIds } = req.body; // Array of clerkIds for all participants

  if (!participantClerkIds || !Array.isArray(participantClerkIds) || participantClerkIds.length === 0) {
    return res.status(400).json({ message: 'participantClerkIds array is required' });
  }

  try {
    const updatePromises = participantClerkIds.map(async (clerkId) => {
      const user = await User.findOne({ clerkId });
      if (user) {
        // Increment eventCount
        user.eventCount += 1;

        // Add all other participants as connections (excluding self)
        const newConnections = participantClerkIds.filter((id) => id !== clerkId);
        user.connections = [...new Set([...user.connections, ...newConnections])]; // Avoid duplicates
        await user.save();
      }
    });

    await Promise.all(updatePromises);
    res.status(200).json({ success: true, message: 'Event stats updated' });
  } catch (err) {
    console.error('Error updating event stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
