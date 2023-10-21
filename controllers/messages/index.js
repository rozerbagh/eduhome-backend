import Router from "express";
import {
  catchAsyncAction,
  makeResponse,
  responseMessages,
  statusCodes,
} from "../../helpers/index.js";
import { userAuth } from "../../middleware/index.js";
import {
  addMessages,
  findMessagesBySenderId,
  updateNotificationByMsgId,
  addNotifications,
  getUserNotifications,
} from "../../services/index.js";

//Response Status code
const { SUCCESS } = statusCodes;

//Response Messages
const { MESSAGE_SENT, MESSAGE_NOT_SENT, ALL_MESSAGES } = responseMessages;

const router = Router();

//Messages Added
router.post(
  "/send",
  userAuth,
  catchAsyncAction(async (req, res) => {
    console.log(req.body);
    let message = await addMessages(req.body);
    return makeResponse(res, SUCCESS, true, MESSAGE_SENT, message);
  })
);

//Get Messages ById
router.get(
  "/:senderid",
  catchAsyncAction(async (req, res) => {
    let messages = await findMessagesBySenderId({
      $or: [
        { senderid: req.params.senderid },
        { recieverid: req.params.senderid },
      ],
    });
    return makeResponse(res, SUCCESS, true, ALL_MESSAGES, messages);
  })
);
//Get Messages ById
router.get(
  "/:senderid/:recieverid",
  catchAsyncAction(async (req, res) => {
    let messages = await findMessagesBySenderId({
      $or: [
        { senderid: req.params.senderid },
        { recieverid: req.params.senderid },
        { senderid: req.params.recieverid },
        { recieverid: req.params.recieverid },
      ],
    });
    return makeResponse(res, SUCCESS, true, ALL_MESSAGES, messages);
  })
);

// Notifications
router.post(
  "/send/:recieverid",
  catchAsyncAction(async (req, res) => {
    let notification = await addNotifications(req.body);
    return makeResponse(res, SUCCESS, true, ALL_MESSAGES, notification);
  })
);
router.get(
  "/get/:userid",
  catchAsyncAction(async (req, res) => {
    let messages = await getUserNotifications({
      userid: req.params.userid,
    });
    return makeResponse(res, SUCCESS, true, ALL_MESSAGES, messages);
  })
);
router.patch(
  "/update",
  catchAsyncAction(async (req, res) => {
    // Define an array of values you want to match
    const valuesToMatch = [];
    req.body.data.forEach((ele) => valuesToMatch.push(ele));

    // Define the filter to match documents with the values in the array
    const filter = { messageid: { $in: valuesToMatch } };

    // Define the update you want to apply
    const update = { $set: { [req.bod.updatedField]: [req.body.updateValue] } };
    let messages = await updateNotificationByMsgId(filter, update);
    return makeResponse(res, SUCCESS, true, ALL_MESSAGES, messages);
  })
);

export const messageController = router;
