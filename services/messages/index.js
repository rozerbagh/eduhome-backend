import { Messages } from "../../models/index.js";

//Adds Messages
export const addMessages = async (payload = {}) => {
  let message = new Messages(payload);
  return message.save();
};

//Find Messages Id
export const findMessagesBySenderId = async (condition = {}) =>
  await Messages.find(condition).exec();

//Find all Requests
export const findAllMessages = (search, skip, limit) =>
  new Promise((resolve, reject) => {
    Messages.find(search)
      .skip(skip)
      .limit(limit)
      .sort("-createdAt")
      .then(resolve)
      .catch(reject);
  });

// //Delete Messages
// export const deleteMessage = (id) =>
//   new Promise((resolve, reject) => {
//     Messages.updateMany({ _id: { $in: id } }, { $set: { isDeleted: true } })
//       .then(resolve)
//       .catch(reject);
//   });
