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
    firstName: {
      type: String,
      required: false,
    },
    LastName: {
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
      unique: true,
    },
    user_role: {
      type: String,
      enum: ["TEACHER", "STUDENT", "ADMIN"],
    },
    gender: {
      type: String,
    },
    board: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
    }, // 0 -inactive , 1-active, 2-hold
    image: {
      type: String,
      default: "",
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
    experiences: [],
    hourly_rate: {
      type: Number,
    },
    other_information: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: false,
    },
    coins: {
      type: Number,
      default: 300,
    },
    address: [],
  },
  { timestamps: true }
);
userSchema.method.addAddress = function (_address) {
  return this.address.push({ id: Schema.Types.ObjectId, ..._address });
};
userSchema.method.deductcoins = function (coin) {
  return this.coins - coin;
};

userSchema.method.removeAddress = function (_address) {
  const index = this.address.findIndex((e) => e.id === _address.id);
  const array = this.address.splice(index, 1);
  return (this.address = array);
};
userSchema.methods.generateAuthToken = function (_id, role) {
  return jwt.sign({ id: _id, role }, "myprivatekey", {
    expiresIn: "15d",
  });
};

userSchema.methods.generateRefershToken = function (_id, role) {
  return jwt.sign({ id: _id, role }, "myprivatekey", {
    expiresIn: "30d",
  });
};

userSchema.methods.comparePassword = function (raw, encrypted) {
  return new Promise((resolve, reject) => {
    compare(raw, encrypted).then(resolve).catch(reject);
  });
};

export const User = model("users", userSchema);
