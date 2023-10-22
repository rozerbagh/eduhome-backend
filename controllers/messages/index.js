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
  findMessagesById,
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
    let message = await addMessages(req.body);
    let notification = await addNotifications({
      messageid: message._id,
      userid: message.recieverid,
      isSeen: false,
    });
    return makeResponse(res, SUCCESS, true, MESSAGE_SENT, {
      message,
      notification,
    });
  })
);

router.get(
  "/getmessagebyid/:messageid",
  catchAsyncAction(async (req, res) => {
    let message = await findMessagesById({ _id: req.params.messageid });
    return makeResponse(res, SUCCESS, true, ALL_MESSAGES, message);
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
  "/send-notification",
  catchAsyncAction(async (req, res) => {
    let notification = await addNotifications(req.body);
    return makeResponse(res, SUCCESS, true, ALL_MESSAGES, notification);
  })
);
router.get(
  "/get/usernotification/:userid",
  catchAsyncAction(async (req, res) => {
    const isSeen = req.query.isSeen;
    let messages = await getUserNotifications({
      userid: req.params.userid,
      isSeen: false,
    });
    if (
      isSeen === "true" ||
      isSeen === "false" ||
      isSeen === true ||
      isSeen === false
    ) {
      messages = await getUserNotifications({
        userid: req.params.userid,
        isSeen: isSeen,
      });
    } else {
      messages = await getUserNotifications({
        userid: req.params.userid,
      });
    }
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
    const filter = { _id: { $in: valuesToMatch } };

    // Define the update you want to apply
    const update =
      req.body.updatedField === "isSeen"
        ? {
            $set: { isSeen: true },
          }
        : {
            $set: { [req.body.updatedField]: [req.body.updateValue] },
          };
    let messages = await updateNotificationByMsgId(filter, update);
    return makeResponse(res, SUCCESS, true, ALL_MESSAGES, messages);
  })
);

export const messageController = router;
