const bcrypt = require('bcrypt');

const saltRounds = 10;

/**
 * Higher-order fall sem umlykur async middleware með villumeðhöndlun.
 *
 * @param {function} fn Middleware sem grípa á villur fyrir
 * @returns {function} Middleware með villumeðhöndlun
 */
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/**
 * Fall sem finnur þá fielda úr gefnu fieldunum sem er í error fylkinu
 *
 * @param {object[]} errorsArr error fylki
 * @param {string[]} fields þeir fieldar sem formið notar
 */
function invalidArray(errorsArr, fields) {
  // finnum alla invalid reitina
  const errorsFields = [];
  errorsArr.forEach((el) => {
    errorsFields.push(el.param);
  });

  // notum þetta til að setja class á invalid fields sem gerir þá rauða
  const invalid = {};
  fields.forEach((f) => {
    invalid[f] = errorsFields.includes(f);
  });

  return invalid;
}


/**
 * Fall sem sér um að útbúa hash fyrir lykilorð
 *
 * @param {string} password lykilorðið á venjulegu strengjasniði
 */
async function passwordHash(password) {
  const pwHash = await bcrypt.hash(password, saltRounds).then((hash) => {
    console.info(hash);
    return hash;
  });

  return pwHash;
}

module.exports = {
  catchErrors,
  invalidArray,
  passwordHash,
};
