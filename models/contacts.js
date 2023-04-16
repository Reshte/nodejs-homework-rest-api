// const Contact = require("../models/contact");

// const listContacts = async () => {
//   return Contact.find();
// };

// const getContactById = async (contactId) => {
//   const contact = Contact.findOne({ _id: contactId });
//   return contact;
// };

// const removeContact = async (contactId) => {
//   return Contact.findByIdAndRemove({ _id: contactId });
// };

// const addContact = async (body) => {
//   return Contact.create({
//     name: body.name,
//     email: body.email,
//     phone: body.phone,
//   });
// };

// const updateContact = async (contactId, body) => {
//   return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });
// };

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };
