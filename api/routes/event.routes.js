const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const moment = require("moment");
const chalk = require("chalk");

// ===================== LOGGERS =====================
const logInfo = (msg, data = null) =>
  console.log(chalk.blue("[INFO]"), msg, data ? chalk.gray(JSON.stringify(data)) : "");
const logSuccess = (msg, data = null) =>
  console.log(chalk.green("[SUCCESS]"), msg, data ? chalk.gray(JSON.stringify(data)) : "");
const logWarn = (msg, data = null) =>
  console.log(chalk.yellow("[WARN]"), msg, data ? chalk.gray(JSON.stringify(data)) : "");
const logError = (msg, data = null) =>
  console.log(chalk.red("[ERROR]"), msg, data ? chalk.gray(JSON.stringify(data)) : "");

// ===================== CREATE EVENT =====================
router.post("/create", async (req, res) => {
  logInfo("POST /create called", req.body);
  try {
    const { activity, location, date, time, organizer, totalParticipants, activityAccess = "public" } = req.body;

    if (!activity || !location || !date || !time || !organizer || !totalParticipants) {
      logWarn("Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEvent = new Event({
      activity,
      location,
      date,
      time,
      organizer,
      totalParticipants,
      activityAccess,
      participants: [organizer],
    });

    const savedEvent = await newEvent.save();
    logSuccess("Event saved", savedEvent);
    res.status(200).json(savedEvent);
  } catch (err) {
    logError("Error creating event", err.message);
    res.status(500).json({ message: "Failed to create event" });
  }
});

// ===================== UPCOMING EVENTS =====================
router.get("/upcoming", async (req, res) => {
  logInfo("GET /upcoming called", req.query);
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const events = await Event.find({
      $or: [{ organizer: userId }, { participants: userId }, { "requests.userId": userId }],
    });

    const now = moment();
    const formattedEvents = await Promise.all(
      events.map(async (event) => {
        const organizerUser = await User.findById(event.organizer);
        if (!organizerUser) return null;

        const participantUsers = await User.find({ _id: { $in: event.participants } });
        const participantMap = participantUsers.reduce((map, u) => ((map[u._id] = u), map), {});

        const [startTime, endTime] = event.time.split(" - ");
        const eventEndTime = moment(`${event.date} ${endTime}`, "YYYY-MM-DD h:mm A");

        if (!eventEndTime.isAfter(now)) return null;

        const userRequest = event.requests.find((r) => r.userId === userId);

        return {
          _id: event._id,
          activity: event.activity,
          date: event.date,
          time: event.time,
          location: event.location,
          participants: event.participants
            .map((pId) => {
              const p = participantMap[pId];
              return p ? { _id: p._id, imageUrl: p.image || "https://i.pravatar.cc/100", name: `${p.firstName} ${p.lastName || ""}`.trim() } : null;
            })
            .filter(Boolean),
          totalParticipants: event.totalParticipants,
          requests: event.requests || [],
          isUserOrganizer: event.organizer === userId,
          organizerName: `${organizerUser.firstName} ${organizerUser.lastName || ""}`.trim(),
          organizerUrl: organizerUser.image || "https://i.pravatar.cc/100",
          activityAccess: event.activityAccess,
          isInProgress: moment(`${event.date} ${startTime}`, "YYYY-MM-DD h:mm A").isBefore(now) && eventEndTime.isAfter(now),
          userRequestStatus: userRequest?.status || null,
        };
      })
    );

    res.status(200).json(formattedEvents.filter(Boolean));
  } catch (err) {
    logError("Error fetching upcoming events", err.message);
    res.status(500).json({ message: "Failed to fetch upcoming events", error: err.message });
  }
});

// ===================== ALL EVENTS =====================
router.get("/events", async (req, res) => {
  logInfo("GET /events called");
  try {
    const events = await Event.find({});
    const now = moment();

    const formattedEvents = await Promise.all(
      events.map(async (event) => {
        const organizerUser = await User.findById(event.organizer);
        if (!organizerUser) return null;

        const participantUsers = await User.find({ _id: { $in: event.participants } });
        const participantMap = participantUsers.reduce((map, u) => ((map[u._id] = u), map), {});

        const [startTime, endTime] = event.time.split(" - ");
        const eventStartTime = moment(`${event.date} ${startTime}`, "YYYY-MM-DD h:mm A");
        const eventEndTime = moment(`${event.date} ${endTime}`, "YYYY-MM-DD h:mm A");

        if (!eventEndTime.isAfter(now) && !(eventStartTime.isBefore(now) && eventEndTime.isAfter(now))) return null;

        return {
          _id: event._id,
          activity: event.activity,
          date: event.date,
          time: event.time,
          location: event.location,
          participants: event.participants
            .map((pId) => {
              const p = participantMap[pId];
              return p ? { _id: p._id, imageUrl: p.image || "https://i.pravatar.cc/100", name: `${p.firstName} ${p.lastName || ""}`.trim() } : null;
            })
            .filter(Boolean),
          totalParticipants: event.totalParticipants,
          requests: event.requests || [],
          organizerName: `${organizerUser.firstName} ${organizerUser.lastName || ""}`.trim(),
          organizerUrl: organizerUser.image || "https://i.pravatar.cc/100",
          activityAccess: event.activityAccess,
        };
      })
    );

    res.status(200).json(formattedEvents.filter(Boolean));
  } catch (err) {
    logError("Error fetching events", err.message);
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
});


// ===================== GET EVENT BY ID =====================
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  logInfo("GET /:id called", { id });

  try {
    const event = await Event.findById(id);
    if (!event) {
      logWarn("Event not found", { id });
      return res.status(404).json({ message: "Event not found" });
    }

    const organizerUser = await User.findById(event.organizer);
    const participantUsers = await User.find({ _id: { $in: event.participants } });
    const participantMap = participantUsers.reduce((map, u) => ((map[u._id] = u), map), {});

    const [startTime, endTime] = event.time.split(" - ");

    const formattedEvent = {
      _id: event._id,
      title: event.title,
      activity: event.activity,
      location: event.location,
      date: event.date,
      time: event.time,
      description: event.description,
      participants: event.participants
        .map((pId) => {
          const p = participantMap[pId];
          return p ? { _id: p._id, imageUrl: p.image || "https://i.pravatar.cc/100", name: `${p.firstName} ${p.lastName || ""}`.trim() } : null;
        })
        .filter(Boolean),
      organizer: {
        name: `${organizerUser.firstName} ${organizerUser.lastName || ""}`.trim(),
        imageUrl: organizerUser.image || "https://i.pravatar.cc/100",
      },
      totalParticipants: event.totalParticipants,
      activityAccess: event.activityAccess,
    };

    logSuccess("Event fetched", formattedEvent);
    res.status(200).json(formattedEvent);
  } catch (err) {
    logError("Error fetching event", err.message);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});


module.exports = router;
