const express = require('express');
const util = require('util');
const fs = require('fs');

const router = express.Router();
const lecturesJsonPath = './data/lectures.json';
const validCategories = ['html', 'css', 'javascript'];

// látum fallið skila loforði
const readFilePromise = util.promisify(fs.readFile);

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

// lesum json streng og pörsum í object
async function readJSONAsync(path) {
  const jsonString = await readFilePromise(path, 'utf8');
  const jsonObj = JSON.parse(jsonString);
  return jsonObj;
}

/*
  Fall sem finnur (síar) fyrirlestur
*/
function findLecture(jsonFile, parameter, parameterValue) {
  return new Promise((resolve, reject) => {
    Object.keys(jsonFile.lectures).forEach((i) => {
      const curValue = jsonFile.lectures[i][parameter];
      if (curValue === parameterValue) {
        resolve(jsonFile.lectures[i]);
      }
    });
    reject();
  });
}

/*
  Fall sem finnur (síar) fyrirlestra
*/
function findLectures(jsonFile, parameter, parameterValue) {
  return new Promise((resolve, reject) => {
    const jsonFileCopy = jsonFile;
    for (let i = 0; i < jsonFileCopy.lectures.length; i += 1) {
      const curValue = jsonFileCopy.lectures[i][parameter];
      if (curValue !== parameterValue) {
        delete jsonFileCopy.lectures[i];
      }
    }
    if (Object.keys(jsonFileCopy).length > 0) {
      resolve(jsonFileCopy);
    } else {
      reject();
    }
  });
}

async function list(req, res) {
  const jsonFile = await readJSONAsync(lecturesJsonPath);
  res.render('pages/list', { json: jsonFile, category: '' });
}

async function filteredList(req, res, next) {
  const jsonFile = await readJSONAsync(lecturesJsonPath);
  let cat = req.params.category; // flokkurinn
  if (cat === 'js') cat = 'javascript';
  if (validCategories.includes(cat)) {
    // við viljum bara fyrirlestra úr flokknum
    const filteredJson = await findLectures(jsonFile, 'category', cat);
    res.render('pages/list', { json: filteredJson, category: cat });
  } else {
    next();
  }
}

async function lecture(req, res, next) {
  // tékkum hvort við séum með valid flokk fyrst
  if (!validCategories.includes(req.params.category)) {
    next();
  }

  const jsonFile = await readJSONAsync(lecturesJsonPath);
  // finnum fyrirlesturinn með þetta slug (úr params)
  const currLecture = await findLecture(jsonFile, 'slug', req.params.slug, res);
  res.render('pages/lecture', { lecture: currLecture }); // fyrirlestur fannst og við renderum hann
}

// listi yfir allt
router.get('/', catchErrors(list));
// filterum eftir flokki
router.get('/:category', catchErrors(filteredList));
// greinin birtist undir sínum flokki
router.get('/:category/:slug', catchErrors(lecture));


module.exports = router;
