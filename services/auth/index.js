import { User } from '../../models/index.js';

//Find user detail
export const findUserDetail = async (condition = {}) => await User.findOne(condition).exec();

//Find user list
export const findAllUsers = async (condition = {}) => await User.find(condition).exec();

//Add user
export const addUser = async (payload = {}, role) => {
    payload.role = role;
    let user = new User(payload);
    return user.save();
};

//Update user
export const updateUser = (_id, data) => new Promise((resolve, reject) => {
    User.findOneAndUpdate({ _id: _id }, { $set: data }, { new: true })
        .then(resolve)
        .catch(reject);
});
// Update Password
export const updatePassword = (id, password) => new Promise((resolve, reject) => {
    User.findById(id)
        .then((doc) => {
            doc.password = password;
            doc.save();
            resolve();
        })
        .catch(reject);
});

//Delete user
export const deleteUser = (id) => new Promise((resolve, reject) => {
    User.updateMany({ _id: { $in: id } }, { $set: { isDeleted: true } })
        .then(resolve)
        .catch(reject)
});

//Update device token
export const updateDeviceToken = (_id, data) => new Promise((resolve, reject) => {
    User.findOneAndUpdate({ _id: _id }, { $set: data }, { new: true })
        .then(resolve)
        .catch(reject);
});

//set device token null
export const setDeviceToken = (_id) => new Promise((resolve, reject) => {
    User.findOneAndUpdate({ _id: _id }, { $set: { device_token: undefined } }, { new: true })
        .then(resolve)
        .catch(reject);
});

// async function getcontacts(){
//     let existingcontacts = []
//     const data = await User.find({}).select('mobileNumber -_id');
//     data.filter(element => existingcontacts.push(element.mobileNumber));
//     return existingcontacts;
//  }

//Update user
export const updateUserData = (userprops = {}, condition = {}) => new Promise((resolve, reject) => {
	User.findOneAndUpdate(condition, { $set: userprops }, { new: true })
		.then(resolve)
		.catch(reject);
});

async function getcontacts() {

    const data = await User.find({}).select('mobileNumber name profile_pic status _id');

    return data;

}
export { getcontacts }