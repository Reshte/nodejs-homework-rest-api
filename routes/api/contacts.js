const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");

const { validateBody, isValidId } = require("../../middlewares");
const {
  addContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} = require("../../schema/index");

router.get("/", ctrl.getAll);

router.get("/:contactId", isValidId, ctrl.getContactbyId);

router.post("/", validateBody(addContactSchema), ctrl.createContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(updateContactSchema),
  ctrl.updateContactById
);

router.delete("/:contactId", isValidId, ctrl.deleteContact);

router.patch(
  "/:contactId/favorite",
  isValidId,
  // validateBody(updateStatusContactSchema),
  ctrl.updateStatusContact
);

module.exports = router;
