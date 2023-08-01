const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Array to store booked slots
const bookedSlots = [];

// Facilities object with booking amounts
const facilities = {
  Clubhouse: {
    "10:00-16:00": 600,
    "16:00-22:00": 1000,
  },
  "Tennis Court": {
    "16:00-20:00": 200,
  },
};

// API endpoint to book a facility
app.post("/book", (req, res) => {
  const { facility, date, slot } = req.body;
  if (!facility || !date || !slot) {
    return res
      .status(400)
      .json({ error: "Missing facility, date, or slot information." });
  }

  // Check if the slot is available
  if (isSlotAvailable(facility, date, slot)) {
    const bookingAmount = getBookingAmount(facility, slot);
    bookedSlots.push({ facility, date, slot, bookingAmount });
    return res.json({
      message: `Facility booked successfully. Booking Amount: Rs. ${bookingAmount}`,
    });
  } else {
    return res.json({
        message: `Booking Failed, Already Booked`,
      });
  }
});

// Function to check if a slot is available for booking
const isSlotAvailable = (facility, date, slot) => {
  if (!facilities[facility]) {
    return false; // Facility not found
  }

  // Check if the date exists in the facility's available slots
  if (!facilities[facility][slot]) {
    return false; // Slot not found
  }

  // Check if the slot is already booked
  const isSlotBooked = bookedSlots.some(
    (booking) =>
      booking.facility === facility &&
      booking.date === date &&
      booking.slot === slot
  );
  return !isSlotBooked; // Return true if the slot is available, false if it's already booked
};

// Function to get the booking amount for a slot
const getBookingAmount = (facility, slot) => {
  // Convert the slot format from "16:00 - 22:00" to "16:00-22:00"
  const formattedSlot = slot.replace(/\s/g, "");
  return facilities[facility][formattedSlot];
};

app.get("/", (req, res) => {
  res.send("<h1>Server is up and running</h1>");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
