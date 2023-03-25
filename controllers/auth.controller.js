// var jwt = require("jsonwebtoken");
const common = require("../config/common");
const general = require("../config/general");
const User = require("../models/user.schema");
const common = require("../config/common");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(general.GOOGLE_CLIENT_ID);
//userlogin
const userLogin = async (req, res) => {
  // console.log(req.body);

  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    const isMatch = await common.passwordComparing(
      req.body.password,
      user.password
    );
    if (isMatch) {
      const token = await common.generateToken({
        id: user._id.toString(),
        email: user.email,
      });
      console.log(token);
      res.status(200).send({
        status: true,
        userId: user._id,
        email: user.email,
        userName: user.fullname,
        phoneno: user.phoneno,
        role: user.role,
        statuscode: 200,
        message: "Login successfully",
        token: token,
        expireTokenTime: new Date().getTime() + 60 * 24 * 60 * 60 * 1000,
      });
    } else {
      res.status(401).send({
        message: "password didn't match",
      });
    }
  } catch (error) {
    res.status(400).send({ error: error, message: "User not Found" });
  }
};

const googleSignUp = async (req, res, next) => {
  try {
    // console.log({ verified: verifyGoogleToken(req.body.credential) });
    if (req.body.credential) {
      const verificationResponse = await common.verifyGoogleToken(
        client,
        req.body.credential
      );

      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }
      req.body.username;
      req.body.fullname;
      req.body.email;
      req.body.password;
      req.body.phoneno;
      req.body.address;
      req.body.role;
      req.body.status;
      req.body.image;
      await addUser(req, res, next);
      const profile = verificationResponse?.payload;
      res.status(201).json({
        message: "Signup was successful",
        user: {
          profile: profile,
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, JWT_SECRET, {
            expiresIn: "1d",
          }),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred. Registration failed.",
    });
  }
};
//addusers
const addUser = async (req, res, next, signUpGoogle = false) => {
  try {
    const exitingUser = await User.find({ email: req.body.email });

    if (exitingUser.length > 0) {
      res.status(503).send({
        message: "unable to signup, email already exit",
        statuscode: 503,
        success: false,
      });
      return;
    }
    const {
      username,
      fullname,
      email,
      password,
      phoneno,
      address,
      role,
      status,
      image,
    } = req.body;
    const hashPassword = await common.passwordHashing(password);
    const user = new User({
      username: username,
      fullname: fullname,
      email: email,
      password: hashPassword,
      phoneno: phoneno,
      address: address,
      role: role,
      status: status,
      image: image,
    });
    const data = await user.save();
    const token = await common.generateToken({
      id: data._id.toString(),
      email: data.email,
    });
    res.status(200).send({
      success: true,
      statuscode: 200,
      message: email + "has been registered successfully",
      userId: user._id,
      email: user.email,
      userName: user.fullname,
      phoneno: user.phoneno,
      role: user.role,
      token: token,
      expireTokenTime: new Date().getTime() + 60 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.log(error);
    res
      .status(501)
      .send({ message: "Unable to signup", statuscode: 500, success: false });
  }
};
//getallusers
const getallUser = async (req, res) => {
  const admin = parseInt(req.query.admin);
  try {
    const users = await User.find({});
    if (admin === 1) {
      res.status(200).send(users);
    } else {
      res.status(200).send({
        status: "success",
        statuscode: 200,
        message: "get all users",
        data: users,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "failed",
      statuscode: "500",
      error: error,
      message: "unable to get users",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const admin = parseInt(req.query.admin);
    const user = await User.findById({ _id: req.params.id });
    if (admin === 1) {
      res.status(200).send(user);
    } else {
      res.status(200).send({
        status: "success",
        statuscode: 200,
        message: "get user details",
        data: [user],
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "failed",
      statuscode: "500",
      error: error,
      message: "unable to get user details",
    });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    const getuser = await User.findById({ _id: req.params.id });
    if (!getuser)
      return res.status(400).send({
        status: "failed",
        statuscode: 400,
        message: "unable to updated",
      });

    return res.status(200).send({
      status: "susccess",
      statuscode: 200,
      message: "user updated",
      data: [getuser],
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      statuscode: 500,
      message: "unable to updated",
      error: error,
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const admin = parseInt(req.query.admin);
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    if (admin === 1) {
      res.status(200).send({
        status: "success",
        statuscode: 200,
        message: "deleted succesfully",
        data: user,
      });
    } else {
      res.status(200).send({
        status: "success",
        statuscode: 200,
        message: "deleted succesfully",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "success",
      statuscode: "500",
      error: error,
      message: "unable to delete users",
    });
  }
};

module.exports = {
  userLogin,
  getallUser,
  deleteUser,
  updateUserDetails,
  getUserDetails,
  addUser,
  googleSignUp,
};
