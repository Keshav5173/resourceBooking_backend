import cron from "node-cron";
import { Booking } from "../models/booking.models.js"; 

const TIMEZONE = process.env.CRON_TIMEZONE ;
const DAY_MS = 24 * 60 * 60 * 1000;

// Booking dates are stored as UTC midnight of the chosen calendar day
// (e.g. "2026-10-29" -> 2026-10-29T00:00:00.000Z), so "today" is the
// current calendar date in TIMEZONE, converted to a UTC-midnight range.
const getTodayRange = () => {
  const todayStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()); // "YYYY-MM-DD"

  const start = new Date(`${todayStr}T00:00:00.000Z`);
  const end = new Date(start.getTime() + DAY_MS);
  return { start, end };
};

export const updateBookingStatuses = async () => {
  const { start, end } = getTodayRange();

  // 1. Booked for yesterday or earlier and currently ONBOARDED -> COMPLETED
  const completed = await Booking.updateMany(
    { date: { $lt: start }, status: "ONBOARDED" },
    { $set: { status: "COMPLETED" } }
  );

  // 2. Booked for today and still PENDING -> ONBOARDED
  const onboarded = await Booking.updateMany(
    { date: { $gte: start, $lt: end }, status: "PENDING" },
    { $set: { status: "ONBOARDED" } }
  );

  console.log(
    `[bookingStatusJob] ${new Date().toISOString()} - onboarded: ${onboarded.modifiedCount}, completed: ${completed.modifiedCount}`
  );
};

export const startBookingStatusJob = () => {
  // Runs every day at 01:00 in TIMEZONE
  cron.schedule(
    "0 1 * * *",
    async () => {
      try {
        await updateBookingStatuses();
      } catch (err) {
        console.error("[bookingStatusJob] failed:", err);
      }
    },
    { timezone: TIMEZONE }
  );

  console.log(`[bookingStatusJob] scheduled for 01:00 (${TIMEZONE})`);
};