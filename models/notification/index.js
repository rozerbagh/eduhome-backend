import mongoose from "mongoose";
const notificationSchema = mongoose.Schema(
  {
    messageid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Number,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Notifications = mongoose.model("notifications", notificationSchema);

export { Notifications };
