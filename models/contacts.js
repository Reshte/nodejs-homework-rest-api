const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsFilePath = path.join(__dirname, "contacts.json");

async function getContacts() {
  const data = await fs.readFile(contactsFilePath, "utf8");
  return JSON.parse(data);
}

async function updateContacts(contact) {
  return fs.writeFile(contactsFilePath, JSON.stringify(contact), "utf8");
}

const listContacts = async () => {
  const contacts = await getContacts();
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await getContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
};

const removeContact = async (contactId) => {
  const contacts = await getContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await updateContacts(contacts);
  return result;
};

const addContact = async (body) => {
  const contacts = await getContacts();
  const contact = {
    id: nanoid(),
    name: body.name,
    email: body.email,
    phone: body.phone,
  };
  contacts.push(contact);
  updateContacts(contacts);
  return contact;
};

const updateContact = async (contactId, body) => {
  const contacts = await getContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }

  const contact = contacts[index];
  contacts[index] = {
    ...contact,
    ...body,
  };
  await fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
