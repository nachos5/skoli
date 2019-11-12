const express = require('express');
const xss = require('xss');
const { catchErrors } = require('./utils');
const { getAllUsers, getAllAdmins, changeAdminStatusQuery } = require('../db/users');

const router = express.Router();

async function response(req, res) {
  const users = await getAllUsers();

  return res.render('pages/admin', { users });
}

async function changeAdminStatus(req, res, next) {
  // ef viðkomandi notandi er ekki admin getur hann ekki framkvæmt þessa breytingu
  if (!req.user.admin) {
    const err = new Error('Þér er ekki heimilt að framkvæma þessa aðgerð');
    return next(err);
  }
  const userID = req.user.id;

  // fáum alla stjórnendur fyrir breytinguna
  const admins = await getAllAdmins();
  const beforeChange = [];
  admins.forEach((admin) => {
    beforeChange.push(admin.id.toString());
  });
  console.info(beforeChange);

  // fáum fylki af öllum userum sem eiga að vera stjórnendur eftir breytinguna
  const afterChange = Object.keys(req.body);
  // poppum submit (takkanum) úr fylkinu
  afterChange.pop();
  // hreinsum
  afterChange.forEach((e, index) => {
    this[index] = xss(e);
  });
  console.info(afterChange);

  const usersToChange = afterChange.slice(); // afritum fylkið
  beforeChange.forEach((adminID) => {
    /*
       þurfum að finna alla þá notendur sem missa admin réttindin
       það eru þeir sem eru í beforeChange fylkinu en ekki í afterChange fylkinu
    */
    if (!afterChange.includes(adminID)) {
      // leyfum ekki að fjarlægja okkar eigin admin status
      if (adminID !== userID.toString()) {
        usersToChange.push(adminID);
      }
    // ef notandi er admin fyrir og eftir á ekki að breyta honum
    } else {
      const index = usersToChange.indexOf(adminID);
      usersToChange.splice(index, 1);
    }
  });

  console.info(usersToChange);

  // vinnum umsóknina
  await changeAdminStatusQuery(usersToChange)
    .then(() => { // eslint-disable-line
      return response(req, res);
    })
    .catch((e) => {
      console.error(e);
    });

  return next();
}

router.post('/', catchErrors(changeAdminStatus));
router.get('/', catchErrors(response));

module.exports = router;
