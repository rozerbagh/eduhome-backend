var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
// var db = require('../config/db').db3;
var _conf = require('../config/general');
var User = require("../models/user.schema");

const expiringTime = new Date().getTime() + (60 * 24 * 60 * 60 * 1000)
async function generateToken(data) {
    const token = jwt.sign({ id: data.id, email: data.email }, _conf.secretKey, { expiresIn: expiringTime });
    return token
};

const checkToken = async (req, res, next) => {
    try {
        var token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization']; // Express headers are auto converted to lowercase
        if (token) {
            if (token.startsWith('Bearer ') || token.startsWith('bearer ')) {
                token = token.slice(7, token.length);
                const decoded = jwt.verify(token, _conf.secretKey);

                const user = await User.findById({ _id: decoded.id });
                if (!user) return res.status(404).send({
                    "statuscode": "404",
                    "status": false,
                    "error": "err",
                    message: "Unauthorised Token"
                });
                req.payload = decoded
                next();
            } else {
                return res.status(401).send({
                    "statuscode": "401",
                    "status": false,
                    "error": 401,
                    message: "Unauthorised Process"
                });
            }

        } else {
            return res.status(402).send({
                "statuscode": "402",
                "status": false,
                "error": 402,
                message: "Authentication parameters are missing"
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(404).send({
            "statuscode": "404",
            "status": false,
            "error": err,
            message: "Invalid Token!"
        });
    }

};

const checkAdminToken = async (req, res, next) => {
    // req.body.token || req.query.token ||
    // invalid token - synchronous
    try {
        var token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token) {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }
            const decoded = jwt.verify(token, _conf.secretKey);
            // console.log(decoded.data)
            const user = await User.findById({ _id: decoded.data._id });
            if (!user) return res.status(404).send({
                "statuscode": "404",
                "status": false,
                "error": err,
                message: "Unauthorised Token"
            });
            next();
        }
    } catch (err) {
        return res.status(404).send({
            "statuscode": "404",
            "status": false,
            "error": err,
            message: "Invalid Token"
        });
    }

};

const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
async function passwordHashing(password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync("B4c0/\/", salt);
    var passwordHash = await bcrypt.hash(password, 8);
    return passwordHash;
}
async function passwordComparing(password, hashPassword) {
    var isMatch = await bcrypt.compare(password, hashPassword);
    return isMatch;
}
module.exports = {
    checkToken,
    checkAdminToken,
    generateToken,
    passwordHashing,
    passwordComparing,
    validateEmail
}