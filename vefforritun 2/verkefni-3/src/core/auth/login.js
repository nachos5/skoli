const express = require('express');
const passport = require('passport');
const { catchErrors } = require('../utils');

const router = express.Router();

async function loginForm(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  let message = '';

  // Athugum hvort einhver skilaboð séu til í session, ef svo er birtum þau
  // og hreinsum skilaboð
  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  const data = {
    username: '',
    password: '',
  };
  return res.render('pages/auth/login', { data, invalid: data, message });
}

async function login(req, res) {
  return res.redirect(req.app.locals.urls.admin);
}

router.get('/', catchErrors(loginForm));
router.post('/',
  passport.authenticate('local', {
    failureMessage: 'Notandi eða lykilorð vitlaust.',
    failureRedirect: '/login',
  }),
  catchErrors(login));

module.exports = router;
