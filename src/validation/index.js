const tokenValidation = require('./tokenValidation');
const { emailValidation, passwordValidation } = require('./loginValidation');
const { talkerValidate } = require('./talkerValidation');

module.exports = {
  tokenValidation,
  emailValidation,
  passwordValidation,
  talkerValidate,
};