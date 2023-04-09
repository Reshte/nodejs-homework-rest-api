const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(new RegExp("^\\(\\d{3}\\) \\d{3}-\\d{4}$"))
    .required(),
});

const updateContactSchema = Joi.object({
  // id: Joi.string().required(),
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(new RegExp("^\\(\\d{3}\\) \\d{3}-\\d{4}$")),
}).min(1);

module.exports = {
  addContactSchema,
  updateContactSchema,
};
