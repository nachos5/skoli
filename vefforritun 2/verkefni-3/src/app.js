require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const passport = require('passport');
const { Strategy } = require('passport-local');

const apply = require('./core/apply');
const register = require('./core/auth/register');
const login = require('./core/auth/login');
const logout = require('./core/auth/logout');
const admin = require('./core/admin');
const applications = require('./core/applications');
const { comparePasswords, findByUsername, findById } = require('./db/users');

const sessionSecret = process.env.SESSION_SECRET; // sótt úr env gegnum dotenv pakka

if (!sessionSecret) {
  console.error('Add SESSION_SECRET to .env');
  process.exit(1);
}

const app = express();

// bodyparser middleware-inn auðveldar aðgang að parametrum úr beiðnum
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// session middleware-inn okkar
app.use(session({
  genid: (req) => {
    console.info(req.sessionID);
    return uuid(); // notum UUID fyrir session ID
  },
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

/**
 * Athugar hvort username og password sé til í notandakerfi.
 * Callback tekur við villu sem fyrsta argument, annað argument er
 * - `false` ef notandi ekki til eða lykilorð vitlaust
 * - Notandahlutur ef rétt
 *
 * @param {string} username Notandanafn til að athuga
 * @param {string} password Lykilorð til að athuga
 * @param {function} done Fall sem kallað er í með niðurstöðu
 */
async function strat(username, password, done) {
  try {
    const user = await findByUsername(username);
    if (!user) {
      return done(null, false);
    }

    // Verður annað hvort notanda hlutur ef lykilorð rétt, eða false
    const result = await comparePasswords(password, user);
    return done(null, result);
  } catch (err) {
    console.error(err);
    return done(err);
  }
}

// Notum local strategy með „strattinu“ okkar til að leita að notanda
passport.use(new Strategy(strat));

// Geymum id á notanda í session, það er nóg til að vita hvaða notandi þetta er
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Sækir notanda út frá id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Látum express nota passport með session
app.use(passport.initialize());
app.use(passport.session());

// Hjálpar middleware sem athugar hvort notandi sé innskráður og hleypir okkur
// þá áfram, annars sendir á /login
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect(req.app.locals.urls.login);
}

// Gott að skilgreina eitthvað svona til að gera user hlut aðgengilegan í
// viewum ef við erum að nota þannig
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    // getum núna notað user í viewum
    res.locals.user = req.user;
  }

  next();
});

app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));

// sækjum urlana héðan alltaf svo ef það þarf að breyta þarf bara að gera það einu sinni hérna
// hægt að nálgast með req.app.locals.urls í routes
app.locals.urls = {
  apply: '/',
  register: '/register',
  login: '/login',
  logout: '/logout',
  applications: '/applications',
  admin: '/admin',
};

app.use(app.locals.urls.apply, apply);
app.use(app.locals.urls.register, register);
app.use(app.locals.urls.login, login);
app.use(app.locals.urls.logout, logout);
app.use(app.locals.urls.applications, ensureLoggedIn, applications);
app.use(app.locals.urls.admin, ensureLoggedIn, admin);

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).render('pages/error', { page: 'error', title: '404', error: '404 fannst ekki' });
}

function errorHandler(error, req, res, next) { // eslint-disable-line
  res.status(500).render('pages/error', {
    page: 'error',
    title: 'Villa',
    error,
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
