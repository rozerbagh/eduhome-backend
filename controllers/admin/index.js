import Router from 'express';
import { privateKey } from '../../config/privateKeys.js'
import { catchAsyncAction, makeResponse, responseMessages, statusCodes } from '../../helpers/index.js';
import {
    hashPassword,
    findByEmail,
    matchPassword,
    updateAdmin,
    sendEmail,
    generateOtp,
    findAdmin,
    addAdmin
} from '../../services/index.js';
import { validators } from '../../middleware/index.js';
import  adminAuth  from '../../middleware/auth/admin.js';

//Response messages
const { LOGIN, OTP_MISMATCH, INVALID_PASSWORD, INVALID, PASSWORD_CHANGED, ADMIN_ADDED, USER_NOTFOUND, RESET_PASSWORD, OTP_FOR_PASSWORD, VERIFY_OTP, EMAIL_NOT_REGISTER, ALREADY_EXIST } = responseMessages;
//Response Status code
const { SUCCESS, NOT_FOUND, BAD_REQUEST, RECORD_ALREADY_EXISTS } = statusCodes;

const router = Router();

//Refresh token
router.post('/refresh-token', validators('REFRESH_TOKEN'), catchAsyncAction(async (req, res) => {
    let decod = await verifyToken(req.body.refreshToken, config.get("privateKey"));
    let userData = await findUserById({ _id: decod.id });
    const accessToken = userData.generateAuthToken(userData._id);
    const refreshToken = userData.generateRefershToken(userData._id);
    return makeResponse(res, SUCCESS, true, REFRESH_TOKEN, { accessToken, refreshToken });
}));

//Login Admin
router.post('/login', validators('LOGIN'), catchAsyncAction(async (req, res) => {
    const { email, password } = req.body;
    const admin = await findByEmail({ email });
    if (!admin) return makeResponse(res, NOT_FOUND, false, USER_NOTFOUND);
    const passwordCorrect = await matchPassword(password, admin.password);
    if (!passwordCorrect) return makeResponse(res, BAD_REQUEST, false, INVALID);
    const accessToken = admin.generateAuthToken(admin._id);
    const refreshToken = admin.generateRefershToken(admin._id);
    return makeResponse(res, SUCCESS, true, LOGIN, { accessToken, refreshToken });
}));

/*
NOTE: for internal use only:--
*/
//Add Admin
router.post('/', validators('LOGIN'), catchAsyncAction(async (req, res) => {
    const admin = await findByEmail({ email: req.body.email });
    if (admin) return makeResponse(res, RECORD_ALREADY_EXISTS, false, ALREADY_EXIST);
    let password = await hashPassword(req.body.password);
    let newAdmin = await addAdmin({ email: req.body.email, password });
    const accessToken = newAdmin.generateAuthToken(newAdmin._id);
    const refreshToken = newAdmin.generateRefershToken(newAdmin._id);
    return makeResponse(res, SUCCESS, true, ADMIN_ADDED, { accessToken, refreshToken });
}));


//Change Password
router.patch('/change-password', adminAuth, validators('CHANGE_PASSWORD'), (req, res) => {
    const { email, password } = req.adminData;
    matchPassword(req.body.oldPassword, password)
        .then(async result => {
            if (result) {
                return updateAdmin(email, { password: await hashPassword(req.body.newPassword) });
            }
            throw new Error(INVALID_PASSWORD);
        })
        .then(async () => {
            return makeResponse(
                res,
                SUCCESS,
                true,
                PASSWORD_CHANGED
            );
        })
        .catch(async error => {
            return makeResponse(
                res,
                BAD_REQUEST,
                false,
                error.message
            );
        });
});

//Forgot password
router.post('/forgot-password', validators('FORGET_PASSWORD'), (req, res) => {
    const otp = generateOtp();
    const { email } = req.body;
    findAdmin({ email })
        .then(admin => {
            if (!admin) throw new Error(EMAIL_NOT_REGISTER);
            return Promise.all(
                [
                    sendEmail({
                        from: privateKey.email,
                        to: req.body.email,
                        subject: 'OTP for password reset',
                        text: `The OTP for resetting your password is ${otp}`
                    }),
                    updateAdmin(req.body.email, { otp })
                ]
            )
        })
        .then(async result => {
            delete result[1]?._doc?.password;
            return makeResponse(res, SUCCESS, true, OTP_FOR_PASSWORD);
        })
        .catch(async error => {
            return makeResponse(res, BAD_REQUEST, false, error.message);
        });
});

//Verify OTP
router.post('/verify-otp', validators('VERIFY_OTP'), catchAsyncAction(async (req, res) => {
    let adminRecord = await findAdmin({ email: req.body.email });
    if (!adminRecord) throw new Error(EMAIL_NOT_REGISTER);
    if (adminRecord.otp === req.body.otp) return makeResponse(res, SUCCESS, true, VERIFY_OTP)
    return makeResponse(res, BAD_REQUEST, false, OTP_MISMATCH);
}));

//Reset password
router.post('/reset-password', validators('RESET_PASSWORD'), async (req, res) => {
    const { email, password } = req.body;
    updateAdmin(email, {
        password: await hashPassword(password)
    })
        .then(() => {
            return makeResponse(res, SUCCESS, true, RESET_PASSWORD);
        })
        .catch(async error => {
            return makeResponse(res, BAD_REQUEST, false, error.message);
        });
});

export const adminController = router;
