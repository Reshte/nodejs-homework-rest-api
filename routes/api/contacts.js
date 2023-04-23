const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");

const { validateBody, isValidId } = require("../../middlewares");
const {
  addContactSchema,
  updateContactSchema,
  // updateStatusContactSchema,
} = require("../../schema/index");
const { authenticate } = require("../../middlewares");

router.get("/", authenticate, ctrl.getAll);

router.get("/:contactId", authenticate, isValidId, ctrl.getContactbyId);

router.post(
  "/",
  authenticate,
  validateBody(addContactSchema),
  ctrl.createContact
);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  ctrl.updateContactById
);

router.delete("/:contactId", authenticate, isValidId, ctrl.deleteContact);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  // validateBody(updateStatusContactSchema),
  ctrl.updateStatusContact
);

module.exports = router;
