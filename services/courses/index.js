import { Courses } from '../../models/index.js';

//Adds Categories
export const addCourses = async (payload = {}, role) => {
    let course = new Courses(payload);
    return course.save();
};


//Find Categories Id
export const findCoursesById = async (condition = {}) => await Courses.findOne(condition).exec();


//Find all Requests
export const findAllCourses = (search, skip, limit) => new Promise((resolve, reject) => {
    Courses.find(search)
        .skip(skip).limit(limit)
        .sort('-createdAt')
        .then(resolve)
        .catch(reject)
});

//Update Categories
export const updateCourses = (_id, data) => new Promise((resolve, reject) => {
    Courses.findOneAndUpdate({ _id: _id }, { $set: data }, { new: true })
        .then(resolve)
        .catch(reject);
});

//Delete Categories
export const deleteCourses = (id) => new Promise((resolve, reject) => {
    Courses.updateMany({ _id: { $in: id } }, { $set: { isDeleted: true } })
        .then(resolve)
        .catch(reject)
});
