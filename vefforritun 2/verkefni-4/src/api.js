const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const xss = require('xss');

const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodoById,
  deleteTodoById,
} = require('./todos');

const router = express.Router();

const validatePost = [
  sanitize('title').trim(),
  check('title').isLength({ min: 1, max: 128 })
    .withMessage('Titill verður að vera strengur sem er 1 til 128 stafir'),

  sanitize('due').trim(),
  check('due').optional().isISO8601()
    .withMessage('Dagsetning verður að vera á forminu YYYY-MM-DD hh:mm:ss'),

  sanitize('position').trim(),
  check('position').optional().isInt({ gt: -1 })
    .withMessage('Staðsetning verður að vera heiltala stærri eða jöfn 0'),

  sanitize('completed').trim(),
  check('completed').optional().isBoolean()
    .withMessage('Lokið verður að vera boolean gildi'),
];

// munurinn er að title er optional
const validatePatch = [
  sanitize('title').trim(),
  check('title').optional().isLength({ min: 1, max: 128 })
    .withMessage('Titill verður að vera strengur sem er 1 til 128 stafir'),

  sanitize('due').trim(),
  check('due').optional().isISO8601()
    .withMessage('Dagsetning verður að vera gild ISO 8601 dagsetning'),

  sanitize('position').trim(),
  check('position').optional().isInt({ gt: -1 })
    .withMessage('Staðsetning verður að vera heiltala stærri eða jöfn 0'),

  sanitize('completed').trim(),
  check('completed').optional().isBoolean()
    .withMessage('Lokið verður að vera boolean gildi'),
];

function validate(errs) {
  const errors = [];
  errs.forEach((e) => {
    const tempE = {};
    tempE.field = e.param;
    tempE.message = e.msg;
    errors.push(tempE);
  });
  return errors;
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/**
 * get beiðnin á / skilar json-i með öllum verkefnum
 * @param {Object} req beiðnin
 * @param {Object} res svarið
 */
async function allTodos(req, res) {
  let orderParam = 'ASC';
  let completedParam = null;

  // sækjum leitar-parametra
  const { order, completed } = req.query;
  if (order === 'desc') {
    orderParam = 'DESC';
  }
  if (completed === 'true') {
    completedParam = true;
  }
  if (completed === 'false') {
    completedParam = false;
  }

  // sækjum öll verkefnin
  const todos = await getAllTodos(orderParam, completedParam);
  if (todos.length === 1) return res.json(todos[0]);
  if (todos.length === 0) return res.json({});

  return res.json(todos);
}

async function todoById(req, res) {
  const { id } = req.params;
  const todo = await getTodoById(id);
  if (todo.length === 0) {
    return res.status(404).json({ error: '404. Ekkert verkefni með þetta id' });
  }
  return res.status(200).json(todo[0]);
}

/**
 * Býr til nýtt verkefni í database-ið
 * @param {object} req beiðnin
 * @param {object} res svarið
 */
async function postTodo(req, res) {
  // curl -d '{}' -H "Content-Type: application/json" -X POST http://localhost:3000/
  // sækjum gildi úr beiðninni
  let {
    title,
    position,
    due,
  } = req.body;

  // hreinsihreins
  title = xss(title);
  position = xss(position);
  due = xss(due);

  if (position.length === 0) {
    position = 0;
  }
  if (due.length === 0) {
    due = null;
  }

  // tékkum beiðnina miðað við reglurnar sem við settum
  const errors = validationResult(req);
  // tékkum hvort við fengum errora
  if (!errors.isEmpty()) {
    return res.status(400).json(validate(errors.array()));
  }

  // ef við erum komin hingað fengust engar villur
  const todo = await createTodo(title, position, due);
  return res.status(201).json(todo);
}

async function updateTodo(req, res) {
  const { id } = req.params;

  // sækjum gildi úr beiðninni
  const {
    title,
    position,
    due,
    completed,
  } = req.body;

  const bodyLength = Object.keys(req.body).length;
  if (bodyLength === 0 || bodyLength === undefined || bodyLength === null) {
    return res.status(400).json({ error: 'Engin gildi í beiðninni' });
  }

  const data = {};
  // hreinsa
  data.title = xss(title);
  data.position = position; // validatorinn checkar hvort int eða ekki
  data.due = xss(due);
  data.completed = completed; // validatorinn checkar hvort boolean eða ekki

  // tékkum beiðnina miðað við reglurnar sem við settum
  const errors = validationResult(req);
  // tékkum hvort við fengum errora
  if (!errors.isEmpty()) {
    return res.status(400).json(validate(errors.array()));
  }

  if (data.title.length === 0) {
    data.title = null;
  }
  if (typeof data.position !== 'number') {
    data.position = null;
  }
  if (data.due.length === 0) {
    data.due = null;
  }
  if (typeof data.completed !== 'boolean') {
    data.completed = null;
  }

  const todo = await updateTodoById(id, data);
  if (todo.length === 0) {
    return res.status(404).json({ error: '404. Ekkert verkefni með þetta id' });
  }
  return res.status(201).json(todo);
}

/**
 * Eyðir verkefni úr gagnagrunninum
 * @param {object} req beiðnin
 * @param {object} res svarið
 */
async function deleteTodo(req, res) {
  const { id } = req.params;
  const rowCount = await deleteTodoById(id);
  if (rowCount === 0) {
    return res.status(404).json({ error: '404. Ekkert verkefni með þetta id' });
  }
  return res.status(204).json();
}

router.get('/', catchErrors(allTodos));
router.get('/:id', catchErrors(todoById));
router.post('/', validatePost, catchErrors(postTodo));
router.patch('/:id', validatePatch, catchErrors(updateTodo));
router.delete('/:id', catchErrors(deleteTodo));

module.exports = router;
