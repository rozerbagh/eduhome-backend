import Router from 'express';
import { catchAsyncAction, makeResponse, responseMessages, statusCodes } from '../../helpers/index.js';
import {  validators } from '../../middleware/index.js';
import { addCourses, deleteCourses, findAllCourses, findCoursesById, updateCourses } from '../../services/index.js';

//Response Status code
const { SUCCESS } = statusCodes;

//Response Messages
const { COURSE_ADDED, FETCH_COURSE, FETCH_ALL_COURSES, UPDATE_COURSE, DELETE_COURSE } = responseMessages;

const router = Router();


//Courses Added
router.post('/', catchAsyncAction(async (req, res) => {
    let course = await addCourses(req.body);
    return makeResponse(res, SUCCESS, true, COURSE_ADDED, course);
}));

//Get all Courses
router.get('/', catchAsyncAction(async (req, res) => {
    let page = 1,
        limit = 10,
        skip = 0
    if (req.query.page) page = req.query.page
    if (req.query.limit) limit = req.query.limit
    skip = (page - 1) * limit
    let course = await findAllCourses({}, parseInt(skip), parseInt(limit));
    return makeResponse(res, SUCCESS, true, FETCH_ALL_COURSES, course);
}));

//Get Courses ById
router.get('/:id', catchAsyncAction(async (req, res) => {
    let course = await findCoursesById({ _id: req.params.id });
    return makeResponse(res, SUCCESS, true, FETCH_COURSE, course);
}));

//Update Courses
router.patch('/:id', catchAsyncAction(async (req, res) => {
    let updateCourse = await updateCourses({ _id: req.params.id }, req.body);
    return makeResponse(res, SUCCESS, true, UPDATE_COURSE, updateCourse);
}))

//Delete Courses
router.delete('/:id', catchAsyncAction(async (req, res) => {
    let course = await deleteCourses({ _id: req.params.id });
    return makeResponse(res, SUCCESS, true, DELETE_COURSE, []);
}));



export const courseController = router;
