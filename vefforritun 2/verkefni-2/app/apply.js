const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const xss = require('xss');
const { storeApplication } = require('../db/db');

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

  check('simi').matches(/^[0-9]{3}(-| )?[0-9]{4}$/)
    .withMessage('Vinsamlegast skráðu inn gilt 7 stafa símanúmer'),
  sanitize('simi').blacklist('- ').toInt(),

  sanitize('texti').trim(),
  check('texti').isLength({ min: 100 })
    .withMessage('Skrifaðu að minnsta kosti 100 stafabila kynningu um þig'),

  check('radiogroup').matches(/^(Forritari|Hönnuður|Verkefnastjóri)$/)
    .withMessage('Vinsamlegast veldu starf til að sækja um'),

];

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function form(req, res) {
  const data = {
    nafn: '',
    netfang: '',
    simi: '',
    texti: '',
    starf: '',
  };
  return res.render('pages/apply', { data, invalid: data });
}

async function postRequest(req, res, next) {
  // req,body er json með parametrum beiðninnar
  const {
    nafn, netfang, simi, texti, radiogroup,
  } = req.body;

  // hreinsum óþverra úr gögnunum eins og t.d. tögg og geymum í js hlut
  const data = {
    nafn: xss(nafn),
    netfang: xss(netfang),
    simi: xss(simi),
    texti: xss(texti),
    starf: xss(radiogroup),
  };

  // tékkum beiðnina miðað við reglurnar sem við settum
  const errors = validationResult(req);
  // ef errorar skilum við response-i með error skilaboðum
  if (!errors.isEmpty()) {
    const errorsArr = errors.array();
    // finnum alla invalid reitina
    const errorsFields = [];
    errorsArr.forEach((el) => {
      errorsFields.push(el.param);
    });

    // notum þetta til að setja class á invalid fields sem gerir þá rauða
    const invalid = {
      nafn: errorsFields.includes('nafn'),
      netfang: errorsFields.includes('netfang'),
      simi: errorsFields.includes('simi'),
      texti: errorsFields.includes('texti'),
      starf: errorsFields.includes('radiogroup'),
    };

    return res.render('pages/apply', { data, errors: errorsArr, invalid });
  }

  // geymum gildin í fylki til að nota í db queryinu
  const dataArray = Object.values(data);
  // ef errorar ekki vistum við í gagnagrunninum
  await storeApplication(dataArray)
    .then(() => res.render('pages/thanks'))
    .catch((e) => {
      console.error(e.stack);
      return next();
    });

  return dataArray;
}

router.get('/', catchErrors(form));
router.post('/', checkFormArr, catchErrors(postRequest));

module.exports = router;
