const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { ctrlWrapper } = require("../helpers");
const jwt = require("jsonwebtoken");
const SEKRET_KEY = "VZbQkz0pHU";
const gravatar = require("gravatar");
const path = require("path");
const avatarDir = path.join(__dirname, "../", "public", "avatars");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../helpers/sendEmail");
const { verify } = require("crypto");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationCode}">Click to verify email</a>`,
  };

  try {
    await sendEmail(verifyEmail);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to send verification email" });
  }

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  await User.findByIdAndUpdate(user._id, {
    verificationCode: null,
    verify: true,
  });
  return res.status(200).json({ message: "Verification successful" });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationCode}">Click to verify email</a>`,
  };

  try {
    await sendEmail(verifyEmail);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to send verification email" });
  }

  return res.status(200).json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  if (!verify.false) {
    return res.status(401).json({ message: "Email not verified" });
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    return res.status(401).json({ message: "Email or password  is wrong" });
  }

  const payload = { id: user._id };

  const token = jwt.sign(payload, SEKRET_KEY, { expiresIn: "20h" });
  await User.findByIdAndUpdate(user._id, { token });
  return res
    .json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    })
    .status(200);
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  return res.status(204).end();
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;

  return res.status(200).json({
    email,
    subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tepmUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);

  Jimp.read(tepmUpload, (err, image) => {
    if (err) throw err;
    image.resize(250, 250);
    image.write(resultUpload, (err) => {
      if (err) throw err;
    });
  });

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL }).status(200);
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerificationEmail: ctrlWrapper(resendVerificationEmail),
};
