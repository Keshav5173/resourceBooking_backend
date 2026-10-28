import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },
    status:{
        type: String,
        enum: ["PENDING", "ONBOARDED", "COMPLETED"],
        default: "PENDING"
    }
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
