export const responseMessages = {
    'ACCOUNT_DISABLED': 'Your account is disabled please contact to admin',
    'ALREADY_REGISTER': 'Mobile-Number already registered',
    'UPDATE_USER': 'User Updated Successfully',
    'COACH_NOTFOUND': 'Coach not found',
    'ALREADY_EXIST': 'Aleardy Exist Please Login',
    'REGISTERD': 'Registered Successfully',
    'GROUP_CREATED': 'Group Created Successfully',
    'INVALID_EMAIL': 'Email not exist',
    'INCORRECT_PASSWORD': 'Incorrect password',
    'LOGIN': 'Logged in successfully',
    'USER_NOT_FOUND': 'User not found',
    'UNAUTHORIZED': 'Unauthorized',
    'FETCH_CONTACTS': 'Fetch Contacts Successfully',
    'FETCH_USERS': 'Fetch Users Successfully',
    'FETCH_All_Group': 'Fetch All Group Successfully',
    'LOGIN': 'Login successfully',
    'OTP_MISMATCH': 'OTP mismatched',
    'INVALID_PASSWORD': 'Invalid old password',
    'INVALID': 'Invalid password',
    'PASSWORD_CHANGED': 'Password Changed Successfully',
    'FETCH_OWN_PROFILE': 'Fetch Own Profile Successfully',
    'ADMIN_ADDED': 'Admin added successfully',
    'USER_NOTFOUND': 'User not found',
    'RESET_PASSWORD': 'Password Reset Successfully',
    'OTP_FOR_PASSWORD': 'OTP For Password Reset Sent To Your Email',
    'VERIFY_OTP': 'OTP Verified',
    'EMAIL_NOT_REGISTER': 'Email not registered',
    'ALREADY_EXIST': 'Aleardy Exist Please Login',
    'CATEGORY_ADDED': 'Category Added Successfully',
    'STATE_ADDED': 'State Added Successfully',
    'NEWS_ADDED': 'News Added Successfully',
    'FETCH_NEWS': 'Fetch news Successfully',
    'FETCH_ALL_NEWS': 'Fetch All News Successfully',
    'DELETE_USER': 'User Deleted Successfully',
    'UPDATE_USER': 'User Updated Successfully',
    'FETCH_CATEGORY': 'Fetch Category Successfully',
    'FETCH_ALL_CATEGORY': 'Fetch All Category Successfully',
    'DELETE_CATEGORY': 'Category Deleted Successfully',
    'UPDATE_CATEGORY': 'Category Updated Successfully',
    'SUBCATEGORY_ADDED': 'SubCategory Added Successfully',
    'FETCH_SUBCATEGORY': 'Fetch SubCategory Successfully',
    'FETCH_ALL_SUBCATEGORY': 'Fetch All SubCategory Successfully',
    'DELETE_SUBCATEGORY': 'SubCategory Deleted Successfully',
    'UPDATE_SUBCATEGORY': 'SubCategory Updated Successfully',
    'COURSE_ADDED': 'Course Added Successfully',
    'FETCH_COURSE': 'Fetch Course Successfully',
    'FETCH_ALL_COURSES': 'Fetch All Courses Successfully',
    'DELETE_COURSE': 'Course Deleted Successfully',
    'UPDATE_COURSE': 'Course Updated Successfully',
    'SEND_OTP': 'OTP Send Successfully',
    'VERIFIED_OTP': 'OTP Verified Successfully'

}

export const notificationPayload = {}

export const statusCodes = {
    'SUCCESS': 200,
    'RECORD_CREATED': 201,
    'BAD_REQUEST': 400,
    'AUTH_ERROR': 401,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'INVALID_REQUEST': 405,
    'RECORD_ALREADY_EXISTS': 409,
    'SERVER_ERROR': 500
}

const makeResponse = async (res, statusCode, success, message, payload = null, meta = {}) =>
    new Promise(resolve => {
        res.status(statusCode)
            .send({
                success,
                code: statusCode,
                message,
                data: payload,
                meta
            });
        resolve(statusCode);
    });

export { makeResponse };
