const express = require("express");
const router = express.Router();

const contacts = require("../../models/contacts");

const { HttpError } = require("../../helpers");

const { addContactSchema, updateContactSchema } = require("../../validation");

router.use(express.json());

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const result = await contacts.getContactById(req.params.contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "Missing required name field");
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    console.log(req.body);
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "Missing fields");
    }
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(400, "Contact not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// option 1
// const express = require("express");

// const contacts = require("../../models/contacts");

// const router = express.Router();

// const Joi = require("joi");

// const { HttpError } = require("../../helpers");

// router.use(express.json());

// const addContactSchema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().email().required(),
//   phone: Joi.string()
//     .pattern(new RegExp("^\\(\\d{3}\\) \\d{3}-\\d{4}$"))
//     .required(),
// });

// const updateContactSchema = Joi.object({
//   id: Joi.string().alphanum().required(),
//   name: Joi.string(),
//   email: Joi.string().email(),
//   phone: Joi.string().pattern(new RegExp("^\\(\\d{3}\\) \\d{3}-\\d{4}$")),
// }).min(1);

// router.get("/", async (req, res, next) => {
//   try {
//     const result = await contacts.listContacts();
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/:contactId", async (req, res, next) => {
//   try {
//     const result = await contacts.getContactById(req.params.contactId);
//     if (!result) {
//       throw HttpError(404, "Not found");
//       // const error = new Error("Not found");
//       // error.status = 404;
//       // throw error;
//       // return res.status(404).json({ message: "Not found" });
//     }
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//     // const { status = 500, message = "Server error" } = error;
//     // res.status(status).json({ message });
//   }
// });

// router.post("/", async (req, res, next) => {
//   try {
//     const { error } = addContactSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: "missing required name field" });
//     }
//     const result = await contacts.addContact(req.body);
//     res.status(201).json(result);
//   } catch (error) {
//     next(error);
//   }
// });

// router.delete("/:contactId", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const result = await contacts.removeContact(id);
//     if (!result) {
//       return res.status(404).json({ message: "Not found" });
//     }
//     res.status(200).json({ message: "contact deleted" });
//   } catch (error) {
//     next(error);
//   }
// });

// router.put("/:contactId", async (req, res, next) => {
//   try {
//     console.log(req.body);
//     const { error } = updateContactSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: "missing fields" });
//     }
//     const { id } = req.body;
//     const result = await contacts.updateContact(id, req.body);
//     if (!result) {
//       return res.status(400).json({ message: "Contact not found" });
//     }
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
