const express = require('express');
const path = require('path');
const lectures = require('./lectures.js');

const app = express();
const port = process.env.PORT || 3000;

// notum ejs fyrir viewin okkar
app.set('view engine', 'ejs');

// pathinn á viewin okkar
app.set('views', path.join(__dirname, 'views'));

// static skrár
app.use(express.static('public'));

// fyrirlestralisti (router)
app.use('/', lectures);

// ef við komumst hingað er slóðin ekki til
app.get('*', (req, res) => {
  res.render('pages/404');
});

// ræsa serverinn
app.listen(port, () => {
  console.info('Flott og ekkert vesen!');
});
