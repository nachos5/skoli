const express = require('express');
const xss = require('xss');
const { body, check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const { catchErrors, invalidArray } = require('../utils');
const { findByUsername } = require('../../db/users');
const { storeUser } = require('../../db/users');

const router = express.Router();

const checkFormArr = [

  sanitize('nafn').trim(),
  check('nafn').isLength({ min: 1 })
    .withMessage('Vinsamlegast skráðu inn nafnið þitt (reiturinn er auður)'),

  sanitize('netfang').trim().normalizeEmail(),
  check('netfang').isLength({ min: 1 })
    .withMessage('Vinsamlegast skráðu inn netfangið þitt (reiturinn er auður)'),
  check('netfang').isEmail()
    .withMessage('Þetta er ekki gilt netfang'),

  sanitize('notendanafn').trim(),
  check('notendanafn').isLength({ min: 1 })
    .withMessage('Vinsamlegast skráðu inn notendanafn (reiturinn er auður)'),
  // tékkum hvort að notandi með þetta notendanafn sé nú þegar til
  body('notendanafn').custom(async (notendanafn) => {
    // ef þetta query skilar niðurstöðu er til aðgangur með netfanginu
    const userID = await findByUsername(notendanafn);
    if (userID) {
      return false;
    }
    return true;
  }).withMessage('Það er nú þegar til notandi með þetta notendanafn'),

  check('lykilord').isLength({ min: 8 })
    .withMessage('Lykilorðið verður að vera í það minnsta 8 stafir'),

  body('lykilord_stadfesta').custom((stadfesting, { req }) => {
    const eins = stadfesting === req.body.lykilord;
    return eins;
  }).withMessage('Lykilorðið var ekki rétt staðfest'),
];

async function form(req, res) {
  const data = {
    nafn: '',
    netfang: '',
    notendanafn: '',
    lykilord: '',
    lykilord_stadfesta: '',
  };
  return res.render('pages/auth/register', { data, invalid: data });
}

async function postRequest(req, res, next) {
  const {
    nafn, netfang, notendanafn, lykilord,
  } = req.body;

  // hreinsum með xss
  const data = {
    nafn: xss(nafn),
    netfang: xss(netfang),
    notendanafn: xss(notendanafn),
    lykilord: xss(lykilord),
  };

  // tékkum beiðnina miðað við reglurnar sem við settum
  const errors = validationResult(req);
  // ef errorar skilum við response-i með error skilaboðum
  if (!errors.isEmpty()) {
    const errorsArr = errors.array();

    // finnum alla invalid reitina
    const fields = ['nafn', 'netfang', 'notendanafn', 'lykilord', 'lykilord_stadfesta'];
    const invalid = invalidArray(errorsArr, fields);

    return res.render('pages/auth/register', {
      data,
      errors: errorsArr,
      invalid,
    });
  }

  // geymum gildin í fylki til að nota í db queryinu
  const dataArray = Object.values(data);
  // ef errorar ekki vistum við í gagnagrunninum
  await storeUser(dataArray)
    .then(() => res.redirect('/login'))
    .catch((e) => {
      console.error(e.stack);
      return next();
    });

  return dataArray;
}

router.get('/', catchErrors(form));
router.post('/', checkFormArr, catchErrors(postRequest));

module.exports = router;
