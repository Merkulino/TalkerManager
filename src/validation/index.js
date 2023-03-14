const tokenValidation = require('./tokenValidation');
const { emailValidation, passwordValidation } = require('./loginValidation');
const { talkerValidate } = require('./talkerValidation');
// const { ageFied, nameField, talkField, talkFieldRate } = require('./talkerValidation');

module.exports = {
  tokenValidation,
  emailValidation,
  passwordValidation,
  talkerValidate,
};