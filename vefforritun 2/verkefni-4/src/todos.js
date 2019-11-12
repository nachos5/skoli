const { query } = require('./db/db');

/**
 * Sækir öll verkefni úr gagnagrunninum
 * @param {string} position hækkandi eða lækkandi röðun, ASC eða DESC
 * @param {boolean} onlyCompleted skilar öllum verkefnum með false en einungis kláruðum með true
 */
async function getAllTodos(order = 'ASC', onlyCompleted = null) {

  let completed = '';
  if (onlyCompleted === null) {
    completed += 'completed=true OR completed=false';
  } else if (onlyCompleted) {
    completed += 'completed=true';
  } else {
    completed += 'completed=false';
  }

  // order og completed eru föst gildi frá bakendanum svo við þurfum
  // ekki prepared sql
  const sql = `SELECT
                id, 
                title, 
                position,
                due, 
                created, 
                updated, 
                completed
              FROM 
                todos 
              WHERE
                ${completed}
              ORDER BY
                created, id
              ${order}`;
  const results = await query(sql);
  return results.rows;
}

/**
 * Sækir verkefni úr gagnagrunninum eftir id-gildi
 * @param {number} id id gildi þess verkefnis sem skal sækja
 */
async function getTodoById(id) {
  const sql = `SELECT
                id,
                title,
                position,
                due,
                created,
                updated,
                completed
              FROM
                todos
              WHERE
                id=$1`;

  const results = await query(sql, [id]);
  return results.rows;
}

/**
 * Sækir verkefnið sem var síðast sett inn
 */
async function getLatestTodo() {
  const sql = `SELECT
                id,
                title,
                position,
                due,
                created,
                updated,
                completed
              FROM
                todos
              ORDER BY
                id
              DESC LIMIT 1`;

  const results = await query(sql);
  return results.rows;
}

/**
 * Bætir við nýju verkefni í gagnagrunninn
 * @param {string} title titill verkefnis
 * @param {number} position röðunargildi - jákvæð heiltala
 * @param {string} due lokadagsetning - datetime strengur
 */
async function createTodo(title, position = 0, due = null) {
  const sql = `INSERT INTO
                todos (
                  title,
                  position,
                  due
                )
              VALUES (
                $1,
                $2,
                $3
              );`;

  await query(sql, [title, position, due]);
  const latest = await getLatestTodo();
  return latest;
}

/**
 * Uppfærir verkefni eftir id
 * @param {number} id id gildi þess verkefnis sem skal breyta
 * @param {object} data json object sem heldur utan um title, position, due og completed
 */
async function updateTodoById(id, data) {
  // bætum dýnamískt við sql query-ið eftir því hvað við ætlum að update-a
  // augljóslega hægt að gera betur skalanlegt en læt duga í bili
  let sql = 'UPDATE todos SET';
  const values = [id];
  let valueCounter = 2;
  let spaceOrComma = ' ';

  const sqlTitle = `title=$${valueCounter}`;
  if (typeof data.title === 'string') {
    sql += `${spaceOrComma}${sqlTitle}`;
    values.push(data.title);
    valueCounter += 1;
    spaceOrComma = ',';
  }

  const sqlPosition = `position=$${valueCounter}`;
  if (typeof data.position === 'number') {
    sql += `${spaceOrComma}${sqlPosition}`;
    values.push(data.position);
    valueCounter += 1;
    spaceOrComma = ',';
  }

  const sqlDue = `due=$${valueCounter}`;
  if (typeof data.due === 'string') {
    sql += `${spaceOrComma}${sqlDue}`;
    values.push(data.due);
    valueCounter += 1;
    spaceOrComma = ',';
  }

  const sqlCompleted = `completed=$${valueCounter}`;

  if (typeof data.completed === 'boolean') {
    sql += `${spaceOrComma}${sqlCompleted}`;
    values.push(data.completed);
    valueCounter += 1;
  }

  sql += ' WHERE id=$1;';

  console.info(data);
  console.info(sql);

  await query(sql, values);
  // skilum verkefninu sem við vorum að update-a
  const todo = await getTodoById(id);
  return todo;
}

/**
 * Eyðir verkefni úr gagnagrunninum eftir id-gildi
 * @param {number} id id-gildi þess verkefnis sem skal eyða
 */
async function deleteTodoById(id) {
  const sql = `DELETE FROM
                todos
               WHERE
                id=$1`;

  const results = await query(sql, [id]);
  return results.rowCount;
}

module.exports = {
  getAllTodos,
  getTodoById,
  getLatestTodo,
  createTodo,
  updateTodoById,
  deleteTodoById,
};
