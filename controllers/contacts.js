const Contact = require("../models/contact");
const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res, next) => {
  const result = await Contact.find();
  res.status(200).json(result);
};

const getContactbyId = async (req, res, next) => {
  const result = await Contact.findById(req.params.contactId);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(result);
};

const createContact = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  const result = await Contact.create({ name, email, phone, favorite });
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove({ _id: contactId });
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate({ _id: contactId }, req.body, {
    new: true,
  });
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res, next) => {
  console.log(req.body.favorite);
  if (req.body.favorite === undefined) {
    res.status(400).json({ message: "Missing field favorite" });
    return;
  }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
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
