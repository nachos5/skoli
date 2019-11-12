const xss = require('xss');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { validationResult } = require('express-validator/check');

const readdirAsync = util.promisify(fs.readdir);
const readFileAsync = util.promisify(fs.readFile);

/**
 * Higher-order fall sem umlykur async middleware með villumeðhöndlun.
 *
 * @param {function} fn Middleware sem grípa á villur fyrir
 * @returns {function} Middleware með villumeðhöndlun
 */
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

function dynamicUpdateString(tableName, fields, conditionField, update = false) {
  let sql = `UPDATE ${tableName} SET `;
  let index = 1;

  if (update) {
    sql += 'created=current_timestamp, updated=current_timestamp,';
  }

  fields.forEach((field) => {
    sql += `${field}=$${index}`;
    if (index !== fields.length) {
      sql += ',';
    }
    index += 1;
  });

  sql += ` WHERE ${conditionField}=$${index} RETURNING *`;
  return sql;
}

function filterOutNullValues(object) {
  const objectToReturn = object;
  Object.keys(objectToReturn).forEach((key) => {
    if (objectToReturn[key] === null || objectToReturn[key] === undefined || objectToReturn[key] === '') {
      delete objectToReturn[key];
    }
  });
  return {
    object: objectToReturn,
    fields: Object.keys(objectToReturn),
    values: Object.values(objectToReturn),
  };
}

/**
 * Extract values from req with key 'item',
 * if no value is found for a key, the value is ''.
 * Returns a sanitized, with xss, Object.
 *
 * @param {String[]} items - Array of keys to extract
 * @param  {...Object} body - Objects to extract from
 */
function xssSanitize(items, ...body) {
  const sanitized = {};
  items.forEach((key) => {
    sanitized[key] = ((item) => {
      if (item) {
        if (typeof item[key] === 'number') {
          return item[key];
        }
        return xss(item[key]);
      }
      return '';
    })(body.find(item => item[key]));
  });
  return sanitized;
}

function errorMessages(req) {
  const errors = validationResult(req);
  let err = null;
  let prevLocation = null;
  let prevParam = null;
  let offset = 1; // To refer to the correct element in err

  if (!errors.isEmpty()) {
    err = [];
    errors.array().forEach((e, i) => {
      // Combine error messages with the same location and parameter
      if (prevParam === e.param && prevLocation === e.location) {
        err[i - offset].errors.push(e.msg);
        offset += 1;
      } else {
        err.push({
          location: e.location,
          field: e.param,
          errors: [e.msg],
        });
      }
      prevLocation = e.location;
      prevParam = e.param;
    });
  }
  return err;
}

// Read JSON file and return a JSON object
async function readFileJSON(filepath) {
  return readFileAsync(filepath, 'utf8')
    .then(data => JSON.parse(data))
    .catch((err) => {
      throw err;
    });
}

function getImageFolder() {
  return path.join(__dirname, '../img');
}

function getImagePath(filename) {
  return path.join(getImageFolder(), filename);
}

// skilar fylki af öllum myndunum í myndmöppunni
async function getAllImages() {
  const dirPath = getImageFolder();
  const filesToReturn = await readdirAsync(dirPath);
  const allowedExt = ['jpg', 'png', 'gif'];
  filesToReturn.forEach((file, i) => {
    console.info(file);
    const split = file.split('.');
    const ext = split[split.length - 1];
    if (!allowedExt.includes(ext)) {
      filesToReturn.splice(i, 1);
    }
  });
  console.info('MYNDIR:', filesToReturn);
  return filesToReturn;
}

function getResults(results) {
  if (results.rowCount > 1) {
    return results.rows;
  }
  return results.rows[0];
}

module.exports = {
  catchErrors,
  dynamicUpdateString,
  filterOutNullValues,
  xssSanitize,
  errorMessages,
  getImageFolder,
  getImagePath,
  getAllImages,
  readFileJSON,
  getResults,
};
