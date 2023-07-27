import Router from "express";
import axios from "axios";
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
import fetch from "node-fetch";
let { FAST2SMS_APIKEY } = process.env;

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
  PHONENO_NOT_REGISTER,
  OTP_MISMATCH,
  VERIFY_OTP,
  RESET_PASSWORD,
  INVALID_PASSWORD,
  PASSWORD_CHANGED,
  VERIFIED_OTP,
  SEND_OTP,
} = responseMessages;

const router = Router();

//Add user
router.post(
  "/sign-up",
  // validators("ADD_USER"),
  catchAsyncAction(async (req, res) => {
    const userRecord = await findUserDetail({ email: req.body.email });
    if (userRecord)
      return makeResponse(res, RECORD_ALREADY_EXISTS, false, ALREADY_EXIST);
    const password = await hashPassword(req.body.password);
    const newUser = await addUser({
      ...req.body,
      email: req.body.email,
      password,
    });
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
    const { password, phoneno } = req.body;
    const user = await findUserDetail({ phoneno });
    console.log(user);
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
        console.log("getting user details", admin);
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
// router.post(
//   "/send-otp",
//   catchAsyncAction(async (req, res) => {
//     const { countryCode, phoneNumber } = req.body;
//     const otpResponse = await client.verify
//       .services(privateKey.TWIILIO_SID)
//       .verifications.create({
//         to: `+${countryCode}${phoneNumber}`,
//         channel: "sms",
//       });
//     return makeResponse(res, SUCCESS, true, SEND_OTP, otpResponse);
//   })
// );

router.post(
  "/send-otp",
  catchAsyncAction(async (req, res) => {
    const { phoneNumber } = req.body;
    const OTP = generateOtp();
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_APIKEY}&route=otp&variables_values=${OTP}&flash=1&numbers=${phoneNumber}`;
    const otpResponse = await fetch(url);
    console.log("getting otp response:", OTP);
    const newUser = await addUser({
      phoneno: req.body.phoneNumber,
      otp: OTP,
    });
    const otpData = otpResponse.json();
    return makeResponse(res, SUCCESS, true, SEND_OTP, otpData);
  })
);

//Verify OTP
router.post(
  "/mobile-otp-verification",
  catchAsyncAction(async (req, res) => {
    const { phoneNumber, otp } = req.body;
    let userRecord = await findUserDetail({ phoneno: phoneNumber });
    if (!userRecord) throw new Error(PHONENO_NOT_REGISTER);
    if (userRecord.otp === otp)
      return makeResponse(res, SUCCESS, true, VERIFY_OTP);
    return makeResponse(res, BAD_REQUEST, false, OTP_MISMATCH);
    // const { phoneNumber, OTP } = req.body;
    // const userRecord = await findUserDetail({ phoneno: phoneNumber, otp: OTP });
    // if (userRecord){
    //   const accessToken = userRecord.generateAuthToken(userRecord._id);
    //   const refreshToken = userRecord.generateRefershToken(userRecord._id)
    //   return makeResponse(res, SUCCESS, true, VERIFIED_OTP, '',{
    //     accessToken,
    //     refreshToken,
    //   });
    // }else {
    //   return makeResponse(res, BAD_REQUEST, false, 'OTP Miss Match');
    // }
  })
);

//Get User Detail
router.get(
  "/profile",
  userAuth,
  catchAsyncAction(async (req, res) => {
    const { email, phoneno } = req.userData;
    const userRecord = await findUserDetail({
      $or: [{ phoneno: phoneno }, { email: email }],
    });
    if (userRecord) {
      const newUserMapper = await userMapper(userRecord);
      return makeResponse(res, SUCCESS, true, FETCH_USERS, newUserMapper);
    } else {
      return makeResponse(res, BAD_REQUEST, false, "User Not Found");
    }
  })
);

router.get("/get-fast2sms-balance", async (req, res) => {
  try {
    const walletData = await axios.get(
      `https://www.fast2sms.com/dev/wallet?authorization=${FAST2SMS_APIKEY}`
    );
    res.status(200).send({
      data: walletData.data,
      message: "Remaining Wallet balance",
    });
  } catch (error) {
    res.status(404).send({
      data: error,
      message: "Unable to fetch Wallet balance",
    });
  }
});
export const userController = router;
