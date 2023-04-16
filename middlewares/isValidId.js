const mongoose = require("mongoose");
// const { HttpError } = require("../helpers/httpError");

const isValidId = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
    return res.status(400).json({ message: "Invalid objectId" });
  }
  next();
};

module.exports = isValidId;
