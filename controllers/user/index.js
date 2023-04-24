import Router from "express";
import {
  catchAsyncAction,
  makeResponse,
  responseMessages,
  statusCodes,
  userMapper,
} from "../../helpers/index.js";
import { userAuth, validators } from "../../middleware/index.js";
import upload from "../../middleware/upload/index.js";
import {
  addUser,
  deleteUser,
  findAllUsers,
  findUserDetail,
  generateOtp,
  hashPassword,
  matchPassword,
  sendEmail,
  updateUser,
  updateUserData,
} from "../../services/index.js";
import { privateKey } from "../../config/privateKeys.js";

import twilio from "twilio";

const YOUR_AUTH_TOKEN = privateKey.TWILIO_AUTH_TOKEN;
const YOUR_ACCOUNT_SID = privateKey.TWILIO_ACCOUNT_SID;

const client = twilio(YOUR_ACCOUNT_SID, YOUR_AUTH_TOKEN);

//const client = Twilio(YOUR_ACCOUNT_SID, YOUR_AUTH_TOKEN);


//Response Status code
const { SUCCESS, NOT_FOUND, RECORD_ALREADY_EXISTS, BAD_REQUEST } = statusCodes;

//Response Messages
const {
  ALREADY_EXIST,
  REGISTERD,
  FETCH_USERS,
  LOGIN,
  DELETE_USER,
  UPDATE_USER,
  OTP_FOR_PASSWORD,
  EMAIL_NOT_REGISTER,
  OTP_MISMATCH,
  VERIFY_OTP,
  RESET_PASSWORD,
  INVALID_PASSWORD,
  PASSWORD_CHANGED,
  VERIFIED_OTP,
  SEND_OTP
} = responseMessages;

const router = Router();

//Add user
router.post(
  "/sign-up", validators("ADD_USER"),
  catchAsyncAction(async (req, res) => {
    const userRecord = await findUserDetail({ email: req.body.email });
    if (userRecord)
      return makeResponse(res, RECORD_ALREADY_EXISTS, false, ALREADY_EXIST);
    const password = await hashPassword(req.body.password);
    const newUser = await addUser({ email: req.body.email, password });
    const accessToken = newUser.generateAuthToken(newUser._id);
    const refreshToken = newUser.generateRefershToken(newUser._id);
    //Mapping for removing temprary fields
    const newUserMapper = await userMapper(newUser);
    return makeResponse(res, SUCCESS, true, REGISTERD, newUserMapper, {
      accessToken,
      refreshToken,
    });
  })
);

//Login User
router.post(
  "/login",
  //   validators("LOGIN"),
  catchAsyncAction(async (req, res) => {
    const { email, password } = req.body;
    const user = await findUserDetail({ email });
    if (!user) return makeResponse(res, NOT_FOUND, false, USER_NOTFOUND);
    const passwordCorrect = await matchPassword(password, user.password);
    if (!passwordCorrect) return makeResponse(res, BAD_REQUEST, false, INVALID);
    const accessToken = user.generateAuthToken(user._id);
    const refreshToken = user.generateRefershToken(user._id);
    return makeResponse(res, SUCCESS, true, LOGIN, {
      fullName: user.fullName,
      email: user.email,
      phoneno: user.phoneno,
      user_role: user.user_role,
      status: user.status,
      image: user.image,
      address: user.address,
      accessToken,
      refreshToken,
    });
  })
);

//Get All Users
router.get(
  "/",
  catchAsyncAction(async (req, res) => {
    let users = await findAllUsers();
    return makeResponse(res, SUCCESS, true, FETCH_USERS, users);
  })
);

//Change Password
router.patch(
  "/change-password",
  userAuth,
  validators("CHANGE_PASSWORD"),
  (req, res) => {
    const { email, password } = req.userData;
    matchPassword(req.body.oldPassword, password)
      .then(async (result) => {
        if (result) {
          return updateUser(email, {
            password: await hashPassword(req.body.newPassword),
          });
        }
        throw new Error(INVALID_PASSWORD);
      })
      .then(async () => {
        return makeResponse(res, SUCCESS, true, PASSWORD_CHANGED);
      })
      .catch(async (error) => {
        return makeResponse(res, BAD_REQUEST, false, error.message);
      });
  }
);

//Forgot password
router.post(
  "/forgot-password",
  // validators("FORGET_PASSWORD"),
  (req, res) => {
    const otp = generateOtp();
    const { email } = req.body;
    findUserDetail({ email })
      .then((admin) => {
        if (!admin) throw new Error(EMAIL_NOT_REGISTER);
        return Promise.all([
          sendEmail({
            from: privateKey.EMAIL,
            to: req.body.email,
            subject: "OTP for password reset",
            text: `The OTP for resetting your password is ${otp}`,
          }),
          updateUser(req.body.email, { otp }),
        ]);
      })
      .then(async (result) => {
        delete result[1]?._doc?.password;
        return makeResponse(res, SUCCESS, true, OTP_FOR_PASSWORD);
      })
      .catch(async (error) => {
        return makeResponse(res, BAD_REQUEST, false, error.message);
      });
  }
);

//Verify OTP
router.post(
  "/verify-otp",
  // validators("VERIFY_OTP"),
  catchAsyncAction(async (req, res) => {
    let userRecord = await findUserDetail({ email: req.body.email });
    if (!userRecord) throw new Error(EMAIL_NOT_REGISTER);
    if (userRecord.otp === req.body.otp)
      return makeResponse(res, SUCCESS, true, VERIFY_OTP);
    return makeResponse(res, BAD_REQUEST, false, OTP_MISMATCH);
  })
);

//Reset password
router.post(
  "/reset-password",
  // validators("RESET_PASSWORD"),
  async (req, res) => {
    const { email, password } = req.body;
    updateUser(email, {
      password: await hashPassword(password),
    })
      .then(() => {
        return makeResponse(res, SUCCESS, true, RESET_PASSWORD);
      })
      .catch(async (error) => {
        return makeResponse(res, BAD_REQUEST, false, error.message);
      });
  }
);

//Update user details
router.patch(
  "/update-user",
  userAuth,
  catchAsyncAction(async (req, res) => {
    const { email, _id } = req.userData;
    console.log(">>>>>>>>>>>>>>>>>>>",_id);
    console.log("/////////////////",req.body);
    let updateUserProfile = await updateUserData(req.body, { _id: _id });
    // Mapping for removing temprary fields
    const newUserMapper = await userMapper(updateUserProfile);
    return makeResponse(res, SUCCESS, true, UPDATE_USER, newUserMapper);
  })
);

//Delete User
router.delete(
  "/:id",
  catchAsyncAction(async (req, res) => {
    let user = await deleteUser({ _id: req.params.id });
    return makeResponse(res, SUCCESS, true, DELETE_USER, []);
  })
);

//Send OTP
router.post('/send-otp', catchAsyncAction(async (req, res) => {
  const { countryCode, phoneNumber } = req.body;
  const otpResponse = await client.verify.services(privateKey.TWIILIO_SID).verifications.create({
    to: `+${countryCode}${phoneNumber}`,
    channel: "sms"
  })
  return makeResponse(res, SUCCESS, true, SEND_OTP, otpResponse);
}));

//Verify OTP
router.post('/mobile-otp-verification', catchAsyncAction(async (req, res) => {
  const { countryCode, phoneNumber, otp } = req.body;
  const otpResponse = await client.verify.services(privateKey.TWIILIO_SID).verificationChecks.create({
    to: `+${countryCode}${phoneNumber}`,
    code: otp
  })
  return makeResponse(res, SUCCESS, true, VERIFIED_OTP, otpResponse);
}));


export const userController = router;
