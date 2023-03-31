import Router from 'express';
import { catchAsyncAction, makeResponse, responseMessages, statusCodes } from '../../helpers/index.js';
import {  validators } from '../../middleware/index.js';
import { addSubCategories, deleteSubCategories, findAllSubCategories, findSubCategoriesById, updateSubCategories } from '../../services/index.js';

//Response Status code
const { SUCCESS } = statusCodes;

//Response Messages
const { SUBCATEGORY_ADDED, FETCH_SUBCATEGORY, FETCH_ALL_SUBCATEGORY, UPDATE_SUBCATEGORY, DELETE_SUBCATEGORY } = responseMessages;

const router = Router();


//SubCategories Added
router.post('/', catchAsyncAction(async (req, res) => {
    let category = await addSubCategories(req.body);
    return makeResponse(res, SUCCESS, true, SUBCATEGORY_ADDED, category);
}));

//Get all SubCategories
router.get('/', catchAsyncAction(async (req, res) => {
    let page = 1,
        limit = 10,
        skip = 0
    if (req.query.page) page = req.query.page
    if (req.query.limit) limit = req.query.limit
    skip = (page - 1) * limit
    let news = await findAllSubCategories({}, parseInt(skip), parseInt(limit));
    return makeResponse(res, SUCCESS, true, FETCH_ALL_SUBCATEGORY, news);
}));

//Get SubCategories ById
router.get('/:id', catchAsyncAction(async (req, res) => {
    let category = await findSubCategoriesById({ _id: req.params.id });
    return makeResponse(res, SUCCESS, true, FETCH_SUBCATEGORY, category);
}));

//Update SubCategories
router.patch('/:id', catchAsyncAction(async (req, res) => {
    let updatedCategory = await updateSubCategories({ _id: req.params.id }, req.body);
    return makeResponse(res, SUCCESS, true, UPDATE_SUBCATEGORY, updatedCategory);
}))

//Delete SubCategories
router.delete('/:id', catchAsyncAction(async (req, res) => {
    let category = await deleteSubCategories({ _id: req.params.id });
    return makeResponse(res, SUCCESS, true, DELETE_SUBCATEGORY, []);
}));



export const subCategoryController = router;
