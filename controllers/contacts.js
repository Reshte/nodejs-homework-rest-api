const Contact = require("../models/contact");
const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "", { skip, limit });
  res.status(200).json(result);
};

const getContactbyId = async (req, res, next) => {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const result = await Contact.findOne({ _id: contactId, owner: userId });
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(result);
};

const createContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { name, email, phone, favorite } = req.body;
  const result = await Contact.create({ name, email, phone, favorite, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const result = await Contact.findOneAndRemove({
    _id: contactId,
    owner: userId,
  });
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    req.body,
    {
      new: true,
    }
  );
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  if (req.body.favorite === undefined) {
    res.status(400).json({ message: "Missing field favorite" });
    return;
  }
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    req.body,
    {
      new: true,
    }
  );
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getContactbyId: ctrlWrapper(getContactbyId),
  createContact: ctrlWrapper(createContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContactById: ctrlWrapper(updateContactById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
