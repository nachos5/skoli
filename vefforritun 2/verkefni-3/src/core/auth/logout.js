const express = require('express');

const { catchErrors } = require('../utils');

const router = express.Router();

async function logout(req, res) {
  if (req.user) {
    req.logout();
  }
  return res.redirect('/');
}

router.post('/', catchErrors(logout));

module.exports = router;
