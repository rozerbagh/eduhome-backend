import { Subcategories } from '../../models/index.js';

//Adds Categories
export const addSubCategories = async (payload = {}, role) => {
    let category = new Subcategories(payload);
    return category.save();
};


//Find Categories Id
export const findSubCategoriesById = async (condition = {}) => await Subcategories.findOne(condition).exec();


//Find all Requests
export const findAllSubCategories = (search, skip, limit) => new Promise((resolve, reject) => {
    Subcategories.find(search)
        .skip(skip).limit(limit)
        .sort('-createdAt')
        .then(resolve)
        .catch(reject)
});

//Update Categories
export const updateSubCategories = (_id, data) => new Promise((resolve, reject) => {
    Subcategories.findOneAndUpdate({ _id: _id }, { $set: data }, { new: true })
        .then(resolve)
        .catch(reject);
});

//Delete Categories
export const deleteSubCategories = (id) => new Promise((resolve, reject) => {
    Subcategories.updateMany({ _id: { $in: id } }, { $set: { isDeleted: true } })
        .then(resolve)
        .catch(reject)
});
