const express = require('express');
const crypto = require('crypto');
const { emailValidation, passwordValidation } = require('../validation');
const router = express.Router();

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

router.post('/',
  emailValidation,
  passwordValidation,
  (req, res) => {
  const token = generateToken();
  res.status(200).json({ token });
});

module.exports = router;