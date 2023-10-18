import Router from "express";
import {
  catchAsyncAction,
  makeResponse,
  responseMessages,
  statusCodes,
} from "../../helpers/index.js";
import { userAuth } from "../../middleware/index.js";
import { addMessages, findMessagesBySenderId } from "../../services/index.js";

//Response Status code
const { SUCCESS } = statusCodes;

//Response Messages
const { MESSAGE_SENT, MESSAGE_NOT_SENT, ALL_MESSAGES } = responseMessages;

const router = Router();

//Courses Added
router.post(
  "/send",
  userAuth,
  catchAsyncAction(async (req, res) => {
    console.log(req.body);
    let message = await addMessages(req.body);
    return makeResponse(res, SUCCESS, true, MESSAGE_SENT, message);
  })
);

//Get Courses ById
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
//Get Courses ById
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

export const messageController = router;
