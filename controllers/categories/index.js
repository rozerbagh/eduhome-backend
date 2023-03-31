import Router from 'express';
import { catchAsyncAction, makeResponse, responseMessages, statusCodes } from '../../helpers/index.js';
import {  validators } from '../../middleware/index.js';
import { addCategories, deleteCategories, findAllCategories, findCategoriesById, updateCategories } from '../../services/index.js';

//Response Status code
const { SUCCESS } = statusCodes;

//Response Messages
const { CATEGORY_ADDED, FETCH_CATEGORY, FETCH_ALL_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } = responseMessages;

const router = Router();


//Category Added
router.post('/', catchAsyncAction(async (req, res) => {
    let category = await addCategories(req.body);
    return makeResponse(res, SUCCESS, true, CATEGORY_ADDED, category);
}));

//Get all Categories
router.get('/', catchAsyncAction(async (req, res) => {
    let page = 1,
        limit = 10,
        skip = 0
    if (req.query.page) page = req.query.page
    if (req.query.limit) limit = req.query.limit
    skip = (page - 1) * limit
    let news = await findAllCategories({}, parseInt(skip), parseInt(limit));
    return makeResponse(res, SUCCESS, true, FETCH_ALL_CATEGORY, news);
}));

//Get News ById
router.get('/:id', catchAsyncAction(async (req, res) => {
    let category = await findCategoriesById({ _id: req.params.id });
    return makeResponse(res, SUCCESS, true, FETCH_CATEGORY, category);
}));

//Update news
router.patch('/:id', catchAsyncAction(async (req, res) => {
    let updatedCategory = await updateCategories({ _id: req.params.id }, req.body);
    return makeResponse(res, SUCCESS, true, UPDATE_CATEGORY, updatedCategory);
}))

//Delete news
router.delete('/:id', catchAsyncAction(async (req, res) => {
    let category = await deleteCategories({ _id: req.params.id });
    return makeResponse(res, SUCCESS, true, DELETE_CATEGORY, []);
}));



export const categoryController = router;
