import { Admin } from '../../models/index.js';

//Add admin
export const addAdmin = async (payload = {}) => {
  let admin = new Admin(payload);
  return admin.save();
};

//Find by admin
export const findByEmail = async (email) => Admin.findOne(email)

//Find admin details
export const findAdminById = (search = {}) => new Promise((resolve, reject) => {
	Admin.findOne(search).select('-password')
		.then(resolve)
		.catch(reject)
});


export const findAdmin = async (email) => Admin.findOne(email).select('-password')

//Change Password
export const updateAdmin = (email, data) => new Promise((resolve, reject) => {
  Admin.findOneAndUpdate({ email: email }, data)
    .then(resolve)
    .catch(reject);
});
