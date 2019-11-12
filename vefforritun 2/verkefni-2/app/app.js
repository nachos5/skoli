require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const apply = require('./apply');
const applications = require('./applications');

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));

// bodyparser middleware-inn auðveldar aðgang að parametrum úr beiðnum
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// umsóknarsíða (router)
app.use('/', apply);
// yfirlitssíða (router)
app.use('/applications', applications);

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).render('pages/error', { title: '404', error: '404 fannst ekki' });
}

function errorHandler(error, req, res, next) { // eslint-disable-line
  console.error(error);
  res.status(500).render('pages/error', { title: 'Villa', error });
}

app.use(notFoundHandler);
app.use(errorHandler);

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
