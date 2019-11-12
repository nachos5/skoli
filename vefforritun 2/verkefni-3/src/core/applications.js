const express = require('express');
const xss = require('xss');

const { catchErrors } = require('./utils');
const {
  getAllApplications,
  vinnaUmsokn,
  deleteApplication,
} = require('../db/application');

const router = express.Router();

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
      .then(() => res.redirect(req.app.locals.urls.applications))
      .catch((e) => {
        console.error(e.stack);
        return next();
      });
  } else if (data.delete) {
    // ef viðkomandi er ekki admin getur hann ekki eytt umsóknum
    // ekki nóg að fela bara takka því væri samt hægt að senda post-request
    if (!req.user.admin) {
      const err = new Error();
      err.statusCode = 403;
      next(err);
    }

    // eyðum umsókninni
    await deleteApplication(data.appId)
      .then(() => res.redirect(req.app.locals.urls.applications))
      .catch((e) => {
        console.error(e.stack);
        return next();
      });
  }
}

router.post('/:application', catchErrors(postRequest));
router.get('/', catchErrors(list));

module.exports = router;
