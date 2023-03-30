import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "config";
import { compare } from 'bcrypt';

const { Schema, model } = mongoose;

const addressSchema = mongoose.Schema({
  street: String,
  houseno: String,
  landmark: String,
  town: String,
  pincode: Number,
  district: String,
  state: String,
  country: String,
}, { _id: false });

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneno: {
      type: String,
      required: true,
    },
    user_role: {
      type: String,
      enum : ['TEACHER','STUDENT'],
    },
    status: {
      type: Number,
      default: 1,
    }, // 0 -inactive , 1-active, 2-hold
    image: {
      type: String,
      default: "",
    },
    address: [addressSchema],
    otp: {
      type: String,
      default: "000000",
    },
    isDeleted: {
      type: Boolean,
      default: false
  }
  },
  { timestamps: true }
);


userSchema.methods.generateAuthToken = function (_id, role) {
  return jwt.sign({ id: _id, role }, config.get("privateKey"), { expiresIn: '15d' });
};

userSchema.methods.generateRefershToken = function (_id, role) {
  return jwt.sign({ id: _id, role }, config.get("privateKey"), { expiresIn: '30d' });
};

userSchema.methods.comparePassword = function (raw, encrypted) {
  return new Promise((resolve, reject) => {
    compare(raw, encrypted)
      .then(resolve)
      .catch(reject);
  });
};

export const User = model('User', userSchema);
