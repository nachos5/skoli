/**
 * "Gervi" API sem skilar statískum gögnum fyrir fyrirlestra. Gætum hæglega
 * tengt hérna við "alvöru" API.
 * Sameinar statísk gögn við gögn geymd í localStorage.
 */

import data from './lectures.json';

// Lykill sem við geymum vistaðar færslur undir.
const LOCALSTORAGE_KEY = 'saved_lectures';

/**
 * Sækir alla vistaða fyrirlestra í localStorage.
 * @returns {array} Fylki af slug fyrir vistaða fyrirlestra.
 */
function loadSavedLectures() {
  const arrString = localStorage.getItem(LOCALSTORAGE_KEY); // eslint-disable-line
  if (arrString) {
    return arrString.split(',');
  }
  return [];
}

/**
 * Skilar lista af fyrirlestrum, síuuðum eftir flokkum eða ekki. Gögn um það
 * hvort notandi hafi klárað fyrirlestrar er bætt við gögn.
 *
 * @param {array} filters Fylki af flokkum sem fyrirlestrar mega vera í.
 *                        Sjálfgefið [].
 * @returns {array} Fylki af fyrirlestrum.
 */
export function getLectureList(filters = []) {
  // clone-um data
  const dataToReturn = JSON.parse(JSON.stringify(data));
  // ef filterar deletum við þeim fyrirlestrum úr objectinu sem eru ekki með flokk í filterfylkinu
  if (filters.length > 0) {
    dataToReturn.lectures.forEach((l, i) => {
      if (!filters.includes(l.category)) {
        delete dataToReturn.lectures[i];
      }
    });
  }
  return dataToReturn;
}

/**
 * Sækir ákveðinn fyrirlestur eftir slug. Bætir við upplýsingum um hvort
 * fyrirlestur sé kláraður ekki.
 *
 * @param {string} slug Slug á fyrirlestri sem sækja á.
 * @returns {object} Fyrirlestri sem fannst eða null ef engin fannst.
 */
export function getLecture(slug) {
  let lecture = null;

  // sækjum fyrirlesturinn
  data.lectures.forEach((l) => {
    if (l.slug === slug) {
      lecture = l;
    }
  });

  // tékkum hvort hann sé kláraður
  let klaradur = false;
  if (lecture) {
    const lectures = loadSavedLectures();
    klaradur = lectures.includes(lecture.slug);
  }

  return { lecture, klaradur };
}

/**
 * Setur fyrirlestur sem kláraðann eða ekki eftir slug. Ef fyrirlestur var
 * kláraðar er hann settur sem ókláraður og öfugt.
 *
 * @param {string} slug Slug á fyrirlestri sem klára á.
 */
export function toggleLectureFinish(slug) {
  const arr = loadSavedLectures();
  // ef fyrirlesturinn var kláraður -> annars ekki
  if (arr.includes(slug)) {
    const index = arr.indexOf(slug);
    arr.splice(index, 1);
  } else {
    arr.push(slug);
  }
  // vistum uppfærðu útgáfuna í localstorage
  localStorage.setItem(LOCALSTORAGE_KEY, arr); // eslint-disable-line
}

/**
 * Tékkar hvort að fyrirlestur sé kláraður.
 *
 * @param {string} slug Slug á fyrirlestri sem á að athuga.
 */
export function isLectureFinished(slug) {
  const lectures = loadSavedLectures();
  const klaradur = lectures.includes(slug);
  return klaradur;
}
