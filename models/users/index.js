import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "config";
import { compare } from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    phoneno: {
      type: String,
      required: false,
    },
    user_role: {
      type: String,
      enum: ["TEACHER", "STUDENT", "ADMIN"],
    },
    gendor: {
      type: String
    },
    status: {
      type: Number,
      default: 1,
    }, // 0 -inactive , 1-active, 2-hold
    image: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: false,
    },
    pin_code: {
      type: Number
    },
    otp: {
      type: String,
      default: "000000",
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    education: [],
    qualifications: [],
    subjects: [],
    hourly_rate: {
      type: Number
    },
    other_information: {
      type: String
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function (_id, role) {
  return jwt.sign({ id: _id, role }, config.get("privateKey"), {
    expiresIn: "15d",
  });
};

userSchema.methods.generateRefershToken = function (_id, role) {
  return jwt.sign({ id: _id, role }, config.get("privateKey"), {
    expiresIn: "30d",
  });
};

userSchema.methods.comparePassword = function (raw, encrypted) {
  return new Promise((resolve, reject) => {
    compare(raw, encrypted).then(resolve).catch(reject);
  });
};

export const User = model("User", userSchema);
