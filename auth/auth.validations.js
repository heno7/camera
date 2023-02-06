const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")).required(),
});

// const registerSchema = Joi.object({
//   username: Joi.string().alphanum().min(3).max(30).required(),

//   email: Joi.string()
//     .email({
//       minDomainSegments: 2,
//       tlds: { allow: ["com", "net"] },
//     })
//     .required(),

//   password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")).required(),

//   repeat_password: Joi.ref("password"),
// }).with("password", "repeat_password");

const registerSchema = loginSchema
  .append({
    username: Joi.string().alphanum().min(3).max(30).required(),
    repeat_password: Joi.ref("password"),
  })
  .with("password", "repeat_password");

module.exports = { registerSchema, loginSchema };
