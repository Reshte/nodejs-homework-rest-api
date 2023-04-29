const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { ctrlWrapper } = require("../helpers");
const jwt = require("jsonwebtoken");
const SEKRET_KEY = "VZbQkz0pHU";
const gravatar = require("gravatar");
const path = require("path");
const avatarDir = path.join(__dirname, "../", "public", "avatars");
const Jimp = require("jimp");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
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
};
