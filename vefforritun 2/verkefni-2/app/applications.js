const express = require('express');
const xss = require('xss');
const {
  getAllApplications,
  vinnaUmsokn,
  deleteApplication,
} = require('../db/db');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function list(req, res) {
  // fylki js objectum með öllum umsóknum
  const allApps = await getAllApplications();
  res.render('pages/applications', { allApps });
}

async function postRequest(req, res, next) {
  // sjáum á hvort takkann var smellt (hinn er undefined)
  const {
    updateButton, deleteButton,
  } = req.body;
  // sækjum id-ið á umsókninni
  const appId = req.params.application;
  // hreinsun
  const data = {
    update: xss(updateButton),
    delete: xss(deleteButton),
    appId: parseInt(xss(appId), 10),
  };

  if (data.update) {
    // vinnum umsóknina
    await vinnaUmsokn(data.appId)
      .then(() => res.render('pages/success'))
      .catch((e) => {
        console.error(e.stack);
        return next();
      });
  } else if (data.delete) {
    // eyðum umsókninni
    await deleteApplication(data.appId)
      .then(() => res.render('pages/success'))
      .catch((e) => {
        console.error(e.stack);
        return next();
      });
  }
}

router.post('/:application', catchErrors(postRequest));
router.get('/', catchErrors(list));

module.exports = router;
