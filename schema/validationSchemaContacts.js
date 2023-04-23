const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    // .pattern(new RegExp("^\\(\\d{3}\\) \\d{3}-\\d{4}$"))
    .required(),
  favorite: Joi.bool().optional(),
});

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  // .pattern(new RegExp("^\\(\\d{3}\\) \\d{3}-\\d{4}$")),
  favorite: Joi.boolean().valid(true, false),
}).min(1);

const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  addContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
};
