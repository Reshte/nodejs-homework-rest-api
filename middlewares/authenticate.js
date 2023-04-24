const jwt = require("jsonwebtoken");
const SEKRET_KEY = "VZbQkz0pHU";
const { User } = require("../models/user");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (!bearer === "Bearer") {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const { id } = jwt.verify(token, SEKRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || !user.token === token) {
      return res.status(401).json({ message: "Not  authorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = authenticate;
