import { Categories } from '../../models/index.js';

//Adds Categories
export const addCategories = async (payload = {}, role) => {
    let category = new Categories(payload);
    return category.save();
};


//Find Categories Id
export const findCategoriesById = async (condition = {}) => await Categories.findOne(condition).exec();


//Find all Requests
export const findAllCategories = (search, skip, limit) => new Promise((resolve, reject) => {
    Categories.find(search)
        .skip(skip).limit(limit)
        .sort('-createdAt')
        .then(resolve)
        .catch(reject)
});

//Update Categories
export const updateCategories = (_id, data) => new Promise((resolve, reject) => {
    Categories.findOneAndUpdate({ _id: _id }, { $set: data }, { new: true })
        .then(resolve)
        .catch(reject);
});

//Delete Categories
export const deleteCategories = (id) => new Promise((resolve, reject) => {
    Categories.updateMany({ _id: { $in: id } }, { $set: { isDeleted: true } })
        .then(resolve)
        .catch(reject)
});
