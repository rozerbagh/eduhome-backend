import { Boards, Subjects } from "../../models/index.js";

//Adds Categories
export const addBoards = async (payload = {}, role) => {
  let board = new Boards(payload);
  return board.save();
};

//Find Categories Id
export const findBoardById = async (condition = {}) =>
  await Boards.findOne(condition).exec();

//Find all Requests
export const findAllBoards = (search, skip, limit) =>
  new Promise((resolve, reject) => {
    Boards.find(search)
      .skip(skip)
      .limit(limit)
      .sort("-createdAt")
      .then(resolve)
      .catch(reject);
  });

//Update Categories
export const updateBoard = (_id, data) =>
  new Promise((resolve, reject) => {
    Boards.findOneAndUpdate({ _id: _id }, { $set: data }, { new: true })
      .then(resolve)
      .catch(reject);
  });

//Delete Categories
export const deleteBoard = (id) =>
  new Promise((resolve, reject) => {
    Boards.updateMany({ _id: { $in: id } }, { $set: { isDeleted: true } })
      .then(resolve)
      .catch(reject);
  });

export const addSubject = async (payload = {}, role) => {
  let board = new Subjects(payload);
  return board.save();
};

//Find Categories Id
export const findSubjectById = async (condition = {}) =>
  await Subjects.findOne(condition).exec();

//Find all Requests
export const findAllSubjects = (search, skip, limit) =>
  new Promise((resolve, reject) => {
    Subjects.find(search)
      .skip(skip)
      .limit(limit)
      .sort("-createdAt")
      .then(resolve)
      .catch(reject);
  });

//Update Categories
export const updateSubject = (_id, data) =>
  new Promise((resolve, reject) => {
    Subjects.findOneAndUpdate({ _id: _id }, { $set: data }, { new: true })
      .then(resolve)
      .catch(reject);
  });

//Delete Categories
export const deleteSubject = (id) =>
  new Promise((resolve, reject) => {
    Subjects.updateMany({ _id: { $in: id } }, { $set: { isDeleted: true } })
      .then(resolve)
      .catch(reject);
  });
