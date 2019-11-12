/**
 * fjarlægir lykla sem innihalda tóm gildi úr objecti
 * @param {Object} object 
 */
function filterOutEmptyValues(object) {
  const objectToReturn = object;
  Object.keys(objectToReturn).forEach((key) => {
    if (objectToReturn[key] === null || objectToReturn[key] === undefined || objectToReturn[key] === '') {
      delete objectToReturn[key];
    }
  });
  
  return objectToReturn;
}
module.exports = {
  filterOutEmptyValues,
};