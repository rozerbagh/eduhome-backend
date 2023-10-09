import mongoose from "mongoose";
const messageSchema = mongoose.Schema(
  {
    senderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    recieverid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    message: {
      type: String,
      required: true,
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

const Messages = mongoose.model("messages", messageSchema);

export { Messages };
