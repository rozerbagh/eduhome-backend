import jwt from "jsonwebtoken";
import config from "config";
import {
  makeResponse,
  statusCodes,
  responseMessages,
} from "../../helpers/index.js";
import { findUserDetail } from "../../services/index.js";

const { UNAUTHORIZED } = responseMessages;
const { FORBIDDEN, AUTH_ERROR } = statusCodes;

export const userAuth = async (req, res, next) => {
  //get the token from the header if present
  const token = req.headers["authorization"] || req.headers["authorization"];

  //if no token found, return response (without going to the next middelware)
  if (!token) return makeResponse(res, AUTH_ERROR, false, UNAUTHORIZED);

  try {
    const decoded = jwt.verify(token, "myprivatekey");
    const userRecord = await findUserDetail({ _id: decoded.id });
    if (!userRecord) return makeResponse(res, FORBIDDEN, false, UNAUTHORIZED);
    if (userRecord.isDeleted)
      return makeResponse(res, FORBIDDEN, false, UNAUTHORIZED);
    if (userRecord) {
      req.userData = userRecord;
      next();
    } else {
      return makeResponse(res, AUTH_ERROR, false, UNAUTHORIZED);
    }
  } catch (error) {
    //if invalid token
    return makeResponse(res, FORBIDDEN, false, error.message);
  }
};
