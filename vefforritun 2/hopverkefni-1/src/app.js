require('dotenv').config();

const express = require('express');
const cors = require('cors');
const api = require('./api/api');
const auth = require('./auth');

/**
 * curl dæmi
 * almennt: curl -d '{}' -H "Content-Type: application/json" -X POST http://localhost:3000/
 * nota jwt: curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTUxMjIxODU3LCJleHAiOjE1NTEyMjE4Nzd9.SVhW21cjpkO9V3Xe4OwxNxVX6_ns40qu7nBcaeUt9tI" http://localhost:3000/
 */

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;

const app = express();
app.use(cors());
app.use(express.json());

app.use(auth);
app.use('/', api);

function notFoundHandler(req, res, next) { // eslint-disable-line
  console.info('notfound, res.statusCode = ', res.statusCode);
  if (res.statusCode === 404) {
    console.warn('Not found', req.originalUrl);
    return res.json([
      {
        errors: ['Not Found'],
        field: 'all',
        location: 'body',
      },
    ]);
  }
  return next();
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  // Variable or parameter is not of valid type - usually comse from .*Queries.js
  if (err instanceof TypeError || err.message === 'NoResults') {
    return res.status(400).json([
      {
        errors: ['Engar niðurstöður fundust'],
        field: err.field,
        location: 'body',
      },
    ]);
  }

  // No content sent error - usually from patch or post
  if (err.status === 400 && err.message === 'NoContent') {
    if (err.method === 'patch') {
      return res.status(400).json([
        {
          errors: ['Vinsamlegast fyllið inn upplýsingar í a.m.k. í einn af þessum flokkum'],
          field: err.field,
          location: 'body',
        },
      ]);
    }
    if (err.method === 'post') {
      return res.status(400).json([
        {
          errors: ['Vinsamlegast fyllið inn upplýsingar í eftirfarandi flokka'],
          field: err.field,
          location: 'body',
        },
      ]);
    }
  }

  // 400 Bad Request
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json([
      {
        errors: ['Invalid json'],
        field: 'all',
        location: 'body',
      },
    ]);
  }

  // 401 Unauthorized
  if (err.status === 401) {
    return res.status(401).json([
      {
        errors: ['Þú hefur ekki heimild til að framkvæma þessa aðgerð / skoða þess síðu'],
        field: 'all',
        location: 'body',
      },
    ]);
  }

  // 403 Forbidden
  if (err.status === 403) {
    return res.status(403).json([
      {
        errors: ['Þessi aðgerð er bönnuð'],
        field: 'all',
        location: 'body',
      },
    ]);
  }

  // 500 Internal Server Error
  return res.status(500).json([
    {
      errors: ['Internal server error'],
      field: 'all',
      location: 'body',
    },
  ]);
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  if (host) {
    console.info(`Server running at http://${host}:${port}/`);
  }
});
