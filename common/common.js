var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// var db = require('../config/db').db3;
var _conf = require("./general");
var User = require("../models/user.schema");

const expiringTime = new Date().getTime() + 60 * 24 * 60 * 60 * 1000;
async function generateToken(data) {
  const token = jwt.sign({ id: data.id, email: data.email }, _conf.secretKey, {
    expiresIn: expiringTime,
  });
  return token;
}

module.exports.checkToken = async (req, res, next) => {
  try {
    var token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
    if (token) {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }
      const decoded = jwt.verify(token, _conf.secretKey);
      console.log(decoded.data);
      const user = await User.findById({ _id: decoded.data._id });
      if (!user)
        return res.status(404).send({
          statuscode: "404",
          status: false,
          error: err,
          message: "Unauthorised Token",
        });
      next();
    }
  } catch (err) {
    return res.status(404).send({
      statuscode: "404",
      status: false,
      error: err,
      message: "Invalid Token!",
    });
  }
};

module.exports.checkAdminToken = async (req, res, next) => {
  // req.body.token || req.query.token ||
  // invalid token - synchronous
  try {
    var token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
    if (token) {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }
      const decoded = jwt.verify(token, _conf.secretKey);
      // console.log(decoded.data)
      const user = await User.findById({ _id: decoded.data._id });
      if (!user)
        return res.status(404).send({
          statuscode: "404",
          status: false,
          error: err,
          message: "Unauthorised Token",
        });
      next();
    }
  } catch (err) {
    return res.status(404).send({
      statuscode: "404",
      status: false,
      error: err,
      message: "Invalid Token",
    });
  }
};

module.exports.validateEmail = (email) => {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
async function passwordHashing(password) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync("B4c0//", salt);
  var passwordHash = await bcrypt.hash(password, 8);
  return passwordHash;
}
async function passwordComparing(password, hashPassword) {
  var isMatch = await bcrypt.compare(password, hashPassword);
  return isMatch;
}
async function verifyGoogleToken(client, token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: _conf.GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}
module.exports = {
  generateToken,
  passwordHashing,
  passwordComparing,
  verifyGoogleToken,
};
