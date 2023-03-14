const tokenValidation = require('./tolkenValidation');
const { emailValidation, passwordValidation } = require('./loginValidation');
const { talkerValidate } = require('./talkerValidation');

module.exports = {
  tokenValidation,
  emailValidation,
  passwordValidation,
  talkerValidate,
};